//import liraries
import React, { useState, useEffect, useCallback, createRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native'
import { Colors, normalize } from '@/globals'
import AppText from '../AppText/AppText'
import ValidationList from './Validation'
import ValidationFunctions from './ValidationFunctions'
import _ from 'lodash'

import { VerifiedGreen } from '@/assets/images/icons'
import DebounceInput from 'react-native-debounce-input'

// create a component
const FloatingAppInput = ({
  value,
  style,
  label,
  wrapperStyle,
  debounce = true,
  customLabelStyle,
  error,
  inputStyle,
  ...props
}) => {
  const [labelPosition] = useState(new Animated.Value(0))
  const [isActive, setIsActive] = useState(false)

  const onFocusInput = () => {
    setIsActive(true)
    animateFocus()

    props.onFocusInput ? props.onFocusInput() : null
  }

  const onBlurInput = () => {
    setIsActive(false)
    props.onBlurInput?.()
    if (value === '') {
      animateBlur()
    }
  }

  useEffect(() => {
    if (
      value !== '' &&
      (value !== undefined || props.placeholder !== undefined)
    ) {
      animateFocus()
    }
  }, [value, props.placeholder])

  const animateFocus = () => {
    Animated.timing(labelPosition, {
      toValue: normalize(-10),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const animateBlur = () => {
    Animated.timing(labelPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  let labelStyle = {
    transform: [
      {
        translateY: labelPosition,
      },
    ],
  }

  const activeBorderColor = isActive ? Colors.contentOcean : Colors.neutralGray
  const activeTextColor = isActive
    ? Colors.contentOcean
    : Colors.contentPlaceholder

  const labelTextStyle = {
    fontSize: !isActive && value === '' ? normalize(16) : normalize(12),
    ...customLabelStyle,
  }

  const paddingLeftCustom = {
    paddingLeft: normalize(
      16 + (props.paddingLeftLabel ? props.paddingLeftLabel : 0)
    ),
  }

  /** VALIDATION HANDLER **/

  /** VALIDATION HANDLER **/

  return (
    <View style={style}>
      <View
        style={[
          {
            paddingVertical: normalize(4),
            paddingHorizontal: normalize(16),
            borderColor: error ? Colors.red : activeBorderColor,
            borderWidth: 1,
            borderRadius: 4,
            height: normalize(50),
          },
          wrapperStyle,
        ]}>
        <Animated.Text style={[styles.label, paddingLeftCustom, labelStyle]}>
          <AppText
            textStyle="body1"
            color={activeTextColor}
            customStyle={labelTextStyle}>
            {label}
          </AppText>
        </Animated.Text>
        {debounce ? (
          <DebounceInput
            minLength={0}
            delayTimeout={500}
            autoCapitalize="none"
            {...props}
            value={value}
            style={styles.floatingInput}
            underlineColorAndroid="transparent"
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onEndEditing={onBlurInput}
            blurOnSubmit
            selectTextOnFocus={false}
            clearTextOnFocus={false}
          />
        ) : (
          <TextInput
            minLength={0}
            value={value}
            style={[styles.floatingInput, inputStyle]}
            underlineColorAndroid="transparent"
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onEndEditing={onBlurInput}
            blurOnSubmit
            selectTextOnFocus={false}
            clearTextOnFocus={false}
            placeholderTextColor="#A8AAB7"
            {...props}
          />
        )}
      </View>
    </View>
  )
}

// define your styles
const styles = StyleSheet.create({
  floatingInput: {
    backgroundColor: Colors.neutralWhite,
    height: normalize(54),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    paddingVertical: normalize(4),
  },

  label: {
    position: 'absolute',
    paddingTop: normalize(12),
    //paddingLeft: normalize(16),
  },

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
})

//make this component available to the app
export default FloatingAppInput
