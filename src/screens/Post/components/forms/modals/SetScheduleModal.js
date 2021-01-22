import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  AppText,
  AppInput,
  ScreenHeaderTitle,
  AppButton,
  HorizontalView,
  Divider,
} from '@/components'

import { normalize, Colors } from '@/globals'

import { ChevronDown, MinusSign, PlusSign } from '@/assets/images/icons'
import { Context } from '@/context'
import { ImageModal } from '@/screens/Post/components/ImageModal'
import { commaSeparate } from '@/globals/Utils'

const SetScheduleModalSingleService = ({
  closeModal,
  post,
  handleContinue,
}) => {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTime, setSelectedTime] = useState()
  const [enabled, isEnabled] = useState(false)

  const onChangeDate = (_, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDate(Platform.OS === 'ios')
    setShowTime(false)
    setDate(currentDate)
    const dateSelected = moment(currentDate).format('LL')
    setSelectedDate(dateSelected)
  }

  const onChangeTime = (_, selectedTime) => {
    const currentTime = selectedTime || time
    setShowTime(Platform.OS === 'ios')
    setShowDate(false)
    setTime(currentTime)
    const timeSelected = moment(currentTime).format('h:mm A')

    return setSelectedTime(timeSelected)
  }

  const showDatepicker = () => {
    setShowDate(true)
    setShowTime(false)
  }

  const showTimepicker = () => {
    setShowTime(true)
    setShowDate(false)
  }

  useEffect(() => {
    isEnabled(false)

    if (selectedTime && selectedDate) {
      isEnabled(true)
    }
  }, [selectedDate, selectedTime])

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingBottom: 16,
      }}>
      <ScreenHeaderTitle close={closeModal} paddingSize={2} />
      <View style={{ padding: 16, paddingBottom: 24 }}>
        <HorizontalView style={{ justifyContent: 'space-between' }}>
          <AppText textStyle="subtitle1">{post.title}</AppText>
          <AppText textStyle="subtitle1">{post.price}</AppText>
        </HorizontalView>

        <Divider />

        <TouchableOpacity
          activeOpacity={0.7}
          style={{ marginBottom: 16 }}
          onPress={showDatepicker}>
          <View pointerEvents="none">
            <AppInput
              label="Date"
              placeholder={selectedDate ? '' : 'Choose date'}
            />
            <AppText
              textStyle="body1"
              customStyle={{
                position: 'absolute',
                top: normalize(20),
                left: normalize(18),
              }}>
              {selectedDate}
            </AppText>
            <View
              style={{
                position: 'absolute',
                right: normalize(16),
                top: normalize(18),
              }}>
              <ChevronDown width={normalize(18)} height={normalize(18)} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ marginBottom: 16 }}
          onPress={showTimepicker}>
          <View pointerEvents="none">
            <AppInput
              label="Time"
              placeholder={selectedTime ? '' : 'Choose time'}
            />
            <AppText
              textStyle="body1"
              customStyle={{
                position: 'absolute',
                top: normalize(20),
                left: normalize(18),
              }}>
              {selectedTime}
            </AppText>
            <View
              style={{
                position: 'absolute',
                right: normalize(16),
                top: normalize(18),
              }}>
              <ChevronDown width={normalize(18)} height={normalize(18)} />
            </View>
          </View>
        </TouchableOpacity>
        <View>
          {showDate && (
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDate(false)}>
                <AppText color={Colors.contentOcean}>Done</AppText>
              </TouchableOpacity>
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onChangeDate}
              />
            </View>
          )}
          {showTime && (
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowTime(false)}>
                <AppText color={Colors.contentOcean}>Done</AppText>
              </TouchableOpacity>
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={onChangeTime}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => handleContinue(selectedDate, selectedTime)}
          activeOpacity={0.7}
          style={{
            backgroundColor: enabled
              ? Colors.primaryYellow
              : Colors.buttonDisable,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 4,
          }}
          disabled={!enabled}>
          <AppText textStyle="button2">Continue</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SetScheduleModalSingleService
