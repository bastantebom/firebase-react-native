import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  StatusBar,
} from 'react-native'
import TextInput from '@/components/textinput'

import { CommonActions, useNavigation } from '@react-navigation/native'
import { iconSize, isEmail, normalize } from '@/globals/Utils'
import typography from '@/globals/typography'

import { EyeDark, EyeLight, Icons } from '@/assets/images/icons'

import Api from '@/services/Api'
import { Colors } from '@/globals'
import Loader from '@/components/loader'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Button from '@/components/Button'
import Toast from '@/components/toast'

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
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [dirtyStates, setDirtyStates] = useState([])

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      let formattedLogin = login.trim()
      if (!isEmail(formattedLogin)) {
        formattedLogin = /^(\+639)\d{9}$/.test(formattedLogin)
          ? formattedLogin
          : `+63${formattedLogin.slice(-10)}`
      }

      const response = await Api.resetPassword({
        body: {
          token,
          login: formattedLogin,
          password: newPassword,
        },
      })

      if (!response.success) throw new Error(response.message)
      setIsLoading(false)
      Toast.show({
        label: `You successfully reset the password for account ${formattedLogin}`,
        type: 'success',
        screenId: 'root',
        dismissible: true,
        timeout: 5000,
      })
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        })
      )
    } catch (error) {
      console.log(error)
      Toast.show({
        label:
          error.message === 'Token Expired'
            ? 'The link has already expired, request another link for resetting your password.'
            : 'Oops, something went wrong.',
        type: 'error',
        dismissible: true,
        screenId: 'SetNewPassword',
        timeout: 5000,
      })
    }
    setIsLoading(false)
  }

  const handleOnBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      const state = navigation.dangerouslyGetState()
      let onboardingRoute = state.routes.find(
        route => route.name === 'Onboarding'
      ) || { name: 'Onboarding' }

      if (onboardingRoute) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [onboardingRoute],
          })
        )
      }
    }
  }

  const canSubmit = () => {
    return !Object.values(errors).some(error => error.length)
  }

  const checkErrors = () => {
    const errors = {
      newPassword: '',
      confirmPassword: '',
    }

    if (newPassword.length < 8)
      errors.newPassword = 'Password must be atleast 8 characters'

    if (confirmPassword !== newPassword)
      errors.confirmPassword = 'Password does not match'

    setErrors(errors)
  }

  useEffect(() => {
    checkErrors()
  }, [newPassword, confirmPassword])

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'SetNewPassword')}
      />
      <Loader visible={isLoading} />
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleOnBackPress}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: normalize(24) }}>
          <Text style={typography.display5}>Reset your password?</Text>

          <Text style={typography.body2}>
            <Text style={typography.body3}> {login}</Text>
          </Text>

          <Text style={[typography.body2, { marginTop: normalize(24) }]}>
            Create a strong password to protect your account (minimum of 8
            characters).
          </Text>

          <View style={styles.form}>
            <TextInput
              containerStyle={[
                styles.formInput,
                errors.newPassword.length && dirtyStates.includes('newPassword')
                  ? { borderColor: Colors.secondaryBrinkPink }
                  : {},
              ]}
              label="New Password"
              value={newPassword}
              onChangeText={text => {
                setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
                setNewPassword(text)
              }}
              secureTextEntry={!newPasswordVisible}
              onBlur={() =>
                setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
              }
              message={
                dirtyStates.includes('newPassword') ? errors.newPassword : ''
              }
              messageStyle={{
                color: Colors.secondaryBrinkPink,
              }}
              rightIcon={() => (
                <TouchableWithoutFeedback
                  onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                  {!newPasswordVisible ? (
                    <EyeDark {...iconSize(24)} />
                  ) : (
                    <EyeLight {...iconSize(24)} />
                  )}
                </TouchableWithoutFeedback>
              )}
            />
            <TextInput
              containerStyle={[
                styles.formInput,
                errors.confirmPassword.length &&
                dirtyStates.includes('confirmPassword')
                  ? { borderColor: Colors.secondaryBrinkPink }
                  : {},
              ]}
              label="Re-Enter New Password"
              value={confirmPassword}
              onChangeText={text => {
                setDirtyStates([
                  ...new Set([...dirtyStates, 'confirmPassword']),
                ])
                setConfirmPassword(text)
              }}
              secureTextEntry={!confirmPasswordVisible}
              onBlur={() =>
                setDirtyStates([
                  ...new Set([...dirtyStates, 'confirmPassword']),
                ])
              }
              message={
                dirtyStates.includes('confirmPassword')
                  ? errors.confirmPassword
                  : ''
              }
              messageStyle={{
                color: Colors.secondaryBrinkPink,
              }}
              rightIcon={() => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }>
                  {!confirmPasswordVisible ? (
                    <EyeDark {...iconSize(24)} />
                  ) : (
                    <EyeLight {...iconSize(24)} />
                  )}
                </TouchableWithoutFeedback>
              )}
            />
            <Button
              style={styles.submitButton}
              type={canSubmit() ? 'primary' : 'disabled'}
              disabled={!canSubmit()}
              label="Set New Password"
              onPress={handleOnSubmit}
            />
          </View>
        </View>
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
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  eyeWrapper: {
    position: 'absolute',
    top: '30%',
    right: 0,
    padding: normalize(15),
  },
  form: {
    marginTop: normalize(24),
  },
  formInput: {
    marginBottom: normalize(24),
  },
})

export default SetNewPasswordScreen
