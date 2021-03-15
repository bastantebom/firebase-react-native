import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'

/**
 *
 * @param {object} props
 * @param {boolean} props.disabled
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.checkboxStyle
 * @param {function} props.onPress
 */
const RadioButton = ({
  value,
  disabled,
  onPress,
  containerStyle,
  radioStyle,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => onPress?.()}
      style={[styles.wrapper, containerStyle]}>
      {!!value ? (
        <Icons.RadioActive style={radioStyle} {...iconSize(24)} {...props} />
      ) : (
        <Icons.RadioInactive style={radioStyle} {...iconSize(24)} {...props} />
      )}
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row-reverse',
  },
})

export default RadioButton
