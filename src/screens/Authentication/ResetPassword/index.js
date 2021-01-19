import React, { useState, useContext, useRef, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native'

import {
  Notification,
  AppViewContainer,
  AppButton,
  AppInput,
  AppText,
  FloatingAppInput,
} from '@/components'

import ResetPasswordLock from '@/assets/images/reset-password.svg'

import {
  CircleTick,
  Close,
  HeaderBackGray,
  Warning,
} from '@/assets/images/icons'

import ForgotPasswordService from '@/services/ForgotPassword'
import Api from '@/services/Api'

import styles from './resetPassword.scss'

import { Context } from '@/context'
import { Colors, normalize } from '@/globals'

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')

  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [buttonState, setButtonState] = useState('dark')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Send')
  const [notif, showNotif] = useState(false)

  const [useEmail, setUseEmail] = useState(true)

  const toggleUseEmail = () => {
    setUseEmail(!useEmail)
  }

  useEffect(() => {
    onEmailChange('')
  }, [useEmail])

  const onEmailChange = text => {
    if (useEmail) {
      setEmail(text)
    } else {
      if (!isNaN(text)) {
        const n = text.includes('+63')
        let newValue = text
        if (!n) newValue = `+63${text}`

        setEmail(newValue)
      }
    }
    setButtonDisabled(false)
    setButtonState('active')

    if (text === '') {
      setButtonDisabled(true)
      setButtonState('dark')
    }
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
  }

  const sendResetPasswordEmail = async () => {
    let parameters = {
      body: { login: email },
    }

    const response = await Api.forgotPassword(parameters)

    setButtonLoading(false)
    setButtonDisabled(false)
    closeNotificationTimer()

    if (response?.success) {
      setNotificationType('success')
      setButtonText('Resend the link')
      return (
        <AppText
          color={'white'}
          textStyle="body2"
          customStyle={styles.notificationText}>
          We sent {useEmail ? 'an email' : 'an sms'} to{' '}
          <AppText color={'white'} customStyle={styles.email}>
            {email}.
          </AppText>{' '}
          Click the link in the {useEmail ? 'email' : 'sms'} to reset your
          password.
        </AppText>
      )
    } else {
      setNotificationType('danger')
      return (
        <AppText textStyle="body2" customStyle={notificationErrorTextStyle}>
          Verification code wasn’t sent. The{' '}
          {useEmail ? 'email' : 'mobile number'}{' '}
          <AppText customStyle={styles.email}>{email}</AppText> does not exist
          in our database.
        </AppText>
      )
    }
  }

  async function sendEmail() {
    const msg = await sendResetPasswordEmail()
    setNotificationMessage(msg)
    showNotif(true)
  }

  const closeNotificationTimer = () => {
    const timeout = setTimeout(() => {
      showNotif(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="black" barStyle={'light-content'} />
      {notif && (
        <SafeAreaView style={{ zIndex: 2 }}>
          <Notification
            type={notificationType}
            animationOptions={{ height: 90 }}
            icon={notificationType === 'danger' ? <Warning /> : <CircleTick />}>
            {notificationMessage}
          </Notification>
        </SafeAreaView>
      )}
      <AppViewContainer paddingSize={3} customStyle={styles.container}>
        <View style={styles.closeIconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HeaderBackGray width={16} height={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.resetPasswordContainer}>
          <ResetPasswordLock width={80} height={80} />
        </View>

        <AppText customStyle={styles.resetPasswordText} textStyle="display5">
          Reset Password
        </AppText>

        <AppText customStyle={styles.resetPasswordSubText} textStyle="caption">
          No worries, it happens to the best of us!
        </AppText>

        <FloatingAppInput
          label={useEmail ? 'Email' : 'Mobile Number'}
          value={email}
          onChangeText={text => onEmailChange(text)}
        />

        <TouchableOpacity
          style={{ paddingVertical: 8 }}
          onPress={toggleUseEmail}>
          <AppText color={Colors.contentOcean}>
            Use mobile number instead
          </AppText>
        </TouchableOpacity>

        <View style={{ marginTop: 8 }}>
          <AppButton
            text={buttonText}
            type="primary"
            height="lg"
            customStyle={styles[buttonState]}
            loading={buttonLoading}
            disabled={buttonDisabled}
            onPress={() => {
              setButtonLoading(true)
              setButtonDisabled(true)
              sendEmail()
              Keyboard.dismiss()
            }}
          />
        </View>
      </AppViewContainer>
    </SafeAreaView>
  )
}

export default ResetPassword
