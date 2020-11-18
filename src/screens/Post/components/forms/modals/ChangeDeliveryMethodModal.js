import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { AppText, AppRadio, AppInput, ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'
import { ChevronDown, PostCalendar, PostClock } from '@/assets/images/icons'

import { Context } from '@/context'

const ChangeDeliveryMethodModal = ({ closeModal }) => {
  const { deliveryMethod, setDeliveryMethod } = useContext(Context)

  const [deliverNow, setDeliverNow] = useState(true)
  const [forLater, setForLater] = useState(false)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment().format('LL'))
  const [selectedTime, setSelectedTime] = useState(moment().format('h:mm A'))

  const RadioStateHandler = val => {
    if (val === 'deliverNow') {
      setDeliverNow(true)
      setForLater(false)
      setSelectedTime('')
      setSelectedDate('')
    }
    if (val === 'forLater') {
      setForLater(true)
      setDeliverNow(false)
    }
  }

  const deliveryHandler = () => {
    if (deliveryMethod !== 'delivery') {
      setDeliveryMethod('delivery')
    }
  }

  const pickUpHandler = () => {
    if (deliveryMethod !== 'pickup') {
      setDeliveryMethod('pickup')
    }
  }

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

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: normalize(20),
      }}>
      <ScreenHeaderTitle close={closeModal} iconSize={normalize(16)} />
      <View>
        <AppText
          textStyle="subtitle1"
          customStyle={{
            marginTop: normalize(25),
            marginVertical: normalize(10),
            textAlign: 'center',
          }}>
          Change Delivery Method
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: normalize(10),
          }}>
          <TouchableOpacity onPress={deliveryHandler}>
            <AppText
              textStyle="body3"
              color={
                deliveryMethod === 'delivery' ? Colors.contentOcean : '#000'
              }
              customStyle={{ marginRight: normalize(15) }}>
              Delivery
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickUpHandler}>
            <AppText
              textStyle="body3"
              color={
                deliveryMethod === 'pickup' ? Colors.contentOcean : '#000'
              }>
              Pick-up
            </AppText>
          </TouchableOpacity>
        </View>
        <AppRadio
          label={
            <AppText textStyle="body1medium">
              {deliveryMethod === 'delivery' ? 'Deliver Now' : 'Pick up Now'}
            </AppText>
          }
          value={deliverNow}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('deliverNow')}
        />
        <View
          style={{
            borderBottomColor: '#f9f9f9',
            borderBottomWidth: 1.5,
          }}></View>
        <AppRadio
          label={<AppText textStyle="body1medium">Schedule for later</AppText>}
          value={forLater}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('forLater')}
        />
        <TouchableOpacity
          disabled={!forlater}
          onPress={showDatepicker}
          style={{ marginVertical: normalize(10) }}>
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
              {forLater ? (
                <PostCalendar width={normalize(18)} height={normalize(18)} />
              ) : (
                <ChevronDown width={normalize(20)} height={normalize(20)} />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!forlater}
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
              {forLater ? (
                <PostClock width={normalize(22)} height={normalize(22)} />
              ) : (
                <ChevronDown width={normalize(20)} height={normalize(20)} />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View>
          {showDate && (
            <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
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
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(5),
    marginVertical: normalize(5),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default ChangeDeliveryMethodModal
