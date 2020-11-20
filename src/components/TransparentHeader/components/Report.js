//import liraries
import React, { useState, useContext } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import {
  TransitionIndicator,
  ScreenHeaderTitle,
  AppButton,
  Notification,
  AppText,
} from '@/components'
import { Colors, normalize } from '@/globals'
import AdminFunctionService from '@/services/Admin/AdminFunctions'
import PostService from '@/services/Post/PostService'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CircleTick } from '@/assets/images/icons'

// create a component
const Report = ({
  toggleReportUser,
  username,
  userID,
  postId,
  postTitle,
  type,
}) => {
  const { user } = useContext(UserContext)
  const { openNotification, closeNotification } = useContext(Context)
  const [reportMessage, setReportMessage] = useState('')
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  })
  const [buttonDisable, setButtonDisable] = useState(true)
  const [IS_UPDATING, setIS_UPDATING] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  const { uid, displayName } = user

  //console.log(displayName);

  const reportMessageHandler = text => {
    //console.log(text);
    if (text.length > 0) {
      setButtonState(false)
    } else {
      setButtonState(true)
    }
    setReportMessage(text)
  }

  const setButtonState = j => {
    setButtonStyle({})
    if (j) {
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      })
    }
    setButtonDisable(j)
  }

  const onSubmitReportHandler = () => {
    setIS_UPDATING(true)
    if (type === 'user') {
      AdminFunctionService.reportUser({
        reported_uid: userID,
        message: reportMessage,
        uid: uid,
      })
        .then(response => {
          if (response.success) {
            setIS_UPDATING(false)
            triggerNotification(
              username +
                ' has been reported successfully. We will review it and validate it. Wait 24 to 48 hours for our feedback',
              'success'
            )
            setReportMessage('')
          } else {
            setIS_UPDATING(false)

            console.log(response)
          }
        })
        .catch(error => {
          setIS_UPDATING(false)

          console.log(error)
        })
    } else {
      console.log('report post')
      PostService.reportPost({
        pid: postId,
        message: reportMessage,
        uid: uid,
      })
        .then(response => {
          if (response.success) {
            setIS_UPDATING(false)
            triggerNotification(
              'Post has been reported successfully. We will review it and validate it. Wait 24 to 48 hours for our feedback',
              'success'
            )
            setReportMessage('')
          } else {
            setIS_UPDATING(false)
            console.log(response)
          }
        })
        .catch(error => {
          setIS_UPDATING(false)
          console.log(error)
        })
    }
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  }

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
  }

  const triggerNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>
    )
    openNotification()
    //setIsScreenLoading(false);
    closeNotificationTimer()
  }

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType()
      setNotificationMessage()
      closeNotification()
    }, 5000)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TransitionIndicator loading={IS_UPDATING} />
        <View
          style={{
            flex: 1,
            padding: 24,
          }}>
          <Notification type={notificationType} icon={<CircleTick />}>
            {notificationMessage}
          </Notification>
          <ScreenHeaderTitle
            title={
              username
                ? 'Report @' + username
                : postTitle.length > 20
                ? `${postTitle.substring(0, 20)}...`
                : postTitle
            }
            close={toggleReportUser}
            icon="close"
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ paddingTop: normalize(16) }}>
            <TextInput
              value={reportMessage}
              multiline={true}
              placeholder={
                username
                  ? 'Describe your Report to @' + username
                  : 'Describe your Report to this Post'
              }
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
              onChangeText={text => reportMessageHandler(text)}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />
          </ScrollView>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              bottom: 0,
            }}>
            <AppButton
              text="Send Report"
              type="primary"
              height="xl"
              disabled={buttonDisable}
              customStyle={buttonStyle}
              onPress={() => {
                onSubmitReportHandler()
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

//make this component available to the app
export default Report
