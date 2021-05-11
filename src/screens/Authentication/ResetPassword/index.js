import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Keyboard, StatusBar, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'

import { AppViewContainer, AppButton, FloatingAppInput } from '@/components'

import ResetPasswordLock from '@/assets/images/reset-password.svg'

import { Icons } from '@/assets/images/icons'
import Api from '@/services/Api'

import styles from './resetPassword.scss'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [buttonState, setButtonState] = useState('dark')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Send')
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

  const sendResetPasswordEmail = async () => {
    let parameters = {
      body: { login: email },
    }

    const response = await Api.forgotPassword(parameters)
    setButtonLoading(false)
    setButtonDisabled(false)

    if (response?.success) {
      setButtonText('Resend the link')
      Toast.show({
        label: `We sent ${
          useEmail ? 'an email' : 'an sms'
        } to ${email} Click the link in the ${
          useEmail ? 'email' : 'sms'
        } to reset your password.`,
        type: 'success',
        dismissible: true,
        screenId: 'ResetPassword',
        timeout: 5000,
      })
    } else {
      Toast.show({
        label: `Verification code wasn’t sent. The ${
          useEmail ? 'email' : 'mobile number'
        } ${email} does not exist in our database`,
        type: 'error',
        dismissible: true,
        screenId: 'ResetPassword',
        timeout: 5000,
      })
    }
  }

  const sendEmail = async () => {
    await sendResetPasswordEmail()
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <View style={{ marginTop: getStatusBarHeight(), flex: 1 }}>
        <Toast
          containerStyle={{ marginTop: normalize(8) }}
          ref={ref => Toast.setRef(ref, 'ResetPassword')}
        />
        <AppViewContainer paddingSize={3} customStyle={styles.container}>
          <View style={styles.closeIconContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons.Back
                {...iconSize(24)}
                color={Colors.primaryMidnightBlue}
              />
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
