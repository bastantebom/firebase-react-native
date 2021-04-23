import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
} from 'react-native'
import TextInput from '@/components/textinput'
import { Guide, Images } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import Svg, { Circle } from 'react-native-svg'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import Api from '@/services/Api'
import Loader from '@/components/loader'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} ReportPostScreenProps
 * @property {string} postId
 */

/**
 * @typedef {object} RootProps
 * @property {ReportPostScreenProps} ReportPostScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ReportPostScreen'>} param0 */
const ReportPostScreen = ({ navigation, route }) => {
  const { postId } = route.params

  const [selectedReason, setSelectedReason] = useState(null)
  const [reportMessageVisible, setReportMessageVisible] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const reasons = [
    {
      label: 'It’s suspicious or spam.',
    },
    {
      label: 'It’s abusive and/or harmful.',
    },
    {
      label: 'Includes inappropriate content.',
    },
    {
      label: 'Others',
    },
  ]

  const handleOnReasonPress = reason => {
    setSelectedReason(reason.label)
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const message =
        selectedReason === 'Others' ? reportMessage : selectedReason
      const response = await Api.reportPost({
        pid: postId,
        body: {
          message,
        },
      })
      if (!response.success) throw new Error(response.message)
      setIsSubmitted(true)
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsLoading(false)
  }

  const handleOnReportPress = () => {
    if (isSubmitted) {
      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.goBack()
      return
    }
    if (selectedReason === 'Others' && !reportMessageVisible)
      setReportMessageVisible(true)
    else handleOnSubmit()
  }

  const backPressHandler = event => {
    if (reportMessageVisible && navigation.isFocused()) {
      event.preventDefault()
      setReportMessageVisible(false)
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader visible={isLoading} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Report Post</Text>
          </View>
        </View>
        <View style={styles.content}>
          {isSubmitted ? (
            <View>
              <Images.ReportSuccess
                style={{ marginBottom: normalize(16) }}
                {...iconSize(80)}
              />
              <Text style={[typography.body1, typography.medium]}>
                Thanks for letting us know!
              </Text>
              <Text style={[typography.body1, { marginTop: normalize(12) }]}>
                If we find that this account is violating the Servbees Rules, we
                will take action on it. {'\n\n'}We will always ensure that our
                community is safe and helpful for everyone.
              </Text>
            </View>
          ) : (
            <>
              <Images.ReportPost {...iconSize(80)} />
              <Text style={[typography.body1, { marginTop: normalize(8) }]}>
                Help us understand why you are reporting this post.
              </Text>

              {!reportMessageVisible ? (
                <View style={styles.reasons}>
                  {reasons.map(reason => (
                    <TouchableOpacity
                      onPress={() => handleOnReasonPress(reason)}
                      activeOpacity={0.7}
                      style={[
                        styles.reason,
                        reason.label === selectedReason
                          ? { borderColor: Colors.contentEbony }
                          : {},
                      ]}
                      key={reason.label}>
                      <Text style={typography.body2}>{reason.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ marginTop: normalize(32) }}>
                  <TextInput
                    value={reportMessage}
                    placeholder="Be more specific about why you think this account is suspicious."
                    placeholderTextColor="#A8AAB7"
                    onChangeText={setReportMessage}
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button
          label={
            isSubmitted
              ? 'Okay'
              : selectedReason === 'Others' && !reportMessageVisible
              ? 'Next'
              : 'Report Post'
          }
          type={
            !selectedReason || (reportMessageVisible && !reportMessage?.length)
              ? 'disabled'
              : 'primary'
          }
          disabled={
            !selectedReason || (reportMessageVisible && !reportMessage?.length)
          }
          onPress={handleOnReportPress}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  content: {
    padding: normalize(24),
    paddingTop: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  titleWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: normalize(16),
    position: 'absolute',
    width: '100%',
  },
  reasons: {
    marginTop: normalize(16),
  },
  reason: {
    marginBottom: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderWidth: normalize(1),
    borderColor: Colors.neutralsZircon,
    borderRadius: normalize(4),
  },
  buttonsWrapper: {
    padding: normalize(24),
  },
})

export default ReportPostScreen
