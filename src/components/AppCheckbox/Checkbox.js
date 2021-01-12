import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { AppText } from '@/components'
import { normalize, Colors } from '@/globals'

import { CheckboxCheck } from '@/assets/images/icons'

const Checkbox = ({
  Icon,
  label,
  style,
  value,
  valueChangeHandler,
  children,
  containerStyle,
  checkboxStyle,
  round,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => valueChangeHandler(!value)}
      style={{ ...containerStyle }}>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 8,
          paddingVertical: 8,
          ...style,
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row' }}>
          {Icon ? <Icon /> : null}
          <AppText textStyle="body3" customStyle={{ marginLeft: Icon ? 8 : 0 }}>
            {label}
          </AppText>
        </View>

        <View
          style={{
            width: normalize(20),
            height: normalize(20),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: normalize(4),
            borderWidth: 1.2,
            borderColor: value
              ? Colors.checkboxBorderActive
              : Colors.checkboxBorderDefault,

            backgroundColor: value
              ? Colors.primaryCream
              : Colors.neutralsWhitesmoke,
            ...checkboxStyle,
          }}>
          {value && round ? (
            <View
              style={{
                backgroundColor: Colors.checkboxBorderActive,
                width: normalize(8),
                height: normalize(8),
                borderRadius: 50,
              }}
            />
          ) : value ? (
            <CheckboxCheck width={normalize(7.83)} height={normalize(7.26)} />
          ) : (
            <></>
          )}
        </View>
      </View>
      {children}
    </TouchableOpacity>
  )
}

export default Checkbox
