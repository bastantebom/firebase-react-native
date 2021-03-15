import { Colors, normalize } from '@/globals'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

/**
 * @param {object} props
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.toggleStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.style
 * @param {boolean} props.value
 */
const ToggleSwitch = ({
  containerStyle,
  toggleStyle,
  value,
  children,
  style,
  ...props
}) => {
  const switchPosition = useRef(new Animated.Value(4)).current

  const defaultSwitchStyle = {
    transform: [{ translateX: switchPosition }],
  }
  const defaultToggleStyle = {
    backgroundColor: !value ? Colors.neutralsIron : Colors.ServbeesYellow,
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(switchPosition, {
        toValue: normalize(!!value ? 20 : 4),
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start()
  }, [value])

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, containerStyle]}
      {...props}>
      <View style={[styles.toggleSwitch, defaultToggleStyle, toggleStyle]}>
        <Animated.View
          style={[styles.switch, defaultSwitchStyle]}></Animated.View>
      </View>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
  },
  toggleSwitch: {
    height: normalize(24),
    width: normalize(40),
    borderRadius: normalize(12.5),
  },
  switch: {
    backgroundColor: '#fff',
    height: normalize(16),
    width: normalize(16),
    top: normalize(4),
    borderRadius: normalize(8),
  },
})

export default ToggleSwitch
