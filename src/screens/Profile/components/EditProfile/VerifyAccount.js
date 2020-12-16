import React, { useRef, useState, useContext } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  SafeAreaView,
} from 'react-native'
import AppColor from '@/globals/Colors'
//import { useNavigation } from '@react-navigation/native'
import VerifyIcon from '@/assets/images/verify.svg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { AppText, TransitionIndicator, Notification } from '@/components'
import Api from '@/services/Api'
import { CircleTick, Warning } from '@/assets/images/icons'

const VerifyAccount = ({
  login,
  provider,
  toggleVerify,
  newLogin,
  toggleEditLogin,
}) => {
  const { user } = useContext(UserContext)
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)
  const { uid } = user

  const firstTextInput = useRef(null)
  const secondTextInput = useRef(null)
  const thirdTextInput = useRef(null)
  const fourthTextInput = useRef(null)

  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  const [inputStyle, setInputStyle] = useState([])
  const [verifyArray, setVerifyArray] = useState(['', '', '', ''])

  const [isScreenLoading, setIsScreenLoading] = useState(false)

  const isEmail = provider === 'email' ? true : false

  const onVerifyChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        return
      }
      const verifyArrayCopy = verifyArray.concat()
      verifyArrayCopy[index] = value
      setVerifyArray(verifyArrayCopy)

      const inputStyleCopy = inputStyle.concat()
      inputStyleCopy[index] = { borderColor: AppColor.contentOcean }
      setInputStyle(inputStyleCopy)

      if (value !== '') {
        sendVerification(verifyArrayCopy)
        if (index === 0) {
          secondTextInput.current.focus()
        } else if (index === 1) {
          thirdTextInput.current.focus()
        } else if (index === 2) {
          fourthTextInput.current.focus()
        } else if (index === 3) {
          Keyboard.dismiss()
        }
      }
    }
  }

  const onVerifyKeyPress = index => {
    return ({ nativeEvent: { key: value } }) => {
      if (value === 'Backspace' && verifyArray[index] === '') {
        const inputStyleCopy = inputStyle.concat()
        inputStyleCopy[index] = { borderColor: AppColor.contentEbony }
        setInputStyle(inputStyleCopy)

        if (index === 1) {
          firstTextInput.current.focus()
        } else if (index === 2) {
          secondTextInput.current.focus()
        } else if (index === 3) {
          thirdTextInput.current.focus()
        } else {
          Keyboard.dismiss()
        }

        if (index > 0) {
          const verifyArrayCopy = verifyArray.concat()
          verifyArrayCopy[index - 1] = ''
          setVerifyArray(verifyArrayCopy)
        }
      }
    }
  }

  const sendVerification = async code => {
    if (code.join('').length === 4) {
      const nCode = parseInt(code.join(''))
      setIsScreenLoading(true)

      try {
        const response = await Api.verifyCode({
          body: {
            provider,
            code: nCode,
          },
          uid,
        })
        if (response.success) updateProfile()
        else {
          setNotificationType('danger')
          setNotificationMessage(
            <AppText textStyle="body2" customStyle={notificationText}>
              Verification code didn’t match
            </AppText>
          )
        }
      } catch (error) {
        setNotificationType('danger')
        setNotificationMessage(
          <AppText textStyle="body2" customStyle={notificationText}>
            {error?.message || error}
          </AppText>
        )
      }
      setIsScreenLoading(false)
      setIsNotificationVisible(true)
      closeNotificationTimer()
    }
  }

  const updateProfile = async () => {
    const loginToUpdate = isEmail
      ? { email: newLogin }
      : { phone_number: newLogin }
    try {
      const updateUserResponse = await Api.updateUser({
        body: loginToUpdate,
        uid,
      })
      if (updateUserResponse.success) {
        toggleVerify()
        toggleEditLogin('')
      }
    } catch (error) {
      console.log(error.message || error)
    }
  }

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setIsNotificationVisible(false)
    }, 5000)
  }

  const resendCodeHandler = async () => {
    setIsScreenLoading(true)
    try {
      const response = await Api.resendCode({
        body: {
          provider,
        },
        uid: user.uid,
      })
      if (response.success) {
        setNotificationType('success')
        setNotificationMessage(
          <AppText textStyle="body2" customStyle={{ color: '#fff' }}>
            Verification code has been sent to your {provider} {login}
          </AppText>
        )
      } else throw new Error(response.message)
    } catch (error) {
      setNotificationType('danger')
      setNotificationMessage(
        <AppText textStyle="body2" customStyle={notificationErrorTextStyle}>
          Failed resend verification code {provider} {login}
        </AppText>
      )
    }
    setIsScreenLoading(false)
    isNotificationVisible(true)
    closeNotificationTimer()
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
  }

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isNotificationVisible && (
        <Notification
          type={notificationType}
          onClose={() => setIsNotificationVisible(false)}
          icon={notificationType === 'danger' ? <Warning /> : <CircleTick />}>
          <View style={{ marginLeft: 15, marginTop: 10 }}>
            {notificationMessage}
          </View>
        </Notification>
      )}
      <View style={styles.container}>
        <TransitionIndicator loading={isScreenLoading} />
        <View style={styles.defaultStyle}>
          <VerifyIcon />
        </View>
        <View style={{ ...styles.defaultStyle, ...styles.spacingBottom }}>
          <AppText textStyle="display5">Enter Verification Code</AppText>
        </View>
        <View style={{ ...styles.defaultStyle, ...styles.spacingBottomx2 }}>
          <AppText textStyle="body2" customStyle={styles.bodyContent}>
            An email with the 4-digit code has been sent to{' '}
            <AppText textStyle="body3" customStyle={styles.bodyContent}>
              {newLogin.toLowerCase()}
            </AppText>
          </AppText>
        </View>

        <View
          style={{ ...styles.verificationWrapper, ...styles.spacingBottomx4 }}>
          {[
            firstTextInput,
            secondTextInput,
            thirdTextInput,
            fourthTextInput,
          ].map((textInputRef, index) => (
            <TextInput
              style={{
                ...styles.inputVerification,
                ...(index === 0
                  ? styles.resetMarginLeft
                  : index === 3
                  ? styles.resetMarginRight
                  : null),
                ...inputStyle[index],
              }}
              keyboardType={'number-pad'}
              maxLength={1}
              onChangeText={onVerifyChange(index)}
              onKeyPress={onVerifyKeyPress(index)}
              autoFocus={index === 0 ? true : undefined}
              ref={textInputRef}
              value={verifyArray[index]}
              key={index}
            />
          ))}
        </View>

        <View style={{ ...styles.defaultStyle, ...styles.spacingBottom }}>
          <AppText textStyle="body2" customStyle={styles.bodyContent}>
            Didn’t receive a code?
          </AppText>
        </View>
        <TouchableOpacity
          customStyle={styles.defaultStyle}
          onPress={() => {
            resendCodeHandler()
          }}>
          <AppText
            textStyle="body2"
            customStyle={{
              ...styles.bodyContent,
              ...styles.contentColorOverride,
            }}>
            Resend code
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
    paddingTop: 96,
  },
  bodyContent: {
    textAlign: 'center',
  },
  spacingBottom: {
    marginBottom: 8,
  },
  spacingBottomx2: {
    marginBottom: 16,
  },
  spacingBottomx4: {
    marginBottom: 32,
  },
  timerWrapper: {
    justifyContent: 'flex-end',
  },
  timerText: {
    textAlign: 'right',
  },
  verificationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputVerification: {
    flex: 1,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    fontSize: 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 8,
    marginLeft: 8,
    borderColor: AppColor.contentEbony,
  },
  resetMarginLeft: {
    marginLeft: 0,
  },
  resetMarginRight: {
    marginRight: 0,
  },
  defaultStyle: {
    alignItems: 'center',
  },
  contentColorOverride: {
    color: AppColor.contentOcean,
  },
})

export default VerifyAccount
