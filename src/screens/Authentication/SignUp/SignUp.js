import { Context } from '@/context'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import VF from '@/components/AppInput/ValidationFunctions'
import AppColor from '@/globals/Colors'
import { useNavigation } from '@react-navigation/native'

import { AppText, AppButton, AppInput, AppCheckbox } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Close,
  EyeDark,
  EyeLight,
  LoginApple,
  LoginFB,
  LoginGoogle,
} from '@/assets/images/icons'
import LoginService from '@/services/LoginService'
import { normalize } from '@/globals'
import Validator from '@/components/AppInput/Validator'
import SwitchComponent from '@/components/Switch/Switch'
import Privacy from '@/screens/Authentication/SignUp/components/PrivacyPolicy'
import Terms from '@/screens/Authentication/SignUp/components/TermsOfUse'
import SignUpService from '@/services/SignUpService'

const SignUp = props => {
  const [formData, setFormData] = useState({
    login: '',
    name: '',
    password: '',
    terms_conditions: false,
    receive_updates: false,
  })
  const [errors, setErrors] = useState({
    login: '',
    name: '',
    password: '',
  })
  const [dirtyStates, setDirtyStates] = useState([])

  const [signUpMethod, setSignUpMethod] = useState('email')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isToggleVisible, setIsToggleVisible] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTermsVisible, setIsTermsVisible] = useState(false)
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false)
  const { closeSlider, openSlider, setAuthType } = useContext(Context)

  const handleFormChange = ({ key, value }) => {
    setFormData({
      ...formData,
      [key]: value,
    })
  }

  const validate = async () => {
    const errors = {
      login: '',
      name: '',
      password: '',
    }
    if (signUpMethod === 'email' && ~dirtyStates.indexOf('login')) {
      try {
        await VF.emailValidator(formData.login)
      } catch (error) {
        errors.login = error
      }
    } else if (~dirtyStates.indexOf('login')) {
      try {
        await VF.MobileNumberValidator(formData.login)
      } catch (error) {
        errors.login = error
      }
    }

    if (~dirtyStates.indexOf('name')) {
      try {
        await VF.NameValidator(formData.name)
      } catch (error) {
        errors.name = error
      }
    }

    if (~dirtyStates.indexOf('password')) {
      try {
        await VF.PasswordValidator(formData.password)
      } catch (error) {
        errors.password = error
      }
    }

    setErrors(errors)
  }

  const navigation = useNavigation()
  const clearForm = () => {
    setDirtyStates([])
    setFormData({
      login: '',
      name: '',
      password: '',
      terms_conditions: false,
      receive_updates: false,
    })
  }

  const signUp = async () => {
    if (!canSubmit) return
    setIsLoading(true)

    try {
      const {
        login,
        password,
        name: full_name,
        terms_conditions,
        receive_updates,
      } = formData
      const response = await SignUpService.createUser({
        login,
        password,
        full_name,
        terms_conditions,
        receive_updates,
      })

      if (!response.success) {
        navigation.navigate('Onboarding')
        throw new Error(response.message)
      } else {
        clearForm()
        closeSlider()
        navigation.navigate('VerifyAccount', {
          ...formData,
          uid: response.uid,
          provider: signUpMethod,
        })
      }
    } catch (error) {
      console.log(error?.message || error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    validate()
  }, [formData])
  useEffect(() => {
    setCanSubmit(
      Object.values(errors).every(value => !value.length) &&
        formData.terms_conditions
    )
  }, [errors])

  const TermsCheckbox = () => {
    return (
      <>
        <View style={styles.promos}>
          <View>
            <AppCheckbox
              Icon=""
              label=""
              value={formData.terms_conditions}
              valueChangeHandler={value =>
                handleFormChange({ key: 'terms_conditions', value })
              }
              style={{
                marginLeft: 0,
                paddingLeft: 0,
                marginTop: 8,
                backgroundColor: 'transparent',
              }}
            />
          </View>
          <View style={styles.terms}>
            <AppText
              textStyle="caption"
              customStyle={{ color: AppColor.promoCopy }}>
              By signing up, I agree to Servbees
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setIsTermsVisible(true)
              }}>
              <AppText
                textStyle="promo"
                customStyle={{
                  color: AppColor.promoCopy,
                  textDecorationLine: 'underline',
                }}>
                Terms of Use
              </AppText>
            </TouchableOpacity>

            <AppText
              textStyle="caption"
              customStyle={{ color: AppColor.promoCopy }}>
              {' '}
              and{' '}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setIsPromoVisible(true)
              }}>
              <AppText
                textStyle="promo"
                customStyle={{
                  color: AppColor.promoCopy,
                  textDecorationLine: 'underline',
                }}>
                Privacy Policy.
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.promos}>
          <View style={styles.promoCopy}>
            <AppText
              textStyle="caption"
              customStyle={{ color: AppColor.promoCopy }}>
              I want to receive offers, promos, and updates from Servbees.
            </AppText>
          </View>
          <View style={styles.promoSwitch}>
            <SwitchComponent
              onValueChange={value =>
                handleFormChange({ key: 'receive_updates', value })
              }
              value={formData.receive_updates}
            />
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <ScrollView>
        <View style={styles.mainWrapper}>
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={closeSlider}>
              <Close height={24} width={24} />
            </TouchableOpacity>
            <AppText textStyle="display5">Sign Up</AppText>
            <AppText textStyle="caption" customStyle={styles.textCaption}>
              Join Servbees today. It’s free!
            </AppText>
            <View style={styles.formWrapper}>
              <Validator
                style={{ marginBottom: normalize(16) }}
                errorState={{
                  message: errors.login,
                  shown: errors.login.length,
                }}>
                <AppInput
                  label={signUpMethod === 'email' ? 'Email' : 'Mobile Number'}
                  value={formData.login}
                  onFocusInput={() => {
                    setIsToggleVisible(true)
                  }}
                  onBlurInput={() => {
                    setDirtyStates([...new Set([...dirtyStates, 'login'])])
                    setIsToggleVisible(false)
                  }}
                  keyboardType={
                    signUpMethod === 'email' ? 'email-address' : 'phone-pad'
                  }
                  onChangeText={value => {
                    setDirtyStates([...new Set([...dirtyStates, 'login'])])
                    handleFormChange({ key: 'login', value })
                  }}
                />
              </Validator>

              <View style={{ display: isToggleVisible ? 'flex' : 'none' }}>
                <TouchableOpacity
                  onPress={() => {
                    setSignUpMethod(
                      signUpMethod === 'number' ? 'email' : 'number'
                    )
                    validate()
                  }}>
                  <AppText
                    textStyle="button3"
                    color={AppColor.contentOcean}
                    customStyle={{ marginBottom: 16 }}>
                    {signUpMethod === 'email'
                      ? 'Use mobile number instead'
                      : 'Use email instead'}
                  </AppText>
                </TouchableOpacity>
              </View>
              <Validator
                style={{ marginBottom: normalize(16) }}
                errorState={{
                  message: errors.name,
                  shown: errors.name.length,
                }}>
                <AppInput
                  label="Full Name"
                  onBlurInput={() => {
                    setDirtyStates([...new Set([...dirtyStates, 'name'])])
                  }}
                  onChangeText={value => {
                    setDirtyStates([...new Set([...dirtyStates, 'name'])])
                    handleFormChange({ key: 'name', value })
                  }}
                  value={formData.name}
                />
              </Validator>

              <View style={{ position: 'relative' }}>
                <Validator
                  style={{ marginBottom: normalize(16) }}
                  errorState={{
                    message: errors.password,
                    shown: errors.password.length,
                  }}>
                  <AppInput
                    label="Password"
                    onBlurInput={() => {
                      setDirtyStates([...new Set([...dirtyStates, 'password'])])
                    }}
                    onChangeText={value => {
                      setDirtyStates([...new Set([...dirtyStates, 'password'])])
                      handleFormChange({
                        key: 'password',
                        value,
                      })
                    }}
                    secureTextEntry={!isPasswordVisible ? true : false}
                    value={formData.password}
                  />
                </Validator>

                <View style={styles.passwordToggle}>
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {!isPasswordVisible ? <EyeDark /> : <EyeLight />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TermsCheckbox />
            <Terms
              isVisible={isTermsVisible}
              onClose={() => setIsTermsVisible(false)}
            />
            <Privacy
              isVisible={isPrivacyVisible}
              onClose={() => setIsPrivacyVisible(false)}
            />

            <View style={{ marginTop: 16 }}>
              <AppButton
                text="Sign up"
                type="primary"
                height="xl"
                disabled={!canSubmit}
                customStyle={{
                  ...styles.customButtonStyle,
                  backgroundColor: !canSubmit
                    ? AppColor.buttonDisable
                    : AppColor.primaryYellow,

                  borderColor: !canSubmit
                    ? AppColor.buttonDisable
                    : AppColor.primaryYellow,
                }}
                onPress={signUp}
                loading={isLoading}
              />
            </View>
            <View style={styles.orCopyWrapper}>
              <AppText textStyle="body1">or</AppText>
            </View>
            <View style={styles.socialMediaLogin}>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  onPress={async () => {
                    await LoginService.signInWithProvider('apple')
                    closeSlider()
                  }}
                  style={{ paddingHorizontal: normalize(8) }}>
                  <LoginApple />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={async () => {
                  await LoginService.signInWithProvider('facebook')
                  closeSlider()
                }}
                style={{ paddingHorizontal: normalize(8) }}>
                <LoginFB />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await LoginService.signInWithProvider('google')
                  closeSlider()
                }}
                style={{ paddingHorizontal: normalize(8) }}>
                <LoginGoogle />
              </TouchableOpacity>
            </View>

            <View style={styles.loginLinkCopy}>
              <AppText textStyle="button2">Already have an account?</AppText>
              <TouchableOpacity
                onPress={() => {
                  closeSlider()
                  setTimeout(() => {
                    setAuthType('login')
                    openSlider()
                  }, 450)
                }}>
                <AppText textStyle="button2" customStyle={styles.underLineText}>
                  Login
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 24,
    flexDirection: 'column',
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: AppColor.neutralsWhite,
  },

  closeIconWrapper: {
    flex: 1,
    marginBottom: 13,
    paddingBottom: 24,
  },

  formWrapper: {
    justifyContent: 'space-around',
    marginTop: 32,
  },

  textCaption: {
    color: AppColor.contentPlaceholder,
  },

  customInputStyle: {
    marginBottom: 4,
  },

  forgotPasswordLink: {
    marginTop: 4,
    marginBottom: 24,
  },

  customButtonStyle: {
    borderWidth: 1.5,
    marginBottom: 16,
    borderRadius: 4,
  },

  disableButton: {
    borderWidth: 1.5,
    marginBottom: 16,
    backgroundColor: AppColor.buttonDisable,
    borderColor: AppColor.buttonDisable,
  },

  orCopyWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },

  underLineText: {
    color: AppColor.contentOcean,
    paddingLeft: 4,
  },

  loginLinkCopy: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },

  errorCopy: {
    color: AppColor.errorInput,
    marginBottom: 12,
  },

  withError: {
    marginBottom: 4,
    borderColor: AppColor.errorInput,
  },

  withoutError: {
    marginBottom: 16,
    borderColor: AppColor.contentEbony,
  },

  defaultBorder: {
    marginBottom: 16,
    borderColor: AppColor.neutralGray,
  },

  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 18,
  },

  terms: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 16,
  },

  promos: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  promoCopy: {
    width: '80%',
  },
  promoSwitch: {
    width: '20%',
    alignItems: 'flex-end',
  },
  socialMediaLogin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalize(8),
    paddingBottom: normalize(16),
  },
})

export default SignUp
