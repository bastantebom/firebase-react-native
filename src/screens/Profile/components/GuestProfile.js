import React, {useRef, createRef, useState, useEffect, useContext} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {AppText, AppButton, PaddingView, BottomSheetHeader} from '@/components';
import {
  OnboardingIllustration4,
  OnboardingIllustration3,
} from '@/assets/images';
import SignUp from '@/screens/Authentication/SignUp/SignUp';
import Login from '@/screens/Authentication/Login/login';
import BottomSheet from 'reanimated-bottom-sheet';

import {Colors} from '@/globals';
import {Context} from '@/context';
import {ScrollView} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

export const GuestProfile = () => {
  const {
    sliderState,
    closeSlider,
    openSlider,
    authType,
    setAuthType,
    authenticationSheet,
    showAuthenticationSheet,
  } = useContext(Context);

  const RenderContent = () => {
    if (authType === 'signup') {
      return <SignUp />;
    }
    if (authType === 'login') {
      return <Login />;
    }
  };

  const clickHandler = () => {
    openSlider();
  };

  const closeHandler = () => {
    openSlider();
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <OnboardingIllustration4 width={width} height={width * 0.8} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AppText
              textStyle="display5"
              customStyle={styles.textStyle}
              color={Colors.primaryMidnightBlue}>
              Bee part of the Servbees community today!
            </AppText>
            <AppText textStyle="caption" customStyle={styles.textStyle}>
              Connect, post, and sell with other Buzzybees instantly.{' '}
            </AppText>
            <AppButton
              text="Join Now"
              type="primary"
              size="sm"
              customStyle={{marginTop: 18}}
              onPress={() => {
                clickHandler();
                setAuthType('signup');
                // bottomSheetRef.current.snapTo(0);
                // console.log('hasjjhjh');
              }}
            />
          </View>
        </PaddingView>
      </SafeAreaView>
      <Modal
        isVisible={authenticationSheet}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{margin: 0, justifyContent: 'flex-end'}}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showAuthenticationSheet(false)}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
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
  );
};

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
