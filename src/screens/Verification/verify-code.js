import React, { useState, useContext, useRef } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
  Text,
  StatusBar,
} from 'react-native'
import { ScreenHeaderTitle, TransitionIndicator } from '@/components'
import AppColor from '@/globals/Colors'
import { VerifySms } from '@/assets/images'
import { TextInput } from 'react-native-paper'
import Colors from '@/globals/Colors'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import { normalize } from '@/globals'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'
import { isEmail } from '@/globals/Utils'
import typography from '@/globals/typography'

/**
 * @typedef {Object} VerifyCodeProps
 * @property {string} login
 * @property {string} provider
 * @property {() => void} onSubmit
 * @property {() => void} onBackPress
 */

/**
 * @typedef {Object} RootProps
 * @property {VerifyCodeProps} VerifyCode
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'VerifyCode'>} param0 */
const VerifyCodeScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext)

  const { provider, login, onSubmit, onBackPress } = route.params
  const textInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const [code, setCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const response = await Api.resendCode({
        body: {
          provider,
        },
        uid: user.uid,
      })
      if (!response.success) throw new Error(response.message)
      Toast.show({
        label: `Verification code has been sent to ${
          isEmail(login) ? login : `+63${login}`
        }`,
        type: 'success',
        dismissible: true,
        screenId: 'verify-code',
        timeout: 5000,
      })
    } catch (error) {
      console.log(error)
      Toast.show({
        label:
          error.message === 'Invalid code'
            ? error.mesage
            : 'Oops, something went wrong',
        type: 'error',
        dismissible: true,
        screenId: 'verify-code',
        timeout: 5000,
      })
    }

    setIsLoading(false)
  }

  const submit = async code => {
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
      Toast.show({
        label: 'Oops, something went wrong',
        type: 'error',
        dismissible: true,
        screenId: 'verify-code',
        timeout: 5000,
      })
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
    <View style={styles.wrapper}>
      <Toast
        containerStyle={{ marginTop: normalize(16) }}
        ref={ref => Toast.setRef(ref, 'verify-code')}
      />
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ padding: normalize(24) }}>
        <ScreenHeaderTitle close={() => onBackPress?.()} />
      </View>
      <View style={styles.container}>
        <TransitionIndicator loading={isLoading} />
        <View style={styles.alignCenter}>
          <VerifySms />
        </View>
        <View style={[styles.alignCenter, styles.spacingBottom]}>
          <Text style={[typography.display5]}>Enter Your Verification</Text>
        </View>
        <View style={[styles.alignCenter, styles.spacingBottomx2]}>
          <Text style={typography.body2narrow}>
            A 4-digit code has been sent to{' '}
            <Text style={typography.medium}>
              {isEmail(login) ? login : `+63${login.slice(-10)}`}
            </Text>
          </Text>
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
              fontFamily={'RoundedMplus1c-Regular'}
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
          <Text style={typography.body2}>Didn’t receive a code?</Text>
        </View>
        <TouchableOpacity
          customStyle={styles.alignCenter}
          onPress={handleResendCode}>
          <Text
            style={[typography.body2, typography.link, typography.textCenter]}>
            Resend code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  container: {
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
    paddingTop: 96,
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
    fontSize: normalize(40),
    lineHeight: 59,
    paddingVertical: 14,
    paddingHorizontal: normalize(22),
    marginHorizontal: normalize(8),
    borderColor: AppColor.contentEbony,
    backgroundColor: '#fff',
    fontFamily: 'RoundedMplus1c-Regular',
  },
  alignCenter: {
    alignItems: 'center',
  },
})

export default VerifyCodeScreen
