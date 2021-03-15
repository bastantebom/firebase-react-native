import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'

/**
 *
 * @param {object} props
 * @param {boolean} props.checked
 * @param {boolean} props.disabled
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.checkboxStyle
 * @param {function} props.onPress
 */
const Checkbox = ({
  checked,
  disabled,
  onPress,
  containerStyle,
  checkboxStyle,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => onPress?.()}
      style={[styles.wrapper, containerStyle]}>
      {checked ? (
        <Icons.CheckboxActive
          style={checkboxStyle}
          {...iconSize(24)}
          {...props}
        />
      ) : (
        <Icons.CheckboxInactive
          style={checkboxStyle}
          {...iconSize(24)}
          {...props}
        />
      )}
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
})

export default Checkbox
