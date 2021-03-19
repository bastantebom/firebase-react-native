import React, { useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import {
  ScreenHeaderTitle,
  AppText,
  AppButton,
  FloatingAppInput,
  Notification,
  TransitionIndicator,
} from '@/components'
import { TempHistory, TempAboutScreen } from '@/screens/Profile/components'
import { UserContext } from '@/context/UserContext'

import { Colors, normalize } from '@/globals'
import Modal from 'react-native-modal'
import Api from '@/services/Api'
import { Icons } from '@/assets/images/icons'

const UpdateTemp = ({ toggleUpdateTemp }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const { temperature_history } = userInfo
  const [history, setHistory] = useState(false)
  const [tempAbout, setTempAbout] = useState(false)
  const [temp, setTemp] = useState('')
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  })
  const [buttonDisable, setButtonDisable] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [copyGuide, setCopyGuide] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  const toggleHistory = () => {
    setHistory(!history)
  }

  const toggleTempAbout = () => {
    setTempAbout(!tempAbout)
  }

  const onTempChangeHandler = temp => {
    const decimalRegEx = /^\d{2}\.\d{1}$|^\d{2}$/

    if (temp < 40 && temp >= 35 && decimalRegEx.test(temp)) {
      setButtonState(false)
    } else {
      setButtonState(true)
    }
    setTemp(temp)
  }

  const setButtonState = j => {
    if (j) {
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      })
    } else {
      setButtonStyle({})
    }

    setButtonDisable(j)
  }

  const updateTempHandler = async () => {
    setIsNotificationVisible(false)
    setIsUpdating(true)
    try {
      const updateTempResponse = await Api.updateTemperature({
        body: { temperature: temp },
        uid: user.uid,
      })

      if (updateTempResponse.success) {
        setTemp('')
        setButtonState(true)
        triggerNotification(
          'Temperature has been updated successfully!',
          'success'
        )
      }
      if (!updateTempResponse.success) {
        triggerNotification('Temperature update failed!', 'danger')
      }
      setIsUpdating(false)
    } catch (error) {
      setIsUpdating(false)
      triggerNotification(error?.message || error, 'danger')
    }
    setIsNotificationVisible(true)
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  }

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
    color: 'white',
  }

  const triggerNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>
    )
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TransitionIndicator loading={isUpdating} />
        {isNotificationVisible && (
          <Notification
            type={notificationType}
            onClose={() => setIsNotificationVisible(false)}
            icon={
              notificationType === 'danger' ? (
                <Icons.Warning />
              ) : (
                <Icons.CircleTickWhite />
              )
            }>
            <View style={{ marginLeft: 15, marginTop: 10 }}>
              {notificationMessage}
            </View>
          </Notification>
        )}
        <KeyboardAvoidingView style={{ flex: 1, padding: 24 }}>
          <ScreenHeaderTitle
            title="Track your temperature"
            customTitleStyle={{
              textTransform: 'none',
              maxWidth: '70%',
            }}
            close={toggleUpdateTemp}
            rightLink="History"
            rightLinkEvent={toggleHistory}
          />
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ paddingVertical: 24 }}>
              <AppText textStyle="body1" customStyle={{ paddingBottom: 8 }}>
                What’s your body temperature today?
              </AppText>
              <AppText
                textStyle="captionConstant"
                customStyle={{ paddingBottom: 8 }}>
                We prioritize health and safety. Please take your temperature
                using a scanner or thermometer and log it down below.
              </AppText>
              <TouchableOpacity
                onPress={toggleTempAbout}
                customStyle={{
                  paddingBottom: 8,
                  marginBottom: 12,
                  backgroundColor: 'red',
                }}>
                <AppText
                  textStyle="captionConstant"
                  color={Colors.contentOcean}>
                  Why we’re asking this?
                </AppText>
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <FloatingAppInput
                  value={temp}
                  label="Body Temperature"
                  keyboardType="number-pad"
                  returnKeyType={'done'}
                  customStyle={[
                    { marginTop: normalize(8) },
                    temp > 37.5 && styles.errorField,
                  ]}
                  onChangeText={temp => {
                    onTempChangeHandler(temp)
                  }}
                  onInputFocus={() => {
                    setCopyGuide(true)
                  }}
                />
                {temp > 37.5 && (
                  <View style={styles.clearInput}>
                    <TouchableOpacity
                      onPress={() => {
                        setTemp('')
                      }}>
                      <Icons.ErrorInput />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {copyGuide ? (
                <AppText
                  textStyle="captionConstant"
                  customStyle={{ marginTop: 8 }}>
                  Body temperature should be in °Celsius
                </AppText>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <AppButton
                text="Save"
                type="primary"
                height="xl"
                disabled={buttonDisable}
                customStyle={{ ...buttonStyle }}
                onPress={updateTempHandler}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        isVisible={history}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TempHistory profileData={userInfo} toggleHistory={toggleHistory} />
      </Modal>

      <Modal
        isVisible={tempAbout}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TempAboutScreen toggleTempAbout={toggleTempAbout} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  errorField: {
    borderColor: Colors.errColor,
    borderWidth: 1,
  },
  inputWrapper: {
    position: 'relative',
    marginTop: normalize(16),
  },
  clearInput: {
    position: 'absolute',
    right: normalize(16),
    top: normalize(14),
  },
})

export default UpdateTemp
