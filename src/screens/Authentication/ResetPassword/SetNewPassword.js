import React, { useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native'

import { FloatingAppInput, TransitionIndicator } from '@/components'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { isEmail, normalize } from '@/globals/Utils'
import typography from '@/globals/typography'

import { EyeDark, EyeLight } from '@/assets/images/icons'

import Api from '@/services/Api'

/**
 * @typedef {object} SetNewPasswordScreenProps
 * @property {string} orderID
 * @property {object|undefined} post
 */

/**
 * @typedef {object} RootProps
 * @property {SetNewPasswordScreenProps} SetNewPasswordScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'SetNewPasswordScreen'>} param0 */
const SetNewPasswordScreen = props => {
  if (props?.route?.params?.token === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Invalid Token</Text>
      </View>
    )
  }

  const navigation = useNavigation()
  const { token, login } = props?.route?.params

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState({
    newPassword: true,
    reNewPassword: true,
  })

  const submitHandler = async () => {
    setIsLoading(true)

    try {
      let formattedLogin = login.trim()
      if (!isEmail(formattedLogin)) {
        formattedLogin = /^(\+639)\d{9}$/.test(formattedLogin)
          ? formattedLogin
          : `+${formattedLogin}`
      }
      const response = await Api.resetPassword({
        body: { token, login: formattedLogin, password: newPassword },
      })

      if (!response.success) throw new Error(response.message)
      setIsLoading(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        })
      )
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Error',
        error.message === 'Token Expired'
          ? 'The link has already expired, request another link for resetting your password.'
          : 'Oops, something went wrong.'
      )
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (confirmPassword !== newPassword) {
      console.log('Password does not match')
    }
  }, [confirmPassword])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isLoading} />
      <View style={{ padding: normalize(24) }}>
        <Text style={typography.display5}>Reset your password?</Text>

        <Text style={typography.body2}>
          <Text style={typography.body3}> {login}</Text>
        </Text>

        <Text style={[typography.body2, { marginTop: normalize(24) }]}>
          Create a strong password to protect your account (minimum of 8
          characters).
        </Text>

        <View>
          <View style={{ flexDirection: 'row', position: 'relative' }}>
            <FloatingAppInput
              customStyle={{ flex: 1, marginTop: normalize(24) }}
              label="New Password"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text)
              }}
              secureTextEntry={show.newPassword}
            />
            <TouchableWithoutFeedback
              onPress={() =>
                setShow(show => ({ ...show, newPassword: !show.newPassword }))
              }>
              <View style={styles.eyeWrapper}>
                {show.newPassword ? <EyeDark /> : <EyeLight />}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{ flexDirection: 'row', position: 'relative' }}>
            <FloatingAppInput
              customStyle={{
                flex: 1,
                marginTop: normalize(24),
              }}
              label="Re-Enter New Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text)
              }}
              secureTextEntry={show.reNewPassword}
            />
            <TouchableWithoutFeedback
              onPress={() =>
                setShow(show => ({
                  ...show,
                  reNewPassword: !show.reNewPassword,
                }))
              }>
              <View style={styles.eyeWrapper}>
                {show.reNewPassword ? <EyeDark /> : <EyeLight />}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <TouchableOpacity
            onPress={submitHandler}
            activeOpacity={0.7}
            style={{
              borderRadius: normalize(8),
              borderWidth: normalize(1),
              paddingVertical: normalize(8),
              alignItems: 'center',
              marginTop: normalize(24),
            }}>
            <Text style={typography.body2}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  eyeWrapper: {
    position: 'absolute',
    top: '30%',
    right: 0,
    padding: normalize(15),
  },
})

export default SetNewPasswordScreen
