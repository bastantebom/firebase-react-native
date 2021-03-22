import React from 'react'
import { Platform } from 'react-native'
import { DatePicker } from 'react-native-wheel-picker-android'
import {
  pickerDateArray,
  increaseDateByDays,
} from 'react-native-wheel-picker-android/src/Utils'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class CustomDatePicker extends DatePicker {
  constructor(props) {
    super(props)
  }

  onDaySelected = position => {
    let selectedDate = this.state.selectedDate
    const daysAfterSelectedDate = this.state.daysAfterSelectedDate
    const hours = selectedDate.getHours()
    const minutes = selectedDate.getMinutes()

    const { startDate, days, daysCount, format } = this.props
    const data = days || pickerDateArray(startDate, daysCount, format)
    if (data[position] === 'Today') {
      selectedDate = new Date()
    } else {
      selectedDate = increaseDateByDays(
        new Date(),
        this.props.startDate ? daysAfterSelectedDate + position : position
      )
    }
    selectedDate.setHours(hours)
    selectedDate.setMinutes(minutes)
    this.onDateSelected(selectedDate)
  }

  render() {
    return Platform.select({
      android: () => super.render(),
      ios: () => (
        <DateTimePicker
          value={this.state.chosenDate}
          onChange={(event, date) => this.setDate(date)}
          display="spinner"
          {...this.props}
        />
      ),
    })()
  }
}
