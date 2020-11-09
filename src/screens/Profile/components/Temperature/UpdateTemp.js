import React, { useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import {
  ScreenHeaderTitle,
  AppText,
  AppButton,
  FloatingAppInput,
  Notification,
} from '@/components'
import { TempHistory, TempAboutScreen } from '@/screens/Profile/components'
import { UserContext } from '@/context/UserContext'

import { Colors, normalize } from '@/globals'
import Modal from 'react-native-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Api from '@/services/Api'
import { Context } from '@/context'

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
  const { openNotification, closeNotification } = useContext(Context)
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  const toggleHistory = () => {
    setHistory(!history)
  }

  const toggleTempAbout = () => {
    setTempAbout(!tempAbout)
  }

  const onTempChangeHandler = temp => {
    if (temp > 0) {
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
    setIsUpdating(true)
    try {
      const updateTempResponse = await Api.updateTemperature({
        body: { temperature: temp },
        uid: user.uid,
      })

      if (updateTempResponse.success) {
        const nTemp = [...temperature_history]
        nTemp[temperature_history.length] = updateTempResponse.data
        setUserInfo({
          ...userInfo,
          temperature_history: [...nTemp],
          temperature: updateTempResponse.data,
        })
        setTemp('')
        setButtonState(true)
        triggerNotification(
          'Temperature has been updated successfully!',
          'success'
        )
      }
      if (!updateTempResponse.success) {
        triggerNotification('Temperature update failed!', 'error')
      }
      setIsUpdating(false)
    } catch (error) {
      setIsUpdating(false)
      triggerNotification('Temperature update failed!', 'error')
      console.log(error?.message || error)
    }
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
    openNotification()
    closeNotificationTimer()
  }

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType()
      setNotificationMessage()
      closeNotification()
    }, 5000)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Notification message={notificationMessage} type={notificationType} />
        <KeyboardAvoidingView style={{ flex: 1, padding: 24 }}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Update Body Temperature"
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
                We’ll need your help to safeguard the health of both you and
                your customers. Use a temperature scanner or a thermometer to
                take your temperature.
              </AppText>
              <TouchableOpacity
                onPress={toggleTempAbout}
                customStyle={{ paddingBottom: 8, marginBottom: 12 }}>
                <AppText
                  textStyle="captionConstant"
                  color={Colors.contentOcean}>
                  Why we’re asking this?
                </AppText>
              </TouchableOpacity>
              <FloatingAppInput
                value={temp}
                label="Body Temperature"
                keyboardType="number-pad"
                customStyle={{ marginTop: 16 }}
                onChangeText={temp => {
                  onTempChangeHandler(temp)
                }}
                onInputFocus={() => {
                  setCopyGuide(true)
                }}
              />
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
                onPress={() => updateTempHandler()}
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

export default UpdateTemp
