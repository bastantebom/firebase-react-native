import React, { useState } from 'react'
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { ArrowRight, PostClock, Calendar } from '@/assets/images/icons'

const PostExpiryModal = ({ close, postExpiry, setPostExpiry }) => {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    postExpiry ? moment(postExpiry).format('LL') : ''
  )
  const [selectedTime, setSelectedTime] = useState(
    postExpiry ? moment(postExpiry).format('h:mm A') : ''
  )

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDate(Platform.OS === 'ios')
    setDate(currentDate)
    const dateSelected = moment(currentDate).format('LL')
    setSelectedDate(dateSelected)
  }

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time
    setShowTime(Platform.OS === 'ios')
    setTime(currentTime)
    const timeSelected = moment(currentTime).format('h:mm A')

    return setSelectedTime(timeSelected)
  }

  const showDatepicker = () => {
    setShowTime(false)
    setShowDate(true)
  }

  const showTimepicker = () => {
    setShowDate(false)
    setShowTime(true)
  }

  const clearExpiry = () => {
    setSelectedTime('')
    setSelectedDate('')
  }

  const submitHandler = () => {
    // console.log(selectedDate)
    // console.log(selectedTime)

    let expiryTimeStamp = new Date(`${selectedDate} ${selectedTime}`)

    // setPostExpiry(expiryTimeStamp)
    // close()
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScreenHeaderTitle title="Post Expiry" paddingSize={2} close={close} />
      <View style={{ padding: normalize(16), height: '100%' }}>
        <View style={{ flex: 0.8 }}>
          <AppText textStyle="body2">Set post cut off date</AppText>
          <AppText textStyle="captionDashboard">Something, something</AppText>
          <TouchableOpacity
            onPress={clearExpiry}
            disabled={selectedTime || selectedDate ? false : true}>
            <AppText
              textStyle="body3"
              customStyle={{
                textAlign: 'right',
                color: selectedTime || selectedDate ? '#3781FC' : '#CACBCC',
              }}>
              Clear
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={showTimepicker}>
            <View style={{ flex: 0.75 }}>
              <View style={{ flexDirection: 'column' }}>
                {selectedTime ? (
                  <>
                    <AppText textStyle="body3">Time</AppText>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <PostClock width={normalize(22)} height={normalize(22)} />
                      <AppText
                        textStyle="caption"
                        customStyle={{ marginLeft: 10 }}>
                        {selectedTime}
                      </AppText>
                    </View>
                  </>
                ) : (
                  <AppText textStyle="body3">Set Time</AppText>
                )}
              </View>
            </View>
            <View
              style={{
                flex: 0.25,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <ArrowRight />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              { borderTopColor: '#DADCE0', borderTopWidth: 1 },
            ]}
            onPress={showDatepicker}>
            <View style={{ flex: 0.75 }}>
              <View style={{ flexDirection: 'column' }}>
                {selectedDate ? (
                  <>
                    <AppText textStyle="body3">Date</AppText>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Calendar width={normalize(25)} height={normalize(25)} />
                      <AppText
                        textStyle="caption"
                        customStyle={{ marginLeft: 10 }}>
                        {selectedDate}
                      </AppText>
                    </View>
                  </>
                ) : (
                  <AppText textStyle="body3">Set Date</AppText>
                )}
              </View>
            </View>
            <View
              style={{
                flex: 0.25,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <ArrowRight />
            </View>
          </TouchableOpacity>
          <View>
            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onChangeDate}
              />
            )}
            {showTime && (
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={onChangeTime}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={submitHandler}
          disabled={selectedTime && selectedDate ? false : true}
          style={
            selectedTime && selectedDate ? styles.btnYellow : styles.btnDisabled
          }>
          <AppText textStyle="button2">Set Cut off</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: normalize(14),
    marginTop: normalize(20),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnYellow: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFD400',
    borderRadius: 3,
  },
  btnDisabled: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F2F4F6',
    borderRadius: 3,
  },
})

export default PostExpiryModal
