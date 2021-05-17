import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native'
import TextInput from '@/components/textinput'
import Checkbox from '@/components/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns/esm'
/**
 * @param {object} props
 * @param {function} props.onSubmit
 * @param {function} props.close
 * @param {any} props.data
 **/
const BookingScheduleModal = ({ onSubmit, close, ...props }) => {
  const [data, setData] = useState({
    schedule: props.data?.schedule,
    flexible: props.data?.flexible,
    timeSlot: props.data?.timeSlot,
  })

  const handleOnSubmit = () => {
    onSubmit(data)
    close()
  }

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [datePickerValue, setDatePickerValue] = useState(new Date())

  const handleOnDateChange = (event, value) => {
    setIsDatePickerVisible(false)
    if (!value) return
    setData(data => ({ ...data, schedule: format(value, 'MMMM dd, yyyy') }))
    setDatePickerValue(value)
  }

  return (
    <>
      <View style={styles.container}>
        <BottomSheetHeader />
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{ marginTop: normalize(24) }}
              activeOpacity={0.7}
              onPress={close}>
              <Icons.Back
                style={{ color: Colors.primaryMidnightBlue }}
                {...iconSize(24)}
              />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text
                style={[
                  typography.subtitle1,
                  { marginTop: normalize(28), justifyContent: 'center' },
                ]}>
                Service Schedule
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              { marginTop: normalize(14) },
            ]}>
            Set Date
          </Text>
          <TouchableOpacity
            style={{
              marginVertical: normalize(12),
              height: normalize(54),
              width: '100%',
              zIndex: 2000,
            }}
            activeOpacity={0.7}
            onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}>
            <View pointerEvents="none">
              <TextInput
                containerStyle={{
                  borderColor: Colors.neutralGray,
                }}
                inputStyle={{ color: Colors.contentEbony }}
                placeholder={data.schedule ? null : 'Select'}
                value={data.schedule}
                label={data.schedule ? 'Date' : null}
                disabled
                filled
                editable={false}
                placeholderTextColor="#A8AAB7"
                rightIcon={() => (
                  <Icons.Calendar style={{ color: Colors.icon }} />
                )}
              />
            </View>
            {isDatePickerVisible && (
              <DateTimePicker
                value={datePickerValue}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleOnDateChange}
                minimumDate={Date.now()}
                style={styles.datePicker}
              />
            )}
          </TouchableOpacity>

          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              { marginTop: normalize(14) },
            ]}>
            Select Preferred Time Slot
          </Text>

          <Checkbox
            onPress={() =>
              setData(data => ({ ...data, flexible: !data.flexible }))
            }
            containerStyle={styles.checkbox}
            checked={data.flexible}>
            <Text style={[typography.body2, styles.checkboxLabel]}>
              Flexi [9am-10pm]
            </Text>
          </Checkbox>
          <View style={styles.divider} />

          <Checkbox
            onPress={() =>
              setData(data => ({
                ...data,
                timeSlot: data.timeSlot === 'morning' ? null : 'morning',
              }))
            }
            containerStyle={styles.checkbox}
            checked={data.timeSlot === 'morning'}>
            <Text style={[typography.body2, styles.checkboxLabel]}>
              Morning [9am-12nn]
            </Text>
          </Checkbox>

          <Checkbox
            onPress={() =>
              setData(data => ({
                ...data,
                timeSlot: data.timeSlot === 'afternoon' ? null : 'afternoon',
              }))
            }
            containerStyle={styles.checkbox}
            checked={data.timeSlot === 'afternoon'}>
            <Text style={[typography.body2, styles.checkboxLabel]}>
              Afternoon [1pm-6pm]
            </Text>
          </Checkbox>

          <Checkbox
            onPress={() =>
              setData(data => ({
                ...data,
                timeSlot: data.timeSlot === 'evening' ? null : 'evening',
              }))
            }
            containerStyle={styles.checkbox}
            checked={data.timeSlot === 'evening'}>
            <Text style={[typography.body2, styles.checkboxLabel]}>
              Night [6pm-10pm]
            </Text>
          </Checkbox>

          <View style={styles.buttonWrapper}>
            <Button label="Book" type="primary" onPress={handleOnSubmit} />
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  content: {
    padding: normalize(24),
  },
  header: {
    flexDirection: 'row',
    paddingBottom: normalize(16),
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  buttonWrapper: {
    paddingTop: normalize(24),
  },
  divider: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralGray,
    marginVertical: normalize(14),
  },
  checkbox: {
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: normalize(12),
  },
  datePicker: {
    backgroundColor: Colors.neutralsWhite,
    marginTop: normalize(16),
  },
})

export default BookingScheduleModal
