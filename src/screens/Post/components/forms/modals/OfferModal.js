import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  Animated,
  Image,
} from 'react-native'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText, BottomSheetHeader } from '@/components'

import { PriceInput } from '@/components/AppInput'

import { normalize, Colors } from '@/globals'
import BasketModal from './BasketModal'

import { ChevronRight } from '@/assets/images/icons'

import SelectPostModal from './SelectPostModal'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import { formatPrice } from '@/globals/Utils'

const OfferModal = ({ postType, postData }) => {
  const { user } = useContext(UserContext)
  const [offer, setOffer] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedPost, setSelectedPost] = useState()
  const [selectedPostDetails, setSelectedPostDetails] = useState({})

  const [selectPostModal, showSelectPostModal] = useState(false)
  const [basketModal, showBasketModal] = useState(false)
  const [animatedPadding] = useState(new Animated.Value(30))
  const [continueState, setContinueState] = useState(false)
  const [hasPost, setHasPost] = useState(0)

  function onKeyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight)
  }

  function onKeyboardDidHide() {
    keyboardToggleAnimation(0)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
    }
  }, [])

  let paddingAnimatedStyle = {
    paddingTop: normalize(10),
    paddingBottom: animatedPadding,
  }

  let keyboardToggleAnimation = height => {
    Animated.timing(animatedPadding, {
      toValue: height + 30,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  const [offerData, setOfferData] = useState({})

  useEffect(() => {
    setOfferData({
      price: offer,
      message,
      post_id: selectedPostDetails?.id,
    })

    setContinueState(!!offer)
  }, [offer, message, selectPostModal])

  const selectNeedFunction = post_id => {
    setSelectedPost(post_id)
    showSelectPostModal(false)
  }

  const getPostDetail = async post_id => {
    const post = await Api.getPost({ pid: post_id })
    const { data, success } = post
    if (success) setSelectedPostDetails(data)
  }

  const getUserPostCount = async () => {
    if (!user?.uid) return
    const { uid } = user
    const userPost = await Api.getUserPostsCount({ uid })
    if (userPost.success) setHasPost(userPost.count)
  }

  useEffect(() => {
    if (selectedPost) {
      getPostDetail(selectedPost)
    }
  }, [selectedPost])

  useEffect(() => {
    let isMounted = true
    if (isMounted) getUserPostCount()
    return () => (isMounted = false)
  }, [])

  const SelectedPost = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {selectedPostDetails?.cover_photos ? (
          <View
            style={{
              height: normalize(48),
              width: normalize(48),
            }}>
            <Image
              source={{ uri: selectedPostDetails?.cover_photos[0] }}
              style={styles.image}
            />
          </View>
        ) : (
          <></>
        )}

        <View style={{ paddingHorizontal: 16, justifyContent: 'center' }}>
          <AppText textStyle="body2">Send a post</AppText>
          <AppText textStyle="caption">{selectedPostDetails?.title}</AppText>
        </View>
      </View>
    )
  }

  return (
    <>
      <View>
        <KeyboardAwareScrollView
          keyboardOpeningTime={50}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingHorizontal: 20,
          }}>
          <BottomSheetHeader />
          <Animated.View style={paddingAnimatedStyle}>
            <AppText textStyle="subtitle1" customStyle={{ marginBottom: 24 }}>
              Make An Offer
            </AppText>

            <PriceInput
              style={{ marginBottom: 16 }}
              value={offer}
              keyboardType="number-pad"
              onChangeText={text => setOffer(formatPrice(text))}
              placeholder="00"
              label="You are offering"
            />

            <TextInput
              value={message}
              multiline={true}
              placeholder="Message"
              placeholderTextColor={Colors.neutralGray}
              numberOfLines={Platform.OS === 'ios' ? null : 6}
              minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
              style={{
                color: Colors.contentEbony,
                fontFamily: 'RoundedMplus1c-Regular',
                fontSize: normalize(16),
                letterSpacing: 0.5,
                borderColor: Colors.neutralGray,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 16,
                textAlign: 'left',
              }}
              onChangeText={text => setMessage(text)}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />

            {hasPost > 0 && (
              <TouchableOpacity
                style={{
                  borderColor: Colors.neutralGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  paddingHorizontal: normalize(20),
                  paddingVertical: normalize(20),
                }}
                onPress={() => showSelectPostModal(true)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {!selectedPost ? (
                    <View style={{ flexDirection: 'column' }}>
                      <AppText textStyle="body2">Send a post</AppText>
                      <AppText textStyle="caption">
                        Send one of your post
                      </AppText>
                    </View>
                  ) : (
                    <SelectedPost />
                  )}
                  <ChevronRight />
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={!continueState}
              style={[
                styles.btn,
                {
                  backgroundColor: continueState
                    ? Colors.primaryYellow
                    : Colors.buttonDisable,
                },
              ]}
              onPress={() => showBasketModal(true)}>
              <AppText textStyle="body3">Continue</AppText>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
      <Modal
        isVisible={basketModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <BasketModal
          closeModal={() => showBasketModal(false)}
          postType={postType}
          postData={postData}
          offerData={offerData}
          selectedPostDetails={selectedPostDetails}
        />
      </Modal>
      <Modal
        isVisible={selectPostModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <SelectPostModal
          closeModal={() => showSelectPostModal(false)}
          selectNeedFunction={selectNeedFunction}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 3,
    marginTop: normalize(20),
  },
  image: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: 8,
    backgroundColor: Colors.neutralGray,
  },
})

export default OfferModal
