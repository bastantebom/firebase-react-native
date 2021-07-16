import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { BottomSheetHeader, PaddingView, AppRadio } from '@/components'
import { normalize } from '@/globals'

const Gender = ({ onChange, value: _value, choices: _choices = [] }) => {
  const [value, setValue] = useState(_value)
  const choices = _choices.length
    ? _choices
    : [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
        {
          label: 'Non-binary',
          value: 'Non-binary',
        },
        {
          label: 'Prefer not to say',
          value: 'Prefer not to say',
        },
      ]

  const handleChange = _value => {
    setValue(_value)
    onChange(_value)
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <View style={{ justifyContent: 'space-between' }}>
          {choices.map(option => (
            <AppRadio
              key={option.value}
              label={option.label}
              name={option.value}
              value={value === option.value}
              valueChangeHandler={handleChange}
              style={styles.radio}
            />
          ))}
        </View>
      </PaddingView>
    </View>
  )
}

const styles = StyleSheet.create({
  radio: {
    marginBottom: normalize(16),
  },
})

export default Gender
