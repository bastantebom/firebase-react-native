import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { TimePicker } from 'react-native-wheel-picker-android'

/**
 * @param {object} props
 * @param {string} title
 * @param {funcion} close
 * @param {funcion} onSubmit
 * @param {string} value
 **/
const SetTimeModal = ({ close, title, onSubmit, value }) => {
  const [currentValue, setCurrentValue] = useState('')
  const [initDate, setInitDate] = useState(null)

  const handleOnTimeSelected = time => {
    const date = new Date(time)
    const hour = date.getHours()
    const minute = date.getMinutes()

    setCurrentValue(
      `${((hour % 12 || 12) + '').padStart(2, '0')}:${(minute + '').padStart(
        2,
        '0'
      )}${hour >= 12 ? 'PM' : 'AM'}`
    )
  }

  useEffect(() => {
    const matches = (value || '').match(/(\d{2}):(\d{2})(AM|PM)/)
    const dateNow = new Date()
    if (!matches) {
      setInitDate(dateNow)
      return
    }

    const [hour, minute, ampm] = matches.slice(1)
    setInitDate(
      new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate(),
        parseInt(hour) < 12 && ampm === 'PM' ? parseInt(hour) + 12 : hour,
        minute
      )
    )
  }, [])

  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <View style={styles.titleWrapper}>
        <TouchableOpacity style={styles.closeButton} onPress={close}>
          <Icons.Close style={{ color: Colors.icon }} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        {!!initDate && (
          <TimePicker
            onTimeSelected={handleOnTimeSelected}
            minutes={['00', '30', '00', '30']}
            initDate={initDate}
          />
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label="Save"
          type="primary"
          onPress={() => onSubmit(currentValue)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  closeButton: {
    paddingHorizontal: normalize(8),
  },
  titleWrapper: {
    margin: normalize(16),
    marginLeft: normalize(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  buttonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
})

export default SetTimeModal
