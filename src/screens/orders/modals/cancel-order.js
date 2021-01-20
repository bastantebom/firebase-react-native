import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Text,
  Keyboard,
  Animated,
} from 'react-native'
import { AppText, AppButton } from '@/components'
import { normalize, Colors } from '@/globals'

const CancelOrderModal = ({ onCancelPress, onBackPress, cancelText }) => {
  const [notes, setNotes] = useState('')

  const [animatedPadding] = useState(new Animated.Value(24))

  const onKeyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight + 16)
  }

  const onKeyboardDidHide = () => {
    keyboardToggleAnimation(24)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
    }
  }, [])

  const keyboardToggleAnimation = height => {
    if (Platform.OS === 'ios')
      Animated.timing(animatedPadding, {
        toValue: height,
        duration: 500,
        useNativeDriver: false,
      }).start()
  }

  let paddingAnimatedStyle = {
    paddingBottom: animatedPadding,
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[{ padding: normalize(24) }, paddingAnimatedStyle]}>
        <View style={[styles.center, styles.titleWrapper]}>
          <Text style={styles.title}>{cancelText}</Text>
          <Text style={styles.description}>
            Feel free to share your reason for cancellation so we can improve
            your Servbees experience.
          </Text>
        </View>
        <View>
          <TextInput
            value={notes}
            style={styles.input}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 5}
            minHeight={Platform.OS === 'ios' && 8 ? 20 * 5 : null}
            onChangeText={setNotes}
            underlineColorAndroid={'transparent'}
            textAlignVertical="top"
            placeholder="Add notes (optional)"
          />
        </View>
        <AppButton
          text="Cancel"
          type="primary"
          onPress={() => onCancelPress({ notes })}
        />
        <AppButton text="Go Back" onPress={onBackPress} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  container: {
    backgroundColor: 'white',
  },
  input: {
    position: 'relative',
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.contentEbony,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  titleWrapper: {
    marginBottom: 32,
    marginTop: 15,
  },
  title: {
    color: Colors.contentEbony,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: 0.15,
    fontFamily: 'RoundedMplus1c-Medium',
  },
  description: {
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.25,
  },
})

export default CancelOrderModal
