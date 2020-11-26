import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native'

import { AppText, BottomSheetHeader, ScreenHeaderTitle } from '@/components'
import { normalize, Colors } from '@/globals'

const OrderNotesModal = ({ close, setNotes, notes }) => {
  const [description, setDescription] = useState(notes)

  const submitHandler = () => {
    setNotes(description)
    close()
  }

  const [animatedPadding] = useState(new Animated.Value(0))

  const onKeyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight)
  }

  const onKeyboardDidHide = () => {
    keyboardToggleAnimation(0)
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
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      }}>
      <BottomSheetHeader />
      <Animated.View style={[{ padding: 16 }, paddingAnimatedStyle]}>
        <ScreenHeaderTitle close={close} iconSize={normalize(16)} />
        <View style={{ marginTop: 24 }}>
          <View style={{ alignItems: 'center' }}>
            <AppText textStyle="display6" customStyle={{ textAlign: 'center' }}>
              Got other details to highlight?
            </AppText>
            <AppText
              textStyle="subtitle2"
              customStyle={{ textAlign: 'center' }}>
              Include your promos, discounts, and other information you want to
              highlight.
            </AppText>
          </View>

          <TextInput
            autoFocus={true}
            value={description}
            multiline={true}
            placeholder="Additional Notes"
            placeholderTextColor={Colors.neutralGray}
            numberOfLines={Platform.OS === 'ios' ? null : 6}
            minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
            style={{
              color: Colors.contentEbony,
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(16),
              letterSpacing: 0.5,
              borderColor: Colors.neutralGray,
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginVertical: 16,
              textAlign: 'left',
            }}
            onChangeText={text => setDescription(text)}
            underlineColorAndroid={'transparent'}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={submitHandler}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 8,
            marginTop: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            borderRadius: 4,
          }}>
          <AppText textStyle="body3">Save</AppText>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

export default OrderNotesModal
