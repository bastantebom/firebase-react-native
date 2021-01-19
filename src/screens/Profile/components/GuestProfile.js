import React, {
  useRef,
  createRef,
  useState,
  useEffect,
  useContext,
} from 'react'
import Modal from 'react-native-modal'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import {
  AppText,
  AppButton,
  PaddingView,
  BottomSheetHeader,
} from '@/components'
import {
  OnboardingIllustration4,
  OnboardingIllustration3,
} from '@/assets/images'
import SignUp from '@/screens/Authentication/SignUp/SignUp'
import Login from '@/screens/Authentication/Login/login'
import BottomSheet from 'reanimated-bottom-sheet'

import { Colors, normalize } from '@/globals'
import { Context } from '@/context'
import { ScrollView } from 'react-native-gesture-handler'

const { height, width } = Dimensions.get('window')

export const GuestProfile = () => {
  const {
    sliderState,
    closeSlider,
    openSlider,
    authType,
    setAuthType,
    authenticationSheet,
    showAuthenticationSheet,
  } = useContext(Context)

  const RenderContent = () => {
    if (authType === 'signup') {
      return <SignUp />
    }
    if (authType === 'login') {
      return <Login />
    }
  }

  const clickHandler = () => {
    openSlider()
  }

  const closeHandler = () => {
    openSlider()
  }
  return (
    <>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <OnboardingIllustration4 />
          <AppText
            textStyle="display5"
            customStyle={styles.textStyle}
            color={Colors.primaryMidnightBlue}>
            Join the bustling Servbees community
          </AppText>
          <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
            Be a Buzzybee and connect, hustle, and earn—all on your own terms.
          </AppText>
          <TouchableOpacity
            style={{
              marginTop: normalize(24),
              paddingVertical: 12,
              width: '100%',
              alignItems: 'center',
              backgroundColor: Colors.primaryYellow,
              borderRadius: 3,
              maxWidth: normalize(250),
            }}
            onPress={() => {
              clickHandler()
              setAuthType('signup')
            }}>
            <AppText textStyle="body1medium">Join Now</AppText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <Modal
        isVisible={authenticationSheet}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showAuthenticationSheet(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: '82%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <BottomSheetHeader />
          <RenderContent />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  textStyle: {
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(8),
    paddingHorizontal: normalize(15),
  },
})
