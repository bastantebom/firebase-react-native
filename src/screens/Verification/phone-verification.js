import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import {
  AppText,
  AppButton,
  FloatingAppInput,
  TransitionIndicator,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { HeaderBackGray } from '@/assets/images/icons'
import { VF } from '@/components/AppInput'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import Validator from '@/components/AppInput/Validator'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'PhoneVerification'>} param0 */
const PhoneVerificationScreen = ({ navigation }) => {
  const { user, userInfo } = useContext(UserContext)

  const [error, setError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phone_number || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhoneNumberChange = async _phoneNumber => {
    setPhoneNumber(_phoneNumber)
    try {
      await VF.MobileNumberValidator(_phoneNumber)
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
          phone_number: phoneNumber,
        },
      })

      if (!response.success) throw new Error(response.message)
      navigation.navigate('verify-code', {
        login: phoneNumber,
        provider: 'number',
        onSubmit: () => {
          navigation.goBack()
          navigation.goBack()
        },
        onBackPress: navigation.goBack,
      })
    } catch (error) {
      console.log(error)
    }
    setIsSubmitting(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isSubmitting} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ padding: normalize(24) }}>
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
            <>
              <View style={{ flex: 1 }}>
                <AppText textStyle="body1" customStyle={{ marginBottom: 8 }}>
                  Add and verify mobile number
                </AppText>
                <AppText textStyle="body2" color={Colors.contentPlaceholder}>
                  We'll use this number for notifications, transaction updates,
                  and login help
                </AppText>
                <Validator
                  style={{ marginBottom: normalize(16) }}
                  errorState={{
                    message: error,
                    shown: error.length,
                  }}>
                  <FloatingAppInput
                    value={phoneNumber}
                    selectTextOnFocus={false}
                    onChangeText={handlePhoneNumberChange}
                    label="Mobile Number"
                    customStyle={{ marginTop: normalize(35) }}
                    keyboardType="phone-pad"
                    returnKeyType={'done'}
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
          </View>
        </View>
      </TouchableWithoutFeedback>
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

export default PhoneVerificationScreen
