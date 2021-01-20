import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { UserContext } from '@/context/UserContext'
import {
  ScreenHeaderTitle,
  AppButton,
  TransitionIndicator,
  Notification,
  AppInput,
} from '@/components'
import { EyeDark, EyeLight, Icons } from '@/assets/images/icons'
import { normalize, Colors } from '@/globals'
import Api from '@/services/Api'

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
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
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
      setNotificationType('success')
      setNotificationMessage(
        <View style={styles.notificationMessage}>
          <Text style={styles.notificationTitle}>Success!</Text>
          <Text style={styles.notificationText}>
            Password has been updated successfully!
          </Text>
        </View>
      )
    } catch (error) {
      console.log(error.message)
      setNotificationType('danger')
      setNotificationMessage(
        <View style={styles.notificationMessage}>
          <Text style={styles.notificationTitle}>Oops!</Text>
          <Text style={styles.notificationText}>
            There was an error changing your password.
          </Text>
        </View>
      )
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
    <SafeAreaView style={styles.safeArea}>
      <TransitionIndicator loading={isLoading} />
      {!!notificationMessage && (
        <Notification
          type={notificationType}
          icon={
            notificationType === 'danger' ? (
              <Icons.Warning />
            ) : (
              <Icons.CircleTickWhite />
            )
          }
          onClose={() => setNotificationMessage(null)}
          animationOptions={{ height: normalize(85) }}>
          {notificationMessage}
        </Notification>
      )}
      <View style={styles.container}>
        <ScreenHeaderTitle title="Change password" close={navigation.goBack} />
        <View style={[styles.inputWrapper, { marginTop: normalize(36) }]}>
          <AppInput
            value={formData.currentPassword}
            label="Current Password"
            onChangeText={currentPassword => {
              setFormData(data => ({ ...data, currentPassword }))
              setDirtyStates([...new Set([...dirtyStates, 'currentPassword'])])
            }}
            secureTextEntry={!visiblePassword.current}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'currentPassword'])])
              return 1
            }}
            error={errors.currentPassword.length}
            customLabelStyle={
              errors.currentPassword.length ? { color: Colors.red } : {}
            }
            debounce={false}
          />

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

          <Text style={styles.errorMessage}>{errors.currentPassword}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.newPassword}
            label="New Password"
            onChangeText={newPassword => {
              setFormData(data => ({ ...data, newPassword }))
              setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
            }}
            secureTextEntry={!visiblePassword.new}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'newPassword'])])
              return 1
            }}
            error={errors.newPassword.length}
            customLabelStyle={
              errors.newPassword.length ? { color: Colors.red } : {}
            }
            debounce={false}
          />

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
          <Text style={styles.errorMessage}>{errors.newPassword}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.confirmNewPassword}
            label="Confirm New Password"
            onChangeText={confirmNewPassword => {
              setFormData(data => ({ ...data, confirmNewPassword }))
              setDirtyStates([
                ...new Set([...dirtyStates, 'confirmNewPassword']),
              ])
            }}
            secureTextEntry={!visiblePassword.confirmNew}
            onBlurInput={() => {
              setDirtyStates([
                ...new Set([...dirtyStates, 'confirmNewPassword']),
              ])
            }}
            error={errors.confirmNewPassword.length}
            customLabelStyle={
              errors.confirmNewPassword.length ? { color: Colors.red } : {}
            }
            debounce={false}
          />

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
          <Text style={styles.errorMessage}>{errors.confirmNewPassword}</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton
            text="Change Password"
            type="primary"
            height="xl"
            disabled={hasErrors()}
            onPress={handleSubmit}
            customStyle={hasErrors() ? styles.disabledButton : {}}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    bottom: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    padding: normalize(24),
    backgroundColor: '#fff',
  },
  disabledButton: {
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  },
  errorMessage: {
    bottom: 3,
    color: Colors.secondaryBrinkPink,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    margin: 0,
    padding: 0,
    position: 'absolute',
  },
  inputWrapper: {
    paddingBottom: normalize(24),
    position: 'relative',
  },
  notificationMessage: {
    marginLeft: normalize(16),
  },
  notificationText: {
    color: '#fff',
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    letterSpacing: 0.25,
  },
  notificationTitle: {
    color: '#fff',
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
  },
  passwordToggle: {
    position: 'absolute',
    right: normalize(16),
    top: normalize(14),
  },
  safeArea: {
    flex: 1,
  },
})

export default ChangePasswordScreen
