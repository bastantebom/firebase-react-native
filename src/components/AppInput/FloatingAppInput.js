import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native'
import { Colors, normalize } from '@/globals'
import AppText from '../AppText/AppText'
import ValidationList from './Validation'
import ValidationFunctions from './ValidationFunctions'
import { debounce } from 'lodash'
import _ from 'lodash'

import { VerifiedGreen } from '@/assets/images/icons'

const FloatingAppInput = props => {
  const {
    value,
    placeholder,
    label,
    validation = [],
    onChangeText,
    valueHandler,
    setError,
    error,
    setButtonState,
    onInputFocus,
    onInputBlur,
    onChangeTextInput,
    setChangingValidation,
    changingValidation,
    setValidationRule,
    lowercase = false,
  } = props

  const [internalValue, setInternalValue] = useState(value)
  const [verified, setVerified] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  const [validationError, setValidationError] = useState()
  const [isActive, setIsActive] = useState(false)
  const [labelPosition] = useState(new Animated.Value(0))

  const checkIndex = arr => {
    const index = error.indexOf(arr)
    return index
  }

  const onValueChange = value => {
    valueHandler(lowercase ? value.toLowerCase() : value)
    setShowValidationError(true)
    inputDebounce(value)

    if (error.length > 0) {
      setButtonState(true)
    } else {
      setButtonState(false)
    }

    onChangeTextInput ? onChangeTextInput(value) : null
  }

  const inputDebounce = useCallback(
    debounce(value => {
      validateInput(value)
    }, 1000),
    []
  )

  const validateInput = value => {
    setInternalValue(value)
    let currentError = error
    setValidationError()
    if (validation.includes('username'))
      ValidationFunctions.usernameValidator(value)
        .then(res => {
          currentError = error
          const index = checkIndex('username')
          currentError.splice(index, 1)
          setError(currentError)
          setShowValidationError(res)
          setVerified(true)
        })
        .catch(err => {
          currentError = error
          const index = checkIndex('username')
          if (index === -1) {
            currentError.push('username')
            setError(currentError)
          }

          setShowValidationError(false)
          setVerified(false)
          setValidationError(err)
        })

    if (validation.includes('email')) {
      ValidationFunctions.emailValidator(value)
        .then(res => {
          currentError = error
          const index = checkIndex('email')
          currentError.splice(index, 1)
          setError(currentError)
          setShowValidationError(res)
        })
        .catch(err => {
          currentError = error
          const index = checkIndex('email')
          if (index === -1) {
            currentError.push('email')
            setError(currentError)
          }
          setShowValidationError(false)
          setValidationError(err)
          console.log(err)
        })
    }

    if (validation.includes('number'))
      ValidationFunctions.MobileNumberValidator(value)
        .then(res => {
          currentError = error
          const index = checkIndex('number')
          currentError.splice(index, 1)
          setError(currentError)
          setShowValidationError(res)
        })
        .catch(err => {
          currentError = error
          const index = checkIndex('number')
          if (index === -1) {
            currentError.push('number')
            setError(currentError)
          }
          setShowValidationError(false)
          setValidationError(err)
          console.log(err)
        })

    if (validation.includes('password'))
      ValidationFunctions.PasswordValidator(value)
        .then(res => {
          currentError = error
          const index = checkIndex('password')
          currentError.splice(index, 1)
          setError(currentError)
          setShowValidationError(res)
        })
        .catch(err => {
          currentError = error
          const index = checkIndex('password')
          if (index === -1) {
            currentError.push('password')
            setError(currentError)
          }
          setShowValidationError(false)
          setValidationError(err)
        })
  }

  useEffect(() => {
    if (setValidationRule)
      changingValidation
        ? setValidationRule(['email'])
        : setValidationRule(['number'])
  }, [changingValidation])

  const onFocusInput = () => {
    setIsActive(true)
    animateFocus()
    onInputFocus ? onInputFocus() : null
  }

  const onBlurInput = () => {
    setIsActive(false)
    animateBlur()
    onInputBlur ? onInputBlur() : null
  }

  useEffect(() => {
    setShowValidationError(true)
    if (value || placeholder) {
      animateFocus()
    }
  }, [value, placeholder, validation])

  const animateFocus = () => {
    Animated.timing(labelPosition, {
      toValue: normalize(-10),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const animateBlur = () => {
    if (!placeholder || !value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }

  let labelStyle = {
    transform: [
      {
        translateY: labelPosition,
      },
    ],
  }

  const activeBorderColor = props?.customStyle
    ? props?.customStyle[1]?.borderColor
    : isActive
    ? Colors.contentOcean
    : Colors.neutralGray
  const activeTextColor = isActive
    ? Colors.contentOcean
    : Colors.contentPlaceholder

  const fontSize =
    !isActive && !value && !placeholder ? normalize(16) : normalize(12)

  const paddingLeftCustom = {
    paddingLeft: normalize(
      16 + (props.paddingLeftLabel ? props.paddingLeftLabel : 0)
    ),
  }

  return (
    <View
      style={{
        ...props.customStyle,
      }}>
      <View
        style={{
          paddingVertical: normalize(4),
          paddingHorizontal: normalize(16),
          borderColor: activeBorderColor,
          borderWidth: 1,
          borderRadius: 4,
          height: normalize(50),
        }}>
        <Animated.Text style={[styles.label, paddingLeftCustom, labelStyle]}>
          <AppText
            textStyle="body1"
            color={activeTextColor}
            customStyle={{ fontSize: fontSize }}>
            {label}
          </AppText>
        </Animated.Text>
        <TextInput
          onChangeText={onValueChange}
          {...props}
          style={styles.floatingInput}
          underlineColorAndroid="transparent"
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          blurOnSubmit
          ref={props.inputRef}
        />
      </View>
      {validation.length > 0 && (
        <AppText
          customStyle={{
            marginLeft: normalize(16),
            display: showValidationError ? 'none' : 'flex',
          }}
          textStyle="metadata"
          color={'red'}>
          {validationError}
        </AppText>
      )}
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
  },

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
})

export default FloatingAppInput
