import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, TouchableOpacity } from 'react-native'

import { AppText, FloatingAppInput } from '@/components'
import { EyeDark, EyeLight } from '@/assets/images/icons'
import ForgotPasswordService from '@/services/ForgotPassword'
import { useNavigation } from '@react-navigation/native'

import Api from '@/services/Api'

const SetNewPassword = props => {
  if (props?.route?.params?.token === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>Invalid Token</AppText>
      </View>
    )
  }

  const navigation = useNavigation()
  const { token, id } = props?.route?.params

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitHandler = async () => {
    console.log('newPassword', newPassword)
    console.log('confirmPassword', confirmPassword)

    const finalPassword = newPassword

    const data = {
      password: finalPassword,
      token: token,
      login: id,
    }

    try {
      const response = await Api.resetPassword({ body: data })

      if (!response.success) {
        throw new Error(response.message)
      }
      navigation.navigate('TabStack')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (confirmPassword !== newPassword) {
      console.log('Password does not match')
    }
  }, [confirmPassword])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 24 }}>
        <AppText textStyle="display5">Reset your password?</AppText>
        <AppText>my token: {token}</AppText>

        <AppText textStyle="body2">
          User ID:
          <AppText textStyle="body3"> {id}</AppText>
        </AppText>

        <AppText textStyle="body2" customStyle={{ marginTop: 24 }}>
          In order to protect your account make sure your password
        </AppText>

        <AppText textStyle="body2" customStyle={{ marginTop: 24 }}>
          • Has more than 7 characters
        </AppText>
        <AppText textStyle="body2">
          • Contains text and special characters
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

export default SetNewPassword
