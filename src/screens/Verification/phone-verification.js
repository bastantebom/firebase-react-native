import React, { useState, useContext } from 'react'
import { Icons } from '@/assets/images/icons'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native'
import { TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'
import StatusBar from '@/components/StatusBar'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'PhoneVerification'>} param0 */
const PhoneVerificationScreen = ({ navigation }) => {
  const { user, userInfo } = useContext(UserContext)

  const [error, setError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo.phone_number?.length ? userInfo.phone_number.slice(-10) : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhoneNumberChange = _phoneNumber => {
    setPhoneNumber(_phoneNumber)
    setError(
      /^\d{10}$/.test(_phoneNumber) ? '' : 'Please put a valid mobile number.'
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await Api.changeLogin({
        uid: user.uid,
        body: {
          phone_number: `+63${phoneNumber.replace(/\s/g, '')}`,
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
      Toast.show({
        label: error.message || 'Oops! Something went wrong.',
        type: 'error',
        dismissible: true,
        timeout: 5000,
      })
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <Toast
        containerStyle={{ marginTop: normalize(8) }}
        ref={ref => Toast.setRef(ref, 'phone-verification')}
      />
      <View style={styles.wrapper}>
        <TransitionIndicator loading={isSubmitting} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ padding: normalize(24) }}>
            <View style={{ justifyContent: 'space-between', height: '100%' }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={navigation.goBack}
                  activeOpacity={0.7}
                  style={{ position: 'absolute', left: 0 }}>
                  <Icons.Back
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                      color: Colors.primaryMidnightBlue,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <>
                <View style={{ flex: 1, marginTop: normalize(24) }}>
                  <Text style={[typography.body1, typography.medium]}>
                    Add and verify mobile number
                  </Text>
                  <Text style={[typography.body2, { marginTop: normalize(8) }]}>
                    No worries! Your number will only be used for added account
                    security, app updates, and orders.
                  </Text>
                  <View
                    style={[styles.formGroup, { marginTop: normalize(36) }]}>
                    <TextInput
                      value={phoneNumber}
                      selectTextOnFocus={false}
                      placeholder="10 digit number"
                      placeholderTextColor="#A8AAB7"
                      onChangeText={handlePhoneNumberChange}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      message={error}
                      maxLength={10}
                      messageStyle={{
                        color: Colors.secondaryBrinkPink,
                      }}
                      containerStyle={[
                        error.length
                          ? { borderColor: Colors.secondaryBrinkPink }
                          : {},
                      ]}
                      inputStyle={{
                        marginLeft: normalize(40),
                      }}>
                      <Text
                        style={[
                          typography.body1,
                          {
                            color: Colors.icon,
                            position: 'absolute',
                            left: normalize(16),
                          },
                        ]}>
                        +63
                      </Text>
                    </TextInput>
                  </View>
                </View>
                <Button
                  label="Verify"
                  type="primary"
                  size="huge"
                  disalbed={!!error.length}
                  onPress={handleSubmit}
                />
              </>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
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
  formGroup: {
    marginBottom: normalize(16),
  },
})

export default PhoneVerificationScreen
