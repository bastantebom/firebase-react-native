import React, { useEffect, useRef, useState } from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { ScrollView } from 'react-native-gesture-handler'
import StatusBar from '@/components/StatusBar'
import utilStyles from '@/globals/util-styles'
import { Verify } from '@/assets/images'
import Api from '@/services/Api'
import Toast from '@/components/toast'
import Loader from '@/components/loader'

/**
 * @typedef {object} OtpScreenProps
 * @property {string} otpId
 * @property {string} sentTo
 * @property {function} onSuccess
 */

/**
 * @typedef {object} RootProps
 * @property {OtpScreenProps} OtpScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'OtpScreen'>} param0 */
const OtpScreen = ({ navigation, route }) => {
  const { otpId, sentTo, onSuccess } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState(['', '', '', ''])
  const textInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const submit = async code => {
    setIsLoading(true)
    try {
      const response = await Api.verifyOtp({
        body: {
          code: code.join(''),
          otp_id: otpId,
        },
      })

      if (!response.success) throw new Error(response.message)
      setIsLoading(false)
      onSuccess?.()
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

  const handleOnResend = async () => {
    setIsLoading(true)
    try {
      const response = await Api.resendOtp({ body: { otp_id: otpId } })
      if (!response.success) throw new Error(response.message)
      Toast.show({
        label: `Verification code has been sent to ${sentTo}`,
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

  const handleOnInputChange = (value, index) => {
    const _code = [...code]
    _code[index] = value.replace(/[^0-9]/g, '')
    setCode(_code)

    if (!_code[index].length) return
    if (index !== 3) textInputsRef[index + 1].current.focus()
    else if (_code.every(number => number.length))
      Keyboard.dismiss(), submit(_code)
  }

  const handleOnInputKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index)
      textInputsRef[index - 1].current.focus()
  }

  return (
    <>
      <Toast
        containerStyle={{ marginTop: normalize(16) }}
        ref={ref => Toast.setRef(ref, 'otp')}
      />
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <Loader visible={isLoading} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[utilStyles.alignCenter, { marginTop: normalize(32) }]}>
            <Verify />
            <Text style={[typography.display5, { marginTop: normalize(8) }]}>
              Enter Verification Code
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              A 4-digit code has been sent{'\n'}to{' '}
              <Text style={typography.medium}>{sentTo}</Text>
            </Text>
          </View>
          <View style={styles.inputsWrapper}>
            {code.map((input, index) => (
              <TextInput
                key={index}
                ref={textInputsRef[index]}
                style={[styles.input, getInputStyle(index)]}
                keyboardType="number-pad"
                value={code[index]}
                autoFocus={!index}
                onChangeText={value => handleOnInputChange(value, index)}
                onKeyPress={event => handleOnInputKeyPress(event, index)}
                maxLength={1}
                fontFamily={'RoundedMplus1c-Regular'}
                theme={{
                  colors: { primary: Colors.contentOcean },
                  fonts: { regular: '' },
                }}
                selectTextOnFocus
              />
            ))}
          </View>
          <View style={utilStyles.alignCenter}>
            <Text style={[typography.body2, { marginTop: normalize(40) }]}>
              Didn’t receive a code?
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleOnResend}>
              <Text
                style={[typography.body2, typography.medium, typography.link]}>
                Resend code
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  headerIcon: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    fontSize: normalize(40),
    lineHeight: 59,
    paddingVertical: 14,
    paddingHorizontal: normalize(22),
    marginHorizontal: normalize(8),
    borderColor: Colors.neutralGray,
    backgroundColor: '#fff',
    fontFamily: 'RoundedMplus1c-Regular',
  },
  inputsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(32),
  },
  content: {
    padding: normalize(24),
  },
})

export default OtpScreen
