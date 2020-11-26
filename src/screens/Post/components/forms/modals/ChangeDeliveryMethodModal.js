import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { AppText, AppRadio, AppInput, ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'
import { ChevronDown, PostCalendar, PostClock } from '@/assets/images/icons'

import { Context } from '@/context'

const ChangeDeliveryMethodModal = ({
  closeModal,
  availableDeliveryMethods,
  setDeliveryChoice,
  deliveryChoice,
}) => {
  const { deliveryMethod, setDeliveryMethod } = useContext(Context)
  const [deliverNow, setDeliverNow] = useState(true)
  const [forLater, setForLater] = useState(false)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment().format('LL'))
  const [selectedTime, setSelectedTime] = useState(moment().format('h:mm A'))
  const [enabledMethods, setEnabledMethods] = useState({})

  useEffect(() => {
    let temp
    for (const [key, value] of Object.entries(availableDeliveryMethods)) {
      temp = { ...temp, [key]: true }
      setEnabledMethods(temp)
    }
    if (!deliveryChoice)
      for (const [key, value] of Object.entries(temp)) {
        return setDeliveryChoice(key)
      }
  }, [])

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
    if (deliveryChoice !== 'delivery') {
      setDeliveryChoice('delivery')
      // setDeliveryChoice('delivery')
    }
  }

  const pickUpHandler = () => {
    if (deliveryChoice !== 'pickup') {
      setDeliveryChoice('pickup')
      // setDeliveryChoice('pickup')
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
            textAlign: 'left',
          }}>
          Change Delivery Method
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: normalize(10),
          }}>
          <TouchableOpacity
            onPress={deliveryHandler}
            disabled={!enabledMethods?.delivery}>
            <AppText
              textStyle="body3"
              color={
                deliveryChoice === 'delivery'
                  ? Colors.contentOcean
                  : enabledMethods?.delivery
                  ? '#000'
                  : Colors.neutralGray
              }
              customStyle={{ marginRight: normalize(15) }}>
              Delivery
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickUpHandler}
            disabled={!enabledMethods?.pickup}>
            <AppText
              textStyle="body3"
              color={
                deliveryChoice === 'pickup'
                  ? Colors.contentOcean
                  : enabledMethods?.pickup
                  ? '#000'
                  : Colors.neutralGray
              }>
              Pick-up
            </AppText>
          </TouchableOpacity>
        </View>
        <AppRadio
          label={
            <AppText textStyle="body1medium">
              {deliveryChoice === 'delivery' ? 'Deliver Now' : 'Pick up Now'}
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
          style={{ paddingLeft: 0, paddingBottom: forLater ? 0 : 50 }}
          valueChangeHandler={() => RadioStateHandler('forLater')}
        />
        {forLater && (
          <Animated.View style={{ opacity: 0.5 }}>
            <TouchableOpacity
              disabled={!forLater}
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
                    <PostCalendar
                      width={normalize(18)}
                      height={normalize(18)}
                    />
                  ) : (
                    <ChevronDown width={normalize(20)} height={normalize(20)} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={!forLater} onPress={showTimepicker}>
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
          </Animated.View>
        )}
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
