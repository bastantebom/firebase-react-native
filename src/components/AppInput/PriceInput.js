import React, { createRef, useState } from 'react'
import { TextInput, View, TouchableOpacity } from 'react-native'
import { AppText } from '@/components'
import { Colors, normalize } from '@/globals'

const PriceInput = ({ style, label, ...props }) => {
  const inputRef = createRef()

  const handleClick = () => {
    inputRef.current.focus()
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleClick}
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 4,
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderColor: Colors.neutralGray
        },
        style,
      ]}>
      <View>
        <AppText textStyle="body2">{label ? label : 'Price '}</AppText>
        <AppText textStyle="body2">PHP</AppText>
      </View>
      <TextInput
        {...props}
        ref={inputRef}
        style={constantStyles.floatingInput}
      />
    </TouchableOpacity>
  )
}

const constantStyles = {
  floatingInput: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(19),
    letterSpacing: 0.5,
    minWidth: '10%',
    textAlign: 'right',
  },
}

export default PriceInput
