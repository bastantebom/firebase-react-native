import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import LoginService from '@/services/LoginService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppButton, AppText } from '@/components'
import Colors from '@/globals/Colors'
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer'

import { AppInput, Validator, valueHandler } from '@/components/AppInput'

import {
  HeaderCloseGray,
  EyeDark,
  EyeLight,
  LoginApple,
  LoginFB,
  LoginGoogle,
} from '@/assets/images/icons'

import { PaddingView } from '@/components'

import { Context } from '@/context'
import { normalize } from '@/globals'
import Api from '@/services/Api'

function Divider() {
  return (
    <View style={styles.dividerWrapper}>
      <View style={styles.divider} />
      <AppText textStyle="body1" customStyle={styles.dividerText}>
        or
      </AppText>
    </View>
  )
}

function Login({ setNotificationMessage }) {
  const navigation = useNavigation()

  const [emailAddress, setEmailAddress] = useState('')

  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const { closeSlider, setAuthType } = useContext(Context)
  const [isLoading, setIsLoading] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const [errors, setErrors] = useState({
    password: {
      passed: false,
      shown: false,
      message: '',
    },
  })

  const checkErrorState = () => {
    let temp = true

    for (const [key, value] of Object.entries(errors)) {
      if (!value.passed) {
        temp = false
        break
      }
    }
    setEnabled(!!temp)
  }

  useEffect(() => {
    checkErrorState()
  }, [errors])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
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
      const response = await Api.login({
        body: {
          login: emailAddress,
          password,
        },
      })

      if (!response.success)
        setNotificationMessage(
          "Oh no! We can't find an account with these details. Please try again."
        )

      if (response.custom_token) {
        await auth().signInWithCustomToken(response.custom_token)
        closeSlider()
      }
    } catch (error) {
      if (error.message === 'Invalid credentials')
        setNotificationMessage(error.message)

      if (error.message === 'Network request failed')
        setNotificationMessage(
          'No internet connection. Make sure that Wi-Fi or mobile data is turn on, then try again'
        )
      console.log(error.message)
    }
    setPassword('')
    setIsLoading(false)
  }

  const signInWithProvider = async provider => {
    try {
      const state = navigation.dangerouslyGetState()
      let onboardingRoute = state.routes.find(
        route => route.name === 'Onboarding'
      ) || { name: 'Onboarding' }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [onboardingRoute],
        })
      )
      await LoginService.signInWithProvider(provider)
      closeSlider()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', error.message)
    }
  }

  return (
    <ScrollView>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
        <PaddingView paddingSize={2} style={{ paddingBottom: 100 }}>
          <TouchableOpacity
            style={styles.closeIconWrapper}
            onPress={closeSlider}>
            <HeaderCloseGray height={normalize(24)} width={normalize(24)} />
          </TouchableOpacity>

          <View style={styles.container}>
            <AppText textStyle="display5">Welcome back!</AppText>
            <AppText textStyle="caption" customStyle={styles.caption}>
              Log in to get going, Buzzybee.
            </AppText>
            <AppViewContainer
              marginSize={3}
              customStyle={{ marginHorizontal: 0, marginBottom: 0 }}>
              <AppInput
                label="Email or Mobile Number"
                style={styles.inputText}
                onChangeText={emailAddress => setEmailAddress(emailAddress)}
                value={emailAddress}
                keyboardType={'email-address'}
              />
              <Validator
                style={{ marginBottom: normalize(16) }}
                customTextStyle={{
                  fontFamily: 'RoundedMplus1c-Regular',
                  fontSize: normalize(12),
                  marginTop: normalize(8),
                  color: Colors.secondaryBrinkPink,
                }}
                errorState={errors.password}>
                <View style={{ position: 'relative' }}>
                  <AppInput
                    label="Password"
                    onChangeText={password =>
                      valueHandler(
                        password,
                        'password',
                        'password',
                        errors,
                        setErrors,
                        setPassword
                      )
                    }
                    secureTextEntry={!isVisible ? true : false}
                    value={password}
                    onKeyPress={() => {
                      setErrors({
                        ...errors,
                        password: {
                          ...errors.password,
                          shown: false,
                        },
                      })
                    }}
                  />
                  <View style={styles.passwordToggle}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                      {!isVisible ? <EyeDark /> : <EyeLight />}
                    </TouchableOpacity>
                  </View>
                </View>
              </Validator>
              <TouchableOpacity
                onPress={() => {
                  closeSlider()
                  navigation.push('ResetPassword')
                }}>
                <AppText textStyle="caption" customStyle={styles.caption}>
                  Forgot Password?
                </AppText>
              </TouchableOpacity>
              <AppButton
                text="Log In"
                type="primary"
                height="xl"
                customStyle={styles.customLogin}
                onPress={() => {
                  handleLogin()
                }}
                disabled={!enabled}
                loading={isLoading}
              />
            </AppViewContainer>

            <Divider />

            <View style={styles.socialMediaLogin}>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  onPress={() => signInWithProvider('apple')}
                  style={{ paddingHorizontal: normalize(8) }}>
                  <LoginApple />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => signInWithProvider('facebook')}
                style={{ paddingHorizontal: normalize(8) }}>
                <LoginFB />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => signInWithProvider('google')}
                style={{ paddingHorizontal: normalize(8) }}>
                <LoginGoogle />
              </TouchableOpacity>
            </View>

            <View style={styles.cta}>
              <AppText textStyle="button2">Don't have an account? </AppText>
              <TouchableOpacity
                onPress={() => {
                  setAuthType('signup')
                }}>
                <AppText textStyle="button2" customStyle={styles.link}>
                  Sign up
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </PaddingView>
      </KeyboardAwareScrollView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  link: {
    color: Colors.contentOcean,
  },
  caption: {
    color: Colors.contentPlaceholder,
    marginTop: 5,
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputText: {
    marginBottom: 16,
  },
  customSpacing: {
    marginBottom: 16,
  },
  customButton: {
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
    marginBottom: 16,
  },
  customLogin: {
    marginTop: 25,
  },

  dividerText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 18,
  },
  socialMediaLogin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalize(8),
    paddingBottom: normalize(16),
  },
  closeIconWrapper: {
    flex: 1,
    marginBottom: 13,
    paddingBottom: 24,
  },
})

export default Login
