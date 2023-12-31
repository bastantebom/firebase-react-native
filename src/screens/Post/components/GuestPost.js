import React, {
  useRef,
  createRef,
  useState,
  useEffect,
  useContext,
} from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'

import { AppText, BottomSheetHeader } from '@/components'
import {
  OnboardingIllustration4,
  OnboardingIllustration3,
} from '@/assets/images'
import SignUp from '@/screens/Authentication/SignUp/SignUp'
import Login from '@/screens/Authentication/Login/login'

import { Colors, normalize } from '@/globals'
import { Context } from '@/context'
import { ScrollView } from 'react-native-gesture-handler'

const { height, width } = Dimensions.get('window')

export const GuestPost = () => {
  const {
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

  return (
    <>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <ScrollView
          contentContainerStyle={styles.contentWrapper}
          showsVerticalScrollIndicator={false}>
          <OnboardingIllustration3 />
          <AppText
            textStyle="display5"
            customStyle={styles.textStyle}
            color={Colors.primaryMidnightBlue}>
            Offer services, sell goods, {'\n'} find what you need
          </AppText>
          <AppText
            textStyle="body2"
            customStyle={{
              textAlign: 'center',
              paddingHorizontal: normalize(10),
            }}>
            Post your offers, side gigs, and more! Find what you need in your
            community.
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
              setAuthType('signup')
              openSlider()
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
  textStyle: {
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(8),
    paddingHorizontal: normalize(15),
  },
  contentWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
})
