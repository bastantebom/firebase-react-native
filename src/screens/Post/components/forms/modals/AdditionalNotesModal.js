import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native'

import Slider from '@react-native-community/slider'
import Modal from 'react-native-modal'

import LocationModal from './LocationModal'
import {
  AppText,
  AppCheckbox,
  Switch,
  ScreenHeaderTitle,
  PaddingView,
} from '@/components'

import { ArrowRight } from '@/assets/images/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Colors, normalize } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import { RangeSlider } from '@/components/Slider/RangeSlider'

const AdditionalNotesModal = ({ close }) => {
  const [additionalNotes, setAdditionalNotes] = useState()

  const [animatedPadding] = useState(new Animated.Value(24))

  function onKeyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight)
  }

  function onKeyboardDidHide() {
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
      duration: 100,
      useNativeDriver: false,
    }).start()
  }

  let paddingAnimatedStyle = {
    marginBottom: animatedPadding,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 8 }}>
      <ScreenHeaderTitle
        close={close}
        title="Additional Notes"
        paddingSize={2}
      />
      <KeyboardAwareScrollView>
        <View>
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 16,
            }}>
            <AppText textStyle="body1" color={Colors.primaryMidnightBlue}>
              Got other messages to highlight?
            </AppText>
            <AppText textStyle="caption" customStyle={{ marginTop: 4 }}>
              Include your promos, discounts, and other information you want to
              highlight.
            </AppText>
            <View style={{ marginTop: 24 }}>
              <TextInput
                value={additionalNotes}
                multiline={true}
                placeholder="Additional Notes"
                placeholderTextColor={Colors.contentPlaceholder}
                numberOfLines={Platform.OS === 'ios' ? null : 6}
                minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                style={{
                  color: Colors.contentEbony,
                  fontFamily: 'RoundedMplus1c-Regular',
                  fontSize: normalize(14),
                  letterSpacing: 0.5,
                  borderColor: Colors.neutralGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginBottom: 16,
                  textAlign: 'left',
                }}
                onChangeText={text => {
                  setAdditionalNotes(text)
                }}
                underlineColorAndroid={'transparent'}
                textAlignVertical="top"
                scrollEnabled={false}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          close()
        }}
        style={[
          {
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 8,
            marginHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            borderRadius: 4,
          },
          paddingAnimatedStyle,
        ]}>
        <AppText textStyle="body3">Save</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default AdditionalNotesModal
