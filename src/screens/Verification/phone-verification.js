import React, { useState, useContext } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Text,
  Alert,
} from 'react-native'
import { TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import { HeaderBackGray } from '@/assets/images/icons'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'PhoneVerification'>} param0 */
const PhoneVerificationScreen = ({ navigation }) => {
  const { user, userInfo } = useContext(UserContext)

  const [error, setError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phone_number || '')
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
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsSubmitting(false)
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <TransitionIndicator loading={isSubmitting} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ padding: normalize(24) }}>
          <View style={{ justifyContent: 'space-between', height: '100%' }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={navigation.goBack}
                activeOpacity={0.7}
                style={{ position: 'absolute', left: 0 }}>
                <HeaderBackGray width={normalize(24)} height={normalize(24)} />
              </TouchableOpacity>
            </View>
            <>
              <View style={{ flex: 1, marginTop: normalize(24) }}>
                <Text style={[typography.body1, typography.medium]}>
                  Add and verify mobile number
                </Text>
                <Text style={[typography.body2, { marginTop: normalize(8) }]}>
                  We’ll use this number for notifications, transaction updates,
                  and log in help.
                </Text>
                <View style={[styles.formGroup, { marginTop: normalize(36) }]}>
                  <TextInput
                    value={phoneNumber}
                    selectTextOnFocus={false}
                    placeholder="Mobile Number"
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
                          top: normalize(14.5),
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
