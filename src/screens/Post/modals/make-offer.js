import { BottomSheetHeader } from '@/components'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import TextInput from '@/components/textinput'
import PriceInput from '@/components/textinput/price-input'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { Context } from '@/context'
import PostImage from '@/components/Post/post-image'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Api from '@/services/Api'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import Loader from '@/components/loader'

const { height } = Dimensions.get('screen')

/**
 * @param {object} props
 * @property {{minimum: number, maximum: number}} budget
 * @property {function} onAttachPostPress
 * @property {function} onSubmit
 **/
const MakeOfferModal = ({ budget, onAttachPostPress, onSubmit }) => {
  const { basket, setBasket } = useContext(Context)
  const { userInfo } = useContext(UserContext)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const budgetLabel = `₱${formatNumber(budget.minimum, {
    separator: '.',
    precision: 2,
    delimiter: ',',
  })} - ₱${formatNumber(budget.maximum, {
    separator: '.',
    precision: 2,
    delimiter: ',',
  })}`

  const canSubmit = () => {
    return basket.offer <= budget.maximum && basket.offer >= budget.minimum
  }

  const onKeyboardShowHandler = e => {
    setKeyboardHeight(e.endCoordinates.height)
  }

  const onKeyboardHideHandler = () => {
    setKeyboardHeight(0)
  }

  const getPostCount = async () => {
    try {
      const postCountResponse = await Api.getUserPostsCount({
        uid: userInfo?.uid,
      })
      if (postCountResponse.success)
        setPostCount(postCountResponse.count - (await archivedCount()))
    } catch (error) {
      console.log(error.message || error)
    }
    setLoading(false)
  }

  const archivedCount = async () => {
    const posts = await firestore()
      .collection('posts')
      .where('uid', '==', userInfo?.uid)
      .where('archived', '==', true)
      .get()
    return posts.docs.length || 0
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardShowHandler)
    Keyboard.addListener('keyboardDidHide', onKeyboardHideHandler)

    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardShowHandler)
      Keyboard.removeListener('keyboardDidHide', onKeyboardHideHandler)
    }
  }, [])

  useEffect(() => {
    if (userInfo?.uid) getPostCount()
  }, [userInfo])

  return (
    <>
      <Loader visible={loading} />
      <View
        style={[
          styles.container,
          {
            maxHeight: height - keyboardHeight - getStatusBarHeight(),
          },
        ]}>
        <BottomSheetHeader />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Make an Offer</Text>
        </View>
        <View style={styles.budgetWraper}>
          <Text style={[typography.eyebrow, { marginRight: normalize(8) }]}>
            BUDGET
          </Text>
          <Text style={typography.subtitle1}>{budgetLabel}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: null })}>
          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <PriceInput
                value={basket.offer}
                priceLabel="You are offering"
                onChangeText={offer =>
                  setBasket(basket => ({
                    ...basket,
                    offer,
                  }))
                }
                containerStyle={[
                  basket.offer < budget.minimum || basket.offer > budget.maximum
                    ? {
                        borderColor: Colors.secondaryBrinkPink,
                        marginBottom: normalize(16),
                      }
                    : {},
                ]}
                message={
                  basket.offer < budget.minimum
                    ? 'Uh-oh please make a better offer. '
                    : basket.offer > budget.maximum
                    ? "Oops it's a little out of budget. "
                    : ''
                }
                messageStyle={{
                  color: Colors.secondaryBrinkPink,
                }}
                placeholder="0.00"
              />
            </View>
            <View style={styles.formGroup}>
              <TextInput
                placeholder="Add more offer details."
                placeholderTextColor="#A8AAB7"
                label="Message (Optional)"
                value={basket.message}
                multiline
                numberOfLines={5}
                onChangeText={message =>
                  setBasket(basket => ({ ...basket, message }))
                }
              />
            </View>
            <View style={[styles.divider, { marginBottom: normalize(8) }]} />
            {!!postCount && (
              <View>
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { marginBottom: normalize(3) },
                  ]}>
                  Share an existing post? (Optional)
                </Text>
                <Text
                  style={[typography.body2, { marginBottom: normalize(16) }]}>
                  Give more details through a post.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.attachedPostWrapper,
                    {
                      borderColor: !basket.attachedPost
                        ? Colors.neutralGray
                        : Colors.contentEbony,
                    },
                  ]}
                  onPress={onAttachPostPress}>
                  {basket.attachedPost ? (
                    <View style={styles.attachedPost}>
                      <View style={styles.thumbnailWrapper}>
                        <PostImage
                          path={basket.attachedPost.cover_photos?.[0]}
                          size="64x64"
                          postType={basket.attachedPost.type}
                        />
                      </View>
                      <Text style={typography.body2} numberOfLine={2}>
                        {basket.attachedPost.title}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={[
                          typography.body2,
                          { color: Colors.contentPlaceholder },
                        ]}>
                        Send a Post
                      </Text>
                      <Text style={typography.body1}>
                        Select one from your posts
                      </Text>
                    </View>
                  )}
                  <Icons.ChevronRight
                    style={{ color: Colors.icon }}
                    {...iconSize(24)}
                  />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.buttonWrapper}>
          <Button
            disabled={!canSubmit()}
            label="Make an Offer"
            type={!canSubmit() ? 'disabled' : 'primary'}
            onPress={onSubmit}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
  },
  titleWrapper: {
    margin: normalize(16),
    alignItems: 'center',
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  budgetWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: normalize(16),
  },
  formGroup: {
    marginBottom: normalize(16),
  },
  divider: {
    borderBottomColor: Colors.secondarySolitude,
    borderBottomWidth: normalize(1),
  },
  attachedPostWrapper: {
    borderWidth: normalize(1),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: normalize(4),
  },
  attachedPost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrapper: {
    padding: normalize(16),
  },
  thumbnailWrapper: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(4),
    overflow: 'hidden',
    marginRight: normalize(8),
  },
})

export default MakeOfferModal
