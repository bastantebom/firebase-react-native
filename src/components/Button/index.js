import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

/**
 *
 * @param {object} props
 * @param {string} props.label
 * @param {'disabled'|'primary'|'danger'|'primary-outline'|'secondary-outline'} props.type
 * @param {'huge'|'large'|'medium'|'small'} props.size
 * @param {boolean} props.disalbed
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} props.labelStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.style
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.disabledStyle
 */
const Button = ({
  labelStyle,
  label,
  type,
  size = 'large',
  disabled,
  children,
  style,
  disabledStyle,
  ...props
}) => {
  const paddingSizes = {
    huge: normalize(16),
    large: normalize(12),
    medium: normalize(8),
    small: normalize(7),
  }

  const colors = {
    primary: Colors.ServbeesYellow,
    secondary: Colors.primaryMidnightBlue,
    disabled: Colors.Gainsboro,
    danger: Colors.secondaryBrinkPink,
  }

  const defaultTextStyles = {
    huge: {},
    large: {},
    medium: {},
    small: {
      ...typography.caption,
    },
  }

  const defaultButtonStyle = {
    backgroundColor:
      type && !type.endsWith('-outline') ? colors[type] : 'transparent',
    padding: paddingSizes[size],
    ...(disabled && disabledStyle ? disabledStyle : {}),
    ...(type?.endsWith?.('-outline')
      ? {
          borderWidth: normalize(2),
          borderColor: colors[type.split('-')[0]],
          padding: paddingSizes[size] - 2,
        }
      : {}),
  }

  return (
    <TouchableOpacity
      style={[defaultButtonStyle, styles.button, style]}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}>
      {label?.length && (
        <Text
          style={[
            typography.body1,
            typography.medium,
            defaultTextStyles[size],
            labelStyle,
          ]}>
          {label}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: normalize(4),
    alignItems: 'center',
  },
  label: {
    fontFamily: 'RoundedMplus1c-Medium',
    color: Colors.contentEbony,
    fontSize: normalize(16),
    lineHeight: normalize(24),
  },
})

export default Button
