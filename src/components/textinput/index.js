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
 * @param {boolean} props.error
 * @param {string} props.errorMessage
 * @param {() => React.Component} props.rightIcon
 * @param {() => React.Component} props.leftIcon
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.inputStyle
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} props.labelStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.messageStyle
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} props.errorMessageStyle
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
  error,
  errorMessage,
  rightIcon,
  leftIcon,
  children,
  message,
  messageStyle,
  errorMessageStyle,
  autoHeight,
  minLines = 4,
  maxLines = 6,
  ...props
}) => {
  const labelPosition = useRef(
    new Animated.Value(
      normalize(
        props.multiline &&
          props.numberOfLines &&
          (value?.length || props.placeholder?.length)
          ? 8
          : 12
      )
    )
  ).current
  const [isFocused, setIsFocused] = useState(false)
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState(0)
  const inputRef = useRef(null)

  const handleFocus = () => {
    const toValue = normalize(props.multiline && props.numberOfLines ? 8 : 0)

    if (!value?.length && !props.placeholder?.length) {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start()
    }
    setIsFocused(true)
  }

  const handleBlur = () => {
    onBlur?.()
    const toValue = normalize(
      props.multiline &&
        props.numberOfLines &&
        (value?.length || props.placeholder?.length)
        ? 8
        : 12
    )
    if (!value?.length && !props.placeholder?.length) {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    }
    setIsFocused(false)
  }

  const handleOnContentSizeChange = event => {
    setCurrentNumberOfLines(~~(event.nativeEvent.contentSize.height / 24 - 1))
  }

  if (!containerStyle) containerStyle = {}
  if (!inputStyle) inputStyle = {}
  if (!labelStyle) labelStyle = {}
  if (props.multiline && (props.numberOfLines || autoHeight)) {
    containerStyle = { ...containerStyle, height: 'auto' }
    inputStyle = {
      ...inputStyle,
      height: normalize(
        24 *
          ((autoHeight
            ? currentNumberOfLines < minLines
              ? minLines
              : currentNumberOfLines > maxLines
              ? maxLines
              : currentNumberOfLines
            : props.numberOfLines) +
            (label?.length ? 1 : 0))
      ),
      marginTop: normalize(10),
    }
    if (!label?.length) inputStyle.paddingTop = 0
    labelStyle = {
      ...labelStyle,
      marginTop: normalize(
        value?.length && !props.placeholder?.length
          ? 0
          : !props.placeholder?.length && !value?.length
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
    color: error
      ? Colors.secondaryBrinkPink
      : isFocused
      ? Colors.contentOcean
      : Colors.contentPlaceholder,
  }

  const defaultInputStyle = !label?.length
    ? { marginTop: 0, height: '100%' }
    : {}

  if (leftIcon?.()) {
    defaultInputStyle.paddingLeft = normalize(48)
  }
  if (rightIcon?.()) {
    defaultInputStyle.paddingRight = normalize(40)
  }

  const defaultContainerStyle = {
    borderColor: props.disabled
      ? Colors.neutralGray
      : error
      ? Colors.secondaryBrinkPink
      : isFocused
      ? Colors.contentOcean
      : value?.length || typeof value === 'number' || filled
      ? Colors.contentEbony
      : Colors.neutralGray,
    ...(!label?.length ? { justifyContent: 'center' } : {}),
  }

  if (props.disabled) {
    defaultContainerStyle.backgroundColor = Colors.buttonDisable
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

      {leftIcon ? <View style={styles.leftIcon}>{leftIcon()}</View> : null}

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
          placeholderTextColor="#A8AAB7"
          onContentSizeChange={handleOnContentSizeChange}
          {...props}
        />
      )}
      {children}

      {!!message?.length && (
        <View style={styles.messageWrapper}>
          <Text style={[typography.caption, messageStyle]}>{message}</Text>
        </View>
      )}

      {!!errorMessage?.length && (
        <View style={styles.errorMessageWrapper}>
          <Text
            style={[
              typography.caption,
              styles.errorMessage,
              errorMessageStyle,
            ]}>
            {errorMessage}
          </Text>
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
    right: normalize(15),
    top: normalize(15),
    zIndex: 200,
  },
  leftIcon: {
    position: 'absolute',
    left: normalize(15),
    top: normalize(15),
    zIndex: 200,
  },
  wrapper: {
    borderRadius: normalize(4),
    borderWidth: 1,
    height: normalize(54),
  },
  messageWrapper: {
    bottom: normalize(-20),
    position: 'absolute',
    left: 0,
  },
  errorMessageWrapper: {
    bottom: normalize(-20),
    position: 'absolute',
    left: 0,
  },
  errorMessage: {
    color: Colors.secondaryBrinkPink,
  },
})

export default TextField
