import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Keyboard, StatusBar, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import {
  Notification,
  AppViewContainer,
  AppButton,
  FloatingAppInput,
} from '@/components'

import ResetPasswordLock from '@/assets/images/reset-password.svg'

import { CircleTickWhite, HeaderBackGray, Warning } from '@/assets/images/icons'
import Api from '@/services/Api'

import styles from './resetPassword.scss'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')

  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('success')

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
        <Text style={[styles.notificationText, typography.body2]}>
          We sent {useEmail ? 'an email' : 'an sms'} to{' '}
          <Text style={styles.email}>{email}.</Text> Click the link in the{' '}
          {useEmail ? 'email' : 'sms'} to reset your password.
        </Text>
      )
    } else {
      setNotificationType('danger')
      return (
        <Text style={[notificationErrorTextStyle, typography.body2]}>
          Verification code wasn’t sent. The{' '}
          {useEmail ? 'email' : 'mobile number'}{' '}
          <Text style={styles.email}>{email}</Text> does not exist in our
          database.
        </Text>
      )
    }
  }

  const sendEmail = async () => {
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
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={{ marginTop: getStatusBarHeight(), flex: 1 }}>
        {notif && (
          <Notification
            type={notificationType}
            animationOptions={{ height: 90 }}
            icon={
              notificationType === 'danger' ? (
                <Warning />
              ) : (
                <CircleTickWhite
                  style={{ color: Colors.primaryMidnightBlue }}
                />
              )
            }>
            <Text>{notificationMessage}</Text>
          </Notification>
        )}
        <AppViewContainer paddingSize={3} customStyle={styles.container}>
          <View style={styles.closeIconContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <HeaderBackGray width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </View>

          <View style={styles.resetPasswordContainer}>
            <ResetPasswordLock width={80} height={80} />
          </View>

          <Text style={[styles.resetPasswordText, typography.display5]}>
            Reset Password
          </Text>

          <Text style={[styles.resetPasswordSubText, typography.caption]}>
            No worries, it happens to the best of us!
          </Text>

          <FloatingAppInput
            label={useEmail ? 'Email' : 'Mobile Number'}
            value={email}
            onChangeText={text => onEmailChange(text)}
          />

          <TouchableOpacity
            style={{ paddingVertical: 8 }}
            onPress={toggleUseEmail}>
            <Text style={{ color: Colors.contentOcean }}>
              {useEmail === 'email'
                ? 'Use email address instead'
                : 'Use mobile number instead'}
            </Text>
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
      </View>
    </>
  )
}

export default ResetPassword
