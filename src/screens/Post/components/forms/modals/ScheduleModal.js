import React, { useState } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import Modal from 'react-native-modal'

import {
  AppText,
  ScreenHeaderTitle,
  Switch,
  Divider,
  AppCheckbox,
  BottomSheetHeader,
} from '@/components'
import { Colors, normalize } from '@/globals'

import { ArrowDown } from '@/assets/images/icons'

// new Date(year, month, day, hours, minutes, seconds, milliseconds)

const ScheduleModal = ({ close }) => {
  const [days, setDays] = useState({
    monday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    tuesday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    wednesday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    thursday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    friday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    saturday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
    sunday: {
      value: false,
      opens: new Date(0, 0, 0, 8, 0, 0, 0),
      closes: new Date(0, 0, 0, 17, 0, 0, 0),
      hour24: false,
      showOpeningTime: false,
      showClosingTime: false,
    },
  })

  const onChangeTime = (event, selectedTime, k, opens) => {
    if (opens)
      for (const [key, value] of Object.entries(days)) {
        if (k === key) {
          return setDays({
            ...days,
            [key]: {
              ...value,
              opens: selectedTime,
            },
          })
        }
      }
    else {
      for (const [key, value] of Object.entries(days)) {
        if (k === key) {
          return setDays({
            ...days,
            [key]: {
              ...value,
              closes: selectedTime,
            },
          })
        }
      }
    }
  }

  const selectDayHandler = k => {
    for (const [key, value] of Object.entries(days)) {
      if (k === key) {
        setDays({
          ...days,
          [key]: {
            ...value,
            value: !value.value,
          },
        })
      }
    }
  }

  const noClosing = k => {
    for (const [key, value] of Object.entries(days)) {
      if (k === key) {
        setDays({
          ...days,
          [key]: {
            ...value,
            hour24: !value.hour24,
          },
        })
      }
    }
  }

  const week = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  const showTimePicker = (k, opens) => {
    if (opens)
      for (const [key, value] of Object.entries(days)) {
        if (k === key) {
          return setDays({
            ...days,
            [key]: {
              ...value,
              showOpeningTime: !value.showOpeningTime,
              showClosingTime: false,
            },
          })
        }
      }
    else {
      for (const [key, value] of Object.entries(days)) {
        if (k === key) {
          return setDays({
            ...days,
            [key]: {
              ...value,
              showClosingTime: !value.showClosingTime,
              showOpeningTime: false,
            },
          })
        }
      }
    }
  }

  const [holidayModal, showHolidayModal] = useState()
  const [holidayList, setHolidayList] = useState([])
  const [holidayDate, setHolidayDate] = useState(new Date())

  const holidayHandler = () => {
    // showHolidayModal(true)

    let tempList = holidayList

    tempList.push(holidayDate)
    setHolidayList(tempList)
    showHolidayModal(false)
  }

  const onChangeHolidayDate = (event, selectedtime) => {
    // console.log('Change')
    // console.log(selectedtime)
    setHolidayDate(selectedtime)
  }

  const DayList = () => {
    return week.map((day, index) => {
      return (
        <>
          <View key={index}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
              onPress={() => selectDayHandler(day)}>
              <AppText
                textStyle="body1"
                customStyle={{ textTransform: 'capitalize' }}>
                {day}
              </AppText>
              <Switch
                value={days[day].value}
                onValueChange={() => selectDayHandler(day)}
              />
            </TouchableOpacity>
            {days[day].value && (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <AppCheckbox
                    value={days[day].hour24}
                    style={{ paddingLeft: 0 }}
                    valueChangeHandler={() => noClosing(day)}
                  />
                  <AppText>24 hours</AppText>
                </TouchableOpacity>
                {!days[day].hour24 && (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => showTimePicker(day, true)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                        paddingRight: 24,
                      }}>
                      <AppText>Opens</AppText>
                      <AppText>
                        {moment(days[day].opens).format('hh:mm A')}
                      </AppText>
                      <ArrowDown />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => showTimePicker(day, false)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                        paddingRight: 24,
                      }}>
                      <AppText>Closes</AppText>
                      <AppText>
                        {moment(days[day].closes).format('hh:mm A')}
                      </AppText>
                      <ArrowDown />
                    </TouchableOpacity>
                  </View>
                )}
                {days[day].showOpeningTime && !days[day].hour24 && (
                  <DateTimePicker
                    value={new Date(days[day].opens)}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedtime) =>
                      onChangeTime(event, selectedtime, day, true)
                    }
                  />
                )}
                {days[day].showClosingTime && !days[day].hour24 && (
                  <DateTimePicker
                    value={new Date(days[day].closes)}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedtime) =>
                      onChangeTime(event, selectedtime, day, false)
                    }
                  />
                )}
              </>
            )}
          </View>
          <Divider />
        </>
      )
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScrollView>
        <ScreenHeaderTitle
          title="Store Schedule"
          paddingSize={2}
          close={close}
        />
        <View style={{ paddingHorizontal: 24 }}>
          <DayList />

          {/* <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
              onPress={() => selectDayHandler('monday')}>
              <AppText
                textStyle="body1"
                customStyle={{ textTransform: 'capitalize' }}>
                Monday
              </AppText>
              <Switch
                value={days.monday.value}
                onValueChange={() => selectDayHandler('monday')}
              />
            </TouchableOpacity>
            {days?.monday.value && (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <AppCheckbox
                    value={days.monday.hour24}
                    style={{ paddingLeft: 0 }}
                    valueChangeHandler={() => noClosing('monday')}
                  />
                  <AppText>24 hours</AppText>
                </TouchableOpacity>
                {!days?.monday.hour24 && (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => {
                        showOpeningTime(true)
                        showClosingTime(false)
                      }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                        paddingRight: 24,
                      }}>
                      <AppText>Opens</AppText>
                      <AppText>
                        {moment(days?.monday.opens).format('hh:mm A')}
                      </AppText>
                      <ArrowDown />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        showOpeningTime(false)
                        showClosingTime(true)
                      }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                        paddingRight: 24,
                      }}>
                      <AppText>Closes</AppText>
                      <AppText>
                        {moment(days?.monday.closes).format('hh:mm A')}
                      </AppText>
                      <ArrowDown />
                    </TouchableOpacity>
                  </View>
                )}
                {openingTime && !days?.monday.hour24 && (
                  <DateTimePicker
                    value={new Date(days?.monday.opens)}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedtime) =>
                      onChangeTime(event, selectedtime, 'monday', true)
                    }
                  />
                )}
                {closingTime && !days?.monday.hour24 && (
                  <DateTimePicker
                    value={new Date(days?.monday.closes)}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedtime) =>
                      onChangeTime(event, selectedtime, 'monday', false)
                    }
                  />
                )}
              </>
            )}
          </View>

          <Divider />
          */}

          {holidayList.length > 0 &&
            holidayList.map((holidate, index) => {
              return (
                <View key={index} style={{ marginVertical: 8 }}>
                  <AppText textStyle="subtitle2">
                    {moment(holidate).format('LL')}
                  </AppText>
                </View>
              )
            })}
          {/* Select date first then select time  */}
          <TouchableOpacity
            onPress={() => showHolidayModal(true)}
            style={{ marginTop: 32 }}>
            <AppText color={Colors.contentOcean} textStyle="body2">
              Set store schedules on holidays
            </AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            close()
          }}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 8,
            marginHorizontal: 24,
            marginTop: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            borderRadius: 4,
          }}>
          <AppText textStyle="body3">Save</AppText>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        isVisible={holidayModal}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showHolidayModal(!holidayModal)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            borderTopEndRadius: 8,
            borderTopStartRadius: 8,
          }}>
          <BottomSheetHeader />
          <View style={{ padding: 24 }}>
            <AppText textStyle="display6">Set Date</AppText>
            <DateTimePicker
              value={holidayDate}
              mode="date"
              display="calendar"
              onChange={(event, selectedtime) =>
                onChangeHolidayDate(event, selectedtime)
              }
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                holidayHandler()
              }}
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
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ScheduleModal
