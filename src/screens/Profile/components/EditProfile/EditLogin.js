import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Api from '@/services/Api'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
  FloatingAppInput,
  Notification,
} from '@/components'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import {
  CircleTick,
  EyeDark,
  EyeLight,
  Warning,
  VerifiedGreen,
} from '@/assets/images/icons'
import { normalize, Colors } from '@/globals'
import Verify from './VerifyAccount'
import Modal from 'react-native-modal'

const EditLogin = ({ toggleEditLogin, provider }) => {
  const { openNotification, closeNotification } = useContext(Context)
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const [newEmail, setNewEmail] = useState('')
  const [newMobile, setNewMobile] = useState('')
  const [password, setPassword] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [verify, setVerify] = useState(false)
  const isEmail = provider === 'email' ? true : false
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()
  const [isVisible, setIsVisible] = useState(false)

  const emailChangeHandler = newEmail => {
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    email.test(newEmail) === true ? setEnabled(true) : setEnabled(false)
    setNewEmail(newEmail)
  }

  const toggleVerify = async () => {
    const verifiedPasswordResponse = await Api.verifyPassword({
      body: { password: password },
    })
    if (verifiedPasswordResponse.verified) {
      const newLoginToUpdate = isEmail
        ? { email: newEmail }
        : { phone_number: newMobile }
      const changeLoginResponse = await Api.changeLogin({
        body: newLoginToUpdate,
        uid: user?.uid,
      })
      if (changeLoginResponse.success) setVerify(!verify)
      else {
        triggerNotification('Code failed to sent', 'danger')
        setEnabled(false)
      }
    }
    if (!verifiedPasswordResponse.verified) {
      triggerNotification('Current Password is not correct', 'danger')
      setEnabled(false)
    }
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

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Notification
          type={notificationType}
          containerStyle={{
            position: 'absolute',
            top: normalize(30),
          }}
          icon={notificationType === 'danger' ? <Warning /> : <CircleTick />}>
          {notificationMessage}
        </Notification>
        <ScreenHeaderTitle
          iconSize={16}
          title={isEmail ? 'Change Email Address' : 'Change Mobile Number'}
          close={() => {
            toggleEditLogin('')
          }}
          paddingSize={3}
        />
        <View style={{ flex: 1, backgroundColor: Colors.neutralsZircon }}>
          <View
            style={[
              styles.contentWrapper,
              {
                paddingTop: normalize(12),
                paddingBottom: normalize(32),
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
            ]}>
            <AppText
              textStyle="body1medium"
              customStyle={{ marginBottom: normalize(8) }}>
              {isEmail ? 'Current Email' : 'Current Mobile Number'}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" customStyle={{ marginRight: 12 }}>
                {isEmail ? userInfo.email.toLowerCase() : userInfo.phone_number}
              </AppText>
              <VerifiedGreen width={normalize(18)} height={normalize(18)} />
            </View>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <AppText textStyle="body1medium">
              {isEmail ? 'Enter new email address' : 'Change Mobile Number'}
            </AppText>
            <AppText
              textStyle="body2"
              customStyle={{
                marginTop: normalize(8),
                marginBottom: normalize(18),
              }}>
              For security reasons, enter your current password then complete
              the one-step verification.
            </AppText>
            {isEmail ? (
              <FloatingAppInput
                value={newEmail}
                label="New Email"
                customStyle={{
                  marginBottom: normalize(16),
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={newEmail => {
                  emailChangeHandler(newEmail)
                }}
              />
            ) : (
              <FloatingAppInput
                value={newMobile}
                label="New Mobile Number"
                autoCapitalize="none"
                keyboardType="number-pad"
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={() => {
                  setNewMobile(newMobile)
                }}
              />
            )}
            <View style={{ position: 'relative' }}>
              <FloatingAppInput
                value={password}
                label="Password"
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={password => {
                  setPassword(password)
                  setEnabled(true)
                }}
                secureTextEntry={!isVisible ? true : false}
              />
              <View style={styles.passwordToggle}>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  {!isVisible ? <EyeDark /> : <EyeLight />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              padding: 24,
              backgroundColor: Colors.neutralsWhite,
            }}>
            <AppButton
              text={isEmail ? 'Verify your email' : 'Verify your number'}
              type="primary"
              size="l"
              height="xl"
              disabled={!enabled}
              customStyle={{
                backgroundColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
                borderColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
              }}
              onPress={toggleVerify}
            />
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={verify}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onBackButtonPress={() => setVerify(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <Verify
          toggleVerify={() => {
            setVerify(false)
          }}
          provider={provider}
          login={isEmail ? userInfo.email : userInfo.phone_number}
          newLogin={isEmail ? newEmail : newMobile}
          toggleEditLogin={toggleEditLogin}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: normalize(8),
    padding: normalize(24),
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
  input: {
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
  },
  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(14),
  },
})

export default EditLogin
