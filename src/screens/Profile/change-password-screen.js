import { EyeDark, EyeLight, Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import Loader from '@/components/loader'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import Api from '@/services/Api'
import React, { useContext, useEffect, useState } from 'react'
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TextInput from '@/components/textinput'
import Toast from '@/components/toast'
import { UserContext } from '@/context/UserContext'

const DismissKeyboardView = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

/**
 * @typedef {Object} ChangePasswordScreenProps
 */

/**
 * @typedef {Object} RootProps
 * @property {ChangePasswordScreenProps} ChangePasswordScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ChangePasswordScreen'>} param0 */
const ChangePasswordScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const [dirtyStates, setDirtyStates] = useState([])

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const [visiblePassword, setVisiblePassword] = useState({
    current: false,
    new: false,
    confirmNew: false,
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const {
        currentPassword: current_password,
        newPassword: new_password,
      } = formData

      const response = await Api.changePassword({
        uid: user.uid,
        body: {
          current_password,
          new_password,
        },
      })
      if (!response.success) throw new Error(response.message)
      navigation.goBack()
      Toast.show({
        label: 'Password has been updated successfully!',
        type: 'success',
        screenId: 'root',
        dismissible: true,
        timeout: 5000,
      })
    } catch (error) {
      console.log(error.message)
      Toast.show({
        label: 'There was an error changing your password.',
        type: 'error',
        dismissible: true,
        screenId: 'change-password',
        timeout: 5000,
      })
    }
    setIsLoading(false)
  }

  const checkErrors = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }

    const { currentPassword, newPassword, confirmNewPassword } = formData
    if (dirtyStates.includes('currentPassword') && !currentPassword.length)
      errors.currentPassword = 'This field is required'

    if (dirtyStates.includes('newPassword') && newPassword.length < 8)
      errors.newPassword = 'Password must be at least 8 characters'

    if (
      dirtyStates.includes('confirmNewPassword') &&
      confirmNewPassword.length < 8
    )
      errors.confirmNewPassword = 'Password must be at least 8 characters'

    if (dirtyStates.includes('newPassword') && !newPassword.length)
      errors.newPassword = 'This field is required'

    if (
      dirtyStates.includes('confirmNewPassword') &&
      !confirmNewPassword.length
    )
      errors.confirmNewPassword = 'This field is required'
    if (
      dirtyStates.includes('newPassword') &&
      dirtyStates.includes('confirmNewPassword') &&
      newPassword.length &&
      confirmNewPassword.length &&
      newPassword !== confirmNewPassword
    ) {
      errors.newPassword = 'Password must be equal'
      errors.confirmNewPassword = 'Password must be equal'
    }

    setErrors(errors)
  }

  const hasErrors = () => Object.values(errors).some(error => error.length)

  useEffect(() => {
    checkErrors()
  }, [formData])

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'change-password')}
      />
      <Loader visible={isLoading} />
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Change Password
            </Text>
          </View>
        </View>
        <DismissKeyboardView style={styles.content}>
          <TextInput
            containerStyle={[
              styles.textInput,
              errors.currentPassword.length &&
              dirtyStates.includes('currentPassword')
                ? { borderColor: Colors.secondaryBrinkPink }
                : {},
            ]}
            value={formData.currentPassword}
            label="Current Password"
            onChangeText={currentPassword => {
              setDirtyStates([...new Set([...dirtyStates, 'currentPassword'])])
              setFormData(data => ({ ...data, currentPassword }))
            }}
            secureTextEntry={!visiblePassword.current}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'currentPassword'])])
            }}
            message={errors.currentPassword}
            messageStyle={{ color: Colors.secondaryBrinkPink }}
            rightIcon={() => (
              <View style={styles.passwordToggle}>
                <TouchableOpacity
                  onPress={() =>
                    setVisiblePassword(state => ({
                      ...state,
                      current: !visiblePassword.current,
                    }))
                  }>
                  {visiblePassword.current ? <EyeLight /> : <EyeDark />}
                </TouchableOpacity>
              </View>
            )}
          />
          <TextInput
            containerStyle={[
              styles.textInput,
              errors.newPassword.length && dirtyStates.includes('newPassword')
                ? { borderColor: Colors.secondaryBrinkPink }
                : {},
            ]}
            value={formData.newPassword}
            label="New Password"
            onChangeText={newPassword => {
              setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
              setFormData(data => ({ ...data, newPassword }))
            }}
            secureTextEntry={!visiblePassword.new}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
            }}
            message={errors.newPassword}
            messageStyle={{ color: Colors.secondaryBrinkPink }}
            rightIcon={() => (
              <View style={styles.passwordToggle}>
                <TouchableOpacity
                  onPress={() =>
                    setVisiblePassword(state => ({
                      ...state,
                      new: !visiblePassword.new,
                    }))
                  }>
                  {visiblePassword.new ? <EyeLight /> : <EyeDark />}
                </TouchableOpacity>
              </View>
            )}
          />
          <TextInput
            containerStyle={[
              styles.textInput,
              errors.confirmNewPassword.length &&
              dirtyStates.includes('confirmNewPassword')
                ? { borderColor: Colors.secondaryBrinkPink }
                : {},
            ]}
            value={formData.confirmNewPassword}
            label="Confirm New Password"
            onChangeText={confirmNewPassword => {
              setDirtyStates([
                ...new Set([...dirtyStates, 'confirmNewPassword']),
              ])
              setFormData(data => ({ ...data, confirmNewPassword }))
            }}
            secureTextEntry={!visiblePassword.confirmNew}
            onBlurInput={() => {
              setDirtyStates([
                ...new Set([...dirtyStates, 'confirmNewPassword']),
              ])
            }}
            message={errors.confirmNewPassword}
            messageStyle={{ color: Colors.secondaryBrinkPink }}
            rightIcon={() => (
              <View style={styles.passwordToggle}>
                <TouchableOpacity
                  onPress={() =>
                    setVisiblePassword(state => ({
                      ...state,
                      confirmNew: !visiblePassword.confirmNew,
                    }))
                  }>
                  {visiblePassword.confirmNew ? <EyeLight /> : <EyeDark />}
                </TouchableOpacity>
              </View>
            )}
          />
        </DismissKeyboardView>
        <View style={styles.buttonsWrapper}>
          <Button
            label="Change Password"
            type={hasErrors() ? 'disabled' : 'primary'}
            disabled={hasErrors()}
            onPress={handleSubmit}
          />
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
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  header: {
    flexDirection: 'row',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  content: {
    flex: 1,
    padding: normalize(24),
  },
  buttonsWrapper: {
    padding: normalize(24),
  },
  textInput: {
    marginBottom: normalize(24),
    position: 'relative',
  },
})

export default ChangePasswordScreen
