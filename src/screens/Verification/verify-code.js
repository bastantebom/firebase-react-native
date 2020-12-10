import React, { useState, useContext, useRef } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Text,
} from 'react-native'
import { AppText, TransitionIndicator } from '@/components'
import { Notification } from '@/components/Notification'
import AppColor from '@/globals/Colors'
import { VerifySms } from '@/assets/images'
import { TextInput } from 'react-native-paper'
import Colors from '@/globals/Colors'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import { Icons } from '@/assets/images/icons'

/**
 * @typedef {Object} VerifyCodeProps
 * @property {string} login
 * @property {string} provider
 * @property {() => void} onSubmit
 */

/**
 * @typedef {Object} RootProps
 * @property {VerifyCodeProps} VerifyCode
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'VerifyCode'>} param0 */
const VerifyCodeScreen = ({ navigation, route, routes }) => {
  const { user } = useContext(UserContext)

  const { provider, login, onSubmit } = route.params
  const textInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const [code, setCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('success')
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  const handleResendCode = async () => {
    setIsNotificationVisible(false)
    setIsLoading(true)
    try {
      const response = await Api.resendCode({
        body: {
          provider,
        },
        uid: user.uid,
      })
      if (!response.success) throw new Error(response.message)
      setNotificationMessage(
        <View>
          <AppText textStyle="body2" customStyle={{ color: '#fff' }}>
            Verification code has been sent to {login}
          </AppText>
        </View>
      )
      setNotificationType('success')
    } catch (error) {
      console.log(error)
      setNotificationType('danger')
      setNotificationMessage(
        <Text style={{ color: '#fff' }}>{error.message || error}</Text>
      )
    }

    setIsLoading(false)
    setIsNotificationVisible(true)
  }

  const submit = async code => {
    setIsNotificationVisible(false)
    setIsLoading(true)
    try {
      const response = await Api.verifyCode({
        body: {
          provider,
          code: code.join(''),
        },
        uid: user.uid,
      })

      if (!response.success) throw new Error(response.message)
      onSubmit?.()
    } catch (error) {
      console.log(error.message || error)
      setNotificationMessage(
        <Text style={{ color: '#fff' }}>{error.message || error}</Text>
      )
      setNotificationType('danger')
      setIsNotificationVisible(true)
    }

    setIsLoading(false)
  }

  /**
   * @param {string} value
   * @param {number} index
   *  */
  const handleInputChange = (value, index) => {
    const _code = [...code]
    _code[index] = value.replace(/[^0-9]/g, '')
    setCode(_code)

    if (!_code[index].length) return
    if (index !== 3) textInputsRef[index + 1].current.focus()
    else if (_code.every(number => number.length))
      Keyboard.dismiss(), submit(_code)
  }

  /**
   * @param {React.FocusEvent} event
   * @param {number} index
   */
  const handelInputKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index)
      textInputsRef[index - 1].current.focus()
  }

  const getInputStyle = index => {
    let styles = {}
    if (code[index].length && !isNaN(code[index]))
      styles = { borderColor: Colors.contentOcean }

    switch (index) {
      case 0:
        styles = { ...styles, marginLeft: 0 }
        break
      case 3:
        styles = { ...styles, marginRight: 0 }
        break
    }
    return styles
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isNotificationVisible && (
        <Notification
          type={notificationType}
          onClose={() => setIsNotificationVisible(false)}
          icon={
            notificationType === 'danger' ? (
              <Icons.Warning />
            ) : (
              <Icons.CircleTick />
            )
          }>
          <View style={{ marginLeft: 15 }}>{notificationMessage}</View>
        </Notification>
      )}
      <View style={styles.container}>
        <TransitionIndicator loading={isLoading} />
        <View style={styles.alignCenter}>
          <VerifySms />
        </View>
        <View style={[styles.alignCenter, styles.spacingBottom]}>
          <AppText textStyle="display5">Enter Your Verification</AppText>
        </View>
        <View style={[styles.alignCenter, styles.spacingBottomx2]}>
          <AppText textStyle="body2" customStyle={styles.bodyContent}>
            An the 4-digit code has been sent to{' '}
            <AppText textStyle="body3" customStyle={styles.bodyContent}>
              {login}
            </AppText>
          </AppText>
        </View>
        <View style={[styles.verificationWrapper, styles.spacingBottomx4]}>
          {code.map((input, index) => (
            <TextInput
              key={index}
              ref={textInputsRef[index]}
              style={[styles.inputVerification, getInputStyle(index)]}
              keyboardType="number-pad"
              value={code[index]}
              autoFocus={!index}
              onChangeText={value => handleInputChange(value, index)}
              onKeyPress={event => handelInputKeyPress(event, index)}
              maxLength={1}
              theme={{
                colors: {
                  primary: AppColor.contentOcean,
                },
                fonts: {
                  regular: '',
                },
              }}
            />
          ))}
        </View>
        <View style={{ ...styles.alignCenter, ...styles.spacingBottom }}>
          <AppText textStyle="body2" customStyle={styles.bodyContent}>
            Didn’t receive a code?
          </AppText>
        </View>
        <TouchableOpacity
          customStyle={styles.alignCenter}
          onPress={handleResendCode}>
          <AppText
            textStyle="body2"
            customStyle={{
              ...styles.bodyContent,
              color: AppColor.contentOcean,
            }}>
            Resend code
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
    paddingTop: 96,
  },
  bodyContent: {
    textAlign: 'center',
  },
  spacingBottom: {
    marginBottom: 8,
  },
  spacingBottomx2: {
    marginBottom: 16,
  },
  spacingBottomx4: {
    marginBottom: 32,
  },
  verificationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputVerification: {
    flex: 1,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    fontSize: 40,
    lineHeight: 59,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginHorizontal: 8,
    borderColor: AppColor.contentEbony,
    backgroundColor: '#fff',
    fontFamily: 'RoundedMplus1c-Regular',
  },
  alignCenter: {
    alignItems: 'center',
  },
})

export default VerifyCodeScreen
