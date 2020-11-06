import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { UserContext } from '@/context/UserContext'

import {
  PaddingView,
  ScreenHeaderTitle,
  AppText,
  AppButton,
  TransitionIndicator,
  FloatingAppInput,
  Notification,
} from '@/components'
import { EyeDark, EyeLight, VerifiedGreen, Close } from '@/assets/images/icons'
import { normalize, Colors } from '@/globals'

import ProfileInfoService from '@/services/Profile/ProfileInfo'
import { Context } from '@/context'

const ChangePassword = ({ toggleChangePassword }) => {
  const { user } = useContext(UserContext)
  const { openNotification, closeNotification } = useContext(Context)
  const [currentPassword, setCurrentPassword] = useState(undefined)
  const [newPassword, setNewPassword] = useState(undefined)
  const [confirmPassword, setConfirmPassword] = useState(undefined)
  const [isUpdating, setisUpdating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleg, setIsVisibleg] = useState(false)
  const [isVisiblei, setIsVisiblei] = useState(false)
  const { uid } = user
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()
  const [verified, setVerified] = useState()
  const [showVerified, setShowVerified] = useState(false)
  const [buttonStyle, setButtonStyle] = useState({})
  const [buttonDisable, setButtonDisable] = useState(false)

  const onSaveHandler = () => {
    setisUpdating(true)
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        ProfileInfoService.updatePassword(
          {
            current_password: currentPassword,
            new_password: newPassword,
          },
          uid
        )
          .then(response => {
            if (response.success) {
              setisUpdating(false)
              triggerNotification(
                'Password has been updated successfully!',
                'success'
              )
            } else {
              setisUpdating(false)
              triggerNotification(response.message, 'error')
              console.log(response)
            }
          })
          .catch(error => {
            setisUpdating(false)
            console.log(error)
          })
      } else {
        setisUpdating(false)
        triggerNotification(
          "New Password and Confirm Password didn't match",
          'error'
        )
      }
    } else {
      setisUpdating(false)
      triggerNotification(
        'Please complete the form before you can update the your Password',
        'error'
      )
      //console.log('Please complete form');
    }
  }

  const onCurrentPasswordValidate = () => {
    ProfileInfoService.validateCurrentPassword({
      uid: uid,
      current_password: currentPassword,
    })
      .then(response => {
        if (response.verified) {
          setVerified(true)
          setShowVerified(true)
          hideIcon()
          setButtonState(false)
        } else {
          triggerNotification('Current Password does not correct', 'error')
          setButtonState(true)
        }
      })
      .catch(error => {
        setisUpdating(false)
        setVerified(false)
        setShowVerified(true)
        hideIcon()
        setButtonState(true)
      })
  }

  const setButtonState = j => {
    if (j) {
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      })
    } else {
      setButtonStyle({})
    }
    setButtonDisable(j)
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
    closeNotificationTimer()
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

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType()
      setNotificationMessage()
      closeNotification()
    }, 5000)
  }

  const hideIcon = () => {
    setTimeout(() => {
      setShowVerified(false)
    }, 5000)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Notification message={notificationMessage} type={notificationType} />
        <TransitionIndicator loading={isUpdating} />

        <View
          style={{
            flex: 1,
            padding: 24,
          }}>
          <ScreenHeaderTitle
            title="Current Password"
            close={toggleChangePassword}
          />

          <View style={{ position: 'relative' }}>
            <FloatingAppInput
              value={currentPassword}
              label="Current Password"
              onChangeText={currentPassword => {
                setCurrentPassword(currentPassword)
              }}
              onEndEditing={onCurrentPasswordValidate}
              secureTextEntry={!isVisible ? true : false}
              customStyle={{
                marginTop: normalize(35),
                marginBottom: normalize(16),
              }}
            />
            <View style={styles.passwordToggle}>
              {!showVerified ? (
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  {!isVisible ? <EyeDark /> : <EyeLight />}
                </TouchableOpacity>
              ) : (
                <View style={{ paddingTop: normalize(4) }}>
                  {verified ? (
                    <VerifiedGreen
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                  ) : null}
                </View>
              )}
            </View>
          </View>
          <View style={{ position: 'relative' }}>
            <FloatingAppInput
              value={newPassword}
              label="New Password"
              onChangeText={newPassword => {
                setNewPassword(newPassword)
              }}
              customStyle={{ marginBottom: normalize(16) }}
              secureTextEntry={!isVisibleg ? true : false}
            />
            <View style={styles.passwordToggleO}>
              <TouchableOpacity onPress={() => setIsVisibleg(!isVisibleg)}>
                {!isVisibleg ? <EyeDark /> : <EyeLight />}
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ position: 'relative' }}>
            <FloatingAppInput
              value={confirmPassword}
              label="Confirm New Password"
              onChangeText={confirmPassword => {
                setConfirmPassword(confirmPassword)
              }}
              secureTextEntry={!isVisiblei ? true : false}
            />
            <View style={styles.passwordToggleO}>
              <TouchableOpacity onPress={() => setIsVisiblei(!isVisiblei)}>
                {!isVisiblei ? <EyeDark /> : <EyeLight />}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              bottom: 0,
            }}>
            <AppButton
              text="Change Password"
              type="primary"
              height="xl"
              disabled={buttonDisable}
              customStyle={buttonStyle}
              onPress={() => {
                onSaveHandler()
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(48),
  },

  passwordToggleO: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
})

export default ChangePassword
