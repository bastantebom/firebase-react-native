import React, { useEffect, useRef, useState } from 'react'
import { Colors, normalize } from '@/globals'
import { View } from 'native-base'
import { Animated, StyleSheet, Text, TextInput } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import typography from '@/globals/typography'

/**
 *
 * @param {object} props
 * @param {function} props.onFocus
 * @param {function} props.onBlur
 * @param {string} props.label
 * @param {string} props.value
 * @param {string} props.message
 * @param {boolean} props.isCurrency
 * @param {boolean} props.displayLength
 * @param {boolean} props.autofocus
 * @param {boolean} props.filled
 * @param {() => React.Component} props.rightIcon
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.inputStyle
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} props.labelStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.messageStyle
 */
const TextField = ({
  onFocus,
  onBlur,
  label,
  value,
  inputStyle,
  labelStyle,
  containerStyle,
  isCurrency,
  displayLength,
  autofocus,
  filled,
  rightIcon,
  children,
  message,
  messageStyle,
  ...props
}) => {
  const labelPosition = useRef(
    new Animated.Value(
      props.multiline &&
      props.numberOfLines &&
      (value.length || props.placeholder?.length)
        ? 8
        : 11
    )
  ).current
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleFocus = () => {
    const toValue = normalize(props.multiline && props.numberOfLines ? 8 : 0)

    if (!value.length && !props.placeholder?.length) {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      labelPosition.setValue(toValue)
    }
    setIsFocused(true)
  }

  const handleBlur = () => {
    const toValue = normalize(
      props.multiline &&
        props.numberOfLines &&
        (value.length || props.placeholder?.length)
        ? 8
        : 11
    )
    if (!value.length && !props.placeholder?.length) {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      labelPosition.setValue(toValue)
    }
    setIsFocused(false)
  }

  if (!containerStyle) containerStyle = {}
  if (!inputStyle) inputStyle = {}
  if (!labelStyle) labelStyle = {}
  if (props.multiline && props.numberOfLines) {
    containerStyle = { ...containerStyle, height: 'auto' }
    inputStyle = {
      ...inputStyle,
      height: normalize(24 * (props.numberOfLines + (label?.length ? 1 : 0))),
      marginTop: normalize(10),
    }
    if (!label?.length) inputStyle.paddingTop = 0
    labelStyle = {
      ...labelStyle,
      marginTop: normalize(
        value.length && !props.placeholder?.length
          ? 0
          : !props.placeholder?.length && !value.length
          ? 0
          : 8
      ),
    }
    props.textAlignVertical = 'top'
  }

  if (!label?.length) {
    inputStyle = {
      ...inputStyle,
      paddingTop: 0,
    }
  }

  const defaultLabelStyle = {
    transform: [
      {
        translateY:
          props.placeholder?.length ||
          (!isFocused &&
            (!!value?.length || typeof value === 'number') &&
            !props.multiline &&
            !props.numberOfLines)
            ? 0
            : labelPosition,
      },
    ],
    fontSize: normalize(
      isFocused ||
        props.placeholder?.length ||
        value?.length ||
        typeof value === 'number'
        ? 14
        : 16
    ),
    color: isFocused ? Colors.contentOcean : Colors.contentPlaceholder,
  }
  const defaultInputStyle = !label?.length
    ? { marginTop: 0, height: '100%' }
    : {}

  const defaultContainerStyle = {
    borderColor: isFocused
      ? Colors.contentOcean
      : value?.length || typeof value === 'number' || filled
      ? Colors.contentEbony
      : Colors.neutralGray,
    ...(!label?.length ? { justifyContent: 'center' } : {}),
  }

  useEffect(() => {
    setTimeout(() => {
      if (autofocus) inputRef.current.focus()
    }, 128)
  }, [])

  return (
    <View style={[styles.wrapper, defaultContainerStyle, containerStyle]}>
      <Animated.Text
        style={[styles.label, defaultLabelStyle, labelStyle]}
        {...(!props.disabled
          ? { onPress: () => inputRef?.current?.focus?.() }
          : {})}>
        {label}
      </Animated.Text>

      {isCurrency ? (
        <CurrencyInput
          style={[styles.input, defaultInputStyle, inputStyle]}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          delimiter=","
          separator="."
          precision={2}
          {...props}
        />
      ) : (
        <TextInput
          ref={inputRef}
          style={[styles.input, defaultInputStyle, inputStyle]}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          placeholderTextColor={Colors.contentPlaceholder}
          {...props}
        />
      )}
      {children}

      {!!message?.length && (
        <View style={styles.messageWrapper}>
          <Text style={[typography.caption, messageStyle]}>{message}</Text>
        </View>
      )}

      {displayLength && !!props.maxLength && (
        <View style={styles.lengthWrapper}>
          <Text style={[typography.eyebrow, styles.length]}>
            {value?.length || 0}/{props.maxLength || 0}
          </Text>
        </View>
      )}

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon()}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: normalize(4),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    height: '100%',
    letterSpacing: normalize(0.5),
    lineHeight: normalize(24),
    paddingBottom: 0,
    paddingHorizontal: normalize(16),
    paddingTop: normalize(20),
    zIndex: 2,
  },
  label: {
    flex: 1,
    fontFamily: 'RoundedMplus1c-Regular',
    letterSpacing: normalize(0.25),
    lineHeight: normalize(21),
    marginTop: normalize(4),
    paddingHorizontal: normalize(16),
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  lengthWrapper: {
    bottom: normalize(-18),
    position: 'absolute',
    right: 0,
  },
  length: {
    color: Colors.icon,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
    right: normalize(15),
    top: normalize(15),
    zIndex: 200,
  },
  wrapper: {
    borderRadius: normalize(4),
    borderWidth: 1,
    height: normalize(54),
  },
  messageWrapper: {
    bottom: normalize(-24),
    position: 'absolute',
    left: 0,
  },
})

export default TextField
