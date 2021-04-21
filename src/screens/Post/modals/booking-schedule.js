import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
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
          <TouchableOpacity
            style={{ marginTop: normalize(24) }}
            activeOpacity={0.7}
            onPress={close}>
            <Icons.Back
              style={{ color: Colors.primaryMidnightBlue }}
              {...iconSize(24)}
            />
          </TouchableOpacity>

          <Text style={[typography.subtitle1, { marginTop: normalize(28) }]}>
            Service Schedule
          </Text>
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
            onPress={() => setIsDatePickerVisible(true)}>
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
                placeholderTextColor={Colors.neutralsMischka}
                rightIcon={() => (
                  <Icons.Calendar style={{ color: Colors.icon }} />
                )}
              />
            </View>
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
              I’m flexible
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
              Morning
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
              Afternoon
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
              Evening
            </Text>
          </Checkbox>

          <View style={styles.buttonWrapper}>
            <Button label="Book" type="primary" onPress={handleOnSubmit} />
          </View>
        </View>
      </View>
      {isDatePickerVisible && (
        <DateTimePicker
          value={datePickerValue}
          mode="date"
          display="default"
          onChange={handleOnDateChange}
          minimumDate={Date.now()}
        />
      )}
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
})

export default BookingScheduleModal
