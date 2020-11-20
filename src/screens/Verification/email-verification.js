import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import {
  PaddingView,
  AppText,
  AppButton,
  FloatingAppInput,
  TransitionIndicator,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { HeaderBackGray } from '@/assets/images/icons'
import { VF } from '@/components/AppInput'
import { UserContext } from '@/context/UserContext'
import Validator from '@/components/AppInput/Validator'
import Api from '@/services/Api'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'EmailVerification'>} param0 */
const EmailVerificationScreen = ({ navigation }) => {
  const { user, setUserInfo } = useContext(UserContext)

  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailChange = async _email => {
    setEmail(_email)
    try {
      await VF.emailValidator(_email)
      setError('')
    } catch (_error) {
      setError(_error)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await Api.changeLogin({
        uid: user.uid,
        body: {
          email,
        },
      })

      if (!response.success) throw new Error(response.message)
      navigation.navigate('verify-code', { login: email, provider: 'email' })
    } catch (error) {
      console.log(error)
    }
    setIsSubmitting(false)
  }

  const initialize = async () => {
    try {
      const response = await Api.getUser({ uid: user.uid })
      const { account, ...userInfo } = response.data
      setUserInfo(userInfo)
      const { email } = userInfo

      setEmail(email)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isSubmitting} />
      <PaddingView paddingSize={3}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={navigation.goBack}
              activeOpacity={0.7}
              style={{ position: 'absolute', left: 0 }}>
              <HeaderBackGray width={normalize(16)} height={normalize(16)} />
            </TouchableOpacity>
            <AppText textStyle="body3">&nbsp;</AppText>
          </View>
          {isLoading ? (
            <View style={[styles.loader]}>
              <ActivityIndicator
                color="#3781FC"
                size="large"
                animating={true}
              />
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <AppText textStyle="body1" customStyle={{ marginBottom: 8 }}>
                  Add and verify email address
                </AppText>
                <AppText textStyle="body2" color={Colors.contentPlaceholder}>
                  We'll use this email address for notifications, transaction
                  updates, and login help
                </AppText>
                <Validator
                  style={{ marginBottom: normalize(16) }}
                  errorState={{
                    message: error,
                    shown: error.length,
                  }}>
                  <FloatingAppInput
                    value={email}
                    selectTextOnFocus={false}
                    onChangeText={handleEmailChange}
                    label="Email address"
                    customStyle={{ marginTop: normalize(35) }}
                    keyboardType="email-address"
                  />
                </Validator>
              </View>
              <AppButton
                text="Verify"
                type="primary"
                height="xl"
                disabled={error.length}
                customStyle={{
                  ...styles.customButtonStyle,
                  ...(error.length
                    ? {
                        backgroundColor: Colors.buttonDisable,
                        borderColor: Colors.buttonDisable,
                      }
                    : {}),
                }}
                onPress={handleSubmit}
              />
            </>
          )}
        </View>
      </PaddingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginTop: 40,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default EmailVerificationScreen
