import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { AppText, BottomSheetHeader } from '@/components'
import { Colors } from '@/globals'

const ServiceSchedule = ({ close, setServiceSchedule }) => {
  const [timePicker, showTimePicker] = useState(false)
  const [date, setDate] = useState(new Date())

  const submitHandler = () => {
    const dateString = moment(date).format('MMMM D, YYYY @h:mm a')

    setServiceSchedule(dateString)

    close()
  }

  const DatePicker = () => {
    return (
      <View style={{ padding: 24 }}>
        <AppText textStyle="display6">Set Date</AppText>
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedtime) => {
            setDate(selectedtime)
          }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => showTimePicker(true)}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 8,
            marginTop: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            borderRadius: 4,
          }}>
          <AppText textStyle="body3">Done</AppText>
        </TouchableOpacity>
      </View>
    )
  }

  const TimePicker = () => {
    return (
      <View style={{ padding: 24 }}>
        <AppText textStyle="display6">Set Time</AppText>
        <DateTimePicker
          value={date}
          mode="time"
          display="spinner"
          onChange={(event, selectedtime) => {
            setDate(selectedtime)
          }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={submitHandler}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 8,
            marginTop: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            borderRadius: 4,
          }}>
          <AppText textStyle="body3">Save</AppText>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      }}>
      <BottomSheetHeader />

      {timePicker ? <TimePicker /> : <DatePicker />}
    </View>
  )
}

export default ServiceSchedule
