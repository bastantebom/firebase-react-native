import React, { useState, useContext } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native'
import {
  TransitionIndicator,
  ScreenHeaderTitle,
  AppButton,
  Notification,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import { Icons } from '@/assets/images/icons'

/**
 * @typedef {Object} ReportScreenProps
 * @property {object} user
 * @property {object} post
 */

/**
 * @typedef {Object} RootProps
 * @property {ReportScreenProps} ReportScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ReportScreen'>} param0 */
const ReportScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext)
  const { user: userData, post: postData } = route.params

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notificationType, setNotificationType] = useState('success')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationHeight, setNotificationHeight] = useState(70)

  const title = `Report ${
    userData
      ? '@' + userData.username
      : postData.title.length > 20
      ? `"${postData.title.substring(0, 20)}..."`
      : `"${postData.title}"`
  }`

  const placeholder = userData
    ? 'Be more specific about why you’re reporting this account.'
    : 'Be more specific about why you’re reporting this post.'

  const handleSubmit = async () => {
    setIsLoading(true)
    setNotificationMessage(null)
    try {
      const response = userData
        ? await Api.reportUser({ uid: user.uid, body: { message } })
        : await Api.reportPost({ pid: postData.id, body: { message } })

      if (!response.success) throw new Error(response.message)

      setNotificationType('success')
      setNotificationHeight(120)
      setNotificationMessage(
        <View style={styles.notificationMessage}>
          <Text style={styles.notificationTitle}>
            Thanks for letting us know!
          </Text>
          <Text style={styles.notificationText}>
            If we find that this {postData ? 'post' : 'account'} is violating
            the Servbees Rules, we will take action on it.
          </Text>
        </View>
      )
    } catch (error) {
      setNotificationType('danger')
      setNotificationHeight(null)
      setNotificationMessage(
        <View style={styles.notificationMessage}>
          <Text style={styles.notificationTitle}>Oops!</Text>
          <Text style={styles.notificationText}>
            There was an error sending report.
          </Text>
        </View>
      )
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        {!!notificationMessage && (
          <Notification
            type={notificationType}
            icon={
              notificationType === 'danger' ? (
                <Icons.Warning />
              ) : (
                <Icons.CircleTickWhite />
              )
            }
            onClose={() => setNotificationMessage(null)}
            animationOptions={{ height: notificationHeight }}>
            {notificationMessage}
          </Notification>
        )}
        <TransitionIndicator loading={isLoading} />
        <View style={styles.container}>
          <ScreenHeaderTitle
            title={title}
            close={navigation.goBack}
            icon="close"
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}>
            <TextInput
              value={message}
              multiline={true}
              placeholder={placeholder}
              placeholderTextColor="#A8AAB7"
              numberOfLines={Platform.OS === 'ios' ? null : 6}
              minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
              style={styles.textInput}
              onChangeText={setMessage}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />
          </ScrollView>

          <View style={styles.buttonWrapper}>
            <AppButton
              text="Send Report"
              type="primary"
              height="xl"
              onPress={handleSubmit}
              disabled={!message.length}
              customStyle={
                !message.length
                  ? {
                      backgroundColor: Colors.buttonDisable,
                      borderColor: Colors.buttonDisable,
                    }
                  : {}
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    bottom: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: normalize(24),
  },
  textInput: {
    borderColor: Colors.neutralGray,
    borderRadius: 4,
    borderWidth: 1,
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    letterSpacing: 0.5,
    padding: normalize(8),
    paddingHorizontal: normalize(16),
    textAlign: 'left',
  },
  notificationTitle: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    color: '#fff',
  },
  notificationText: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    color: '#fff',
  },
  notificationMessage: {
    marginLeft: normalize(16),
  },
})

export default ReportScreen
