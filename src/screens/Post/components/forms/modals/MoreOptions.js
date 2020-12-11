import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { AppText, BottomSheetHeader } from '@/components'
import { normalize } from '@/globals'
import { MOCalendar, Draft, Notes, Clock } from '@/assets/images/icons'

const MoreOptions = ({ close, setMoreOptions }) => {
  const showOption = opt => {
    setMoreOptions(opt)
    close()
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      }}>
      <BottomSheetHeader />
      <View style={{ padding: 24, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <AppText textStyle="display6">More Options</AppText>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={() => showOption('schedule')}>
          <MOCalendar height={normalize(24)} width={normalize(24)} />
          <AppText textStyle="body2" customStyle={styles.textMargin}>
            Add Store Schedule
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={() => showOption('expiry')}>
          <Clock height={normalize(24)} width={normalize(24)} />
          <AppText textStyle="body2" customStyle={styles.textMargin}>
            Set Cut-off Time
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={() => showOption('addNotes')}>
          <Notes height={normalize(24)} width={normalize(24)} />
          <AppText textStyle="body2" customStyle={styles.textMargin}>
            Additional Notes
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7}>
          <Draft height={normalize(24)} width={normalize(24)} />
          <AppText textStyle="body2" customStyle={styles.textMargin}>
            Save As Draft
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMargin: {
    marginLeft: 8,
  },
})

export default MoreOptions
