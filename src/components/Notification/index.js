import { Colors, normalize } from '@/globals'
import React, { useEffect, useState } from 'react'
import { Easing, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Animated } from 'react-native'
import { Icons } from '@/assets/images/icons'

/**
 * @param {object} param0
 * @param {boolean} [param0.animate=true]
 * @param {boolean} [param0.closeable=true]
 * @param {boolean} [param0.isVisible=true]
 * @param {'primary'|'success'|'danger'} [param0.type='primary']
 * @param {() => void} param0.onClose
 * @param {{delay: number, duration: number, height: number}} param0.animationOptions
 */
export const Notification = ({
  children,
  icon,
  onClose,
  isVisible = true,
  type = 'primary',
  closeable = true,
  animate = true,
  animationOptions,
  containerStyle = {},
}) => {
  const [notificationHeight] = useState(new Animated.Value(0))

  const animatedStyle = {
    height: notificationHeight,
  }

  const handleClose = () => {
    onClose?.()
  }

  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        Animated.timing(notificationHeight, {
          useNativeDriver: false,
          toValue: animationOptions?.height || 70,
          easing: Easing.ease,
          duration: animationOptions?.duration || 240,
        }).start()
      }, animationOptions?.delay || 0)
    } else {
      notificationHeight.setValue(animationOptions?.height || 70)
    }
  }, [])

  return !isVisible ? null : (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        containerStyle,
        animatedStyle,
        closeable && { paddingRight: normalize(45) },
        icon && { paddingLeft: normalize(36) },
      ]}>
      <View style={styles.iconWrapper}>{icon}</View>
      {children}

      {closeable && (
        <TouchableOpacity onPress={handleClose} style={styles.closeWrapper}>
          <Icons.Close style={{ color: '#fff' }} />
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  closeWrapper: {
    height: normalize(24),
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconWrapper: {
    position: 'absolute',
    top: normalize(16),
    left: normalize(16),
  },
  notification: {
    backgroundColor: Colors.secondaryBrinkPink,
  },
  success: {
    backgroundColor: Colors.primaryMidnightBlue,
    color: '#fff',
  },
  primary: {
    backgroundColor: Colors.contentOcean,
  },
  danger: {
    backgroundColor: Colors.errorInput,
  },
})
