import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, TouchableOpacity, Alert } from 'react-native'

import { AppText, FloatingAppInput, TransitionIndicator } from '@/components'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { isEmail } from '@/globals/Utils'

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
        <AppText>Invalid Token</AppText>
      </View>
    )
  }

  const navigation = useNavigation()
  const { token, login } = props?.route?.params

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      <View style={{ padding: 24 }}>
        <AppText textStyle="display5">Reset your password?</AppText>

        <AppText textStyle="body2">
          <AppText textStyle="body3"> {login}</AppText>
        </AppText>

        <AppText textStyle="body2" customStyle={{ marginTop: 24 }}>
          Create a strong password to protect your account (minimum of 8
          characters).
        </AppText>

        <View style={{ marginTop: 32 }}>
          <View style={{ flexDirection: 'row', position: 'relative' }}>
            <FloatingAppInput
              customStyle={{ flex: 1 }}
              label="New Password"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text)
              }}
              secureTextEntry={true}
            />
          </View>

          <View style={{ flexDirection: 'row', position: 'relative' }}>
            <FloatingAppInput
              customStyle={{ marginTop: 24, flex: 1 }}
              label="Re-Enter New Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text)
              }}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            onPress={submitHandler}
            activeOpacity={0.7}
            style={{
              borderRadius: 8,
              borderWidth: 1,
              paddingVertical: 8,
              alignItems: 'center',
              marginTop: 24,
            }}>
            <AppText textStyle="body3">Change Password</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SetNewPasswordScreen
