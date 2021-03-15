import { Colors, normalize } from '@/globals'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import TextInput from './index'

const PriceInput = ({ priceLabel, ...props }) => {
  return (
    <TextInput
      inputStyle={{
        textAlign: 'right',
        fontFamily: 'RoundedMplus1c-Medium',
        marginLeft: normalize(48),
      }}
      labelStyle={{
        textAlign: 'right',
      }}
      isCurrency={true}
      {...props}
      onChangeValue={value =>
        props.onChangeText(value > 9999999.99 ? 9999999.99 : value)
      }
      onChangeText={() => {}}
      maxValue={props.maxValue || 9999999.99}>
      <View style={styles.priceInputLabelWrapper}>
        <Text style={styles.priceInputLabel}>{priceLabel || 'Price'}</Text>
        <Text style={styles.priceInputLabel}>PHP</Text>
      </View>
    </TextInput>
  )
}

const styles = StyleSheet.create({
  priceInputLabel: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(0.25),
    color: Colors.contentPlaceholder,
  },
  priceInputLabelWrapper: {
    position: 'absolute',
    left: normalize(16),
  },
})

export default PriceInput
