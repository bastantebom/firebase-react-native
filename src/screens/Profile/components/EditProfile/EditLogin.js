//import liraries
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
import { EyeDark, EyeLight } from '@/assets/images/icons'
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
        triggerNotification('Code failed to sent', 'error')
        setEnabled(false)
      }
    }
    if (!verifiedPasswordResponse.verified) {
      triggerNotification('Current Password is not correct', 'error')
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
          message={notificationMessage}
          type={notificationType}
          top={normalize(30)}
          position="absolute"
        />
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title={isEmail ? 'Change Email Address' : 'Change Mobile Number'}
            close={() => {
              toggleEditLogin('')
            }}
          />
        </PaddingView>
        <View style={{ flex: 1, backgroundColor: Colors.neutralsZircon }}>
          <View style={[styles.contentWrapper]}>
            <PaddingView paddingSize={3}>
              <View>
                <View style={{ paddingVertical: 32 }}>
                  <AppText textStyle="body2">
                    {isEmail ? 'Current Email' : 'Current Mobile Number'}
                  </AppText>
                  <AppText textStyle="body1">
                    {isEmail
                      ? userInfo.email.toLowerCase()
                      : userInfo.phone_number}
                  </AppText>

                  <AppText
                    textStyle="captionConstant"
                    customStyle={{ marginTop: normalize(18) }}>
                    {isEmail
                      ? 'You signed up using Something. Something copy here. Something, something.'
                      : 'You signed up using Something. Something copy here. Something, something.'}
                  </AppText>
                </View>
              </View>
            </PaddingView>
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
            <PaddingView paddingSize={3}>
              <AppText textStyle="body2">
                {isEmail ? 'Change Email Address' : 'Change Mobile Number'}
              </AppText>
              <AppText textStyle="captionConstant">
                {isEmail ? 'Something, Something' : 'Something, Something'}
              </AppText>
              {isEmail ? (
                <FloatingAppInput
                  value={newEmail}
                  label="New Email"
                  customStyle={{ marginBottom: normalize(16), marginTop: 40 }}
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
            </PaddingView>
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

// define your styles
const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
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

//make this component available to the app
export default EditLogin
