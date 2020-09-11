import React, {useRef, createRef, useState, useEffect, useContext} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import {AppText, AppButton, PaddingView, BottomSheetHeader} from '@/components';
import {
  OnboardingIllustration4,
  OnboardingIllustration3,
} from '@/assets/images';
import SignUp from '@/screens/Authentication/SignUp/SignUp';
import Login from '@/screens/Authentication/Login/login';

import {Colors} from '@/globals';
import {Context} from '@/context';
import {ScrollView} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

export const GuestPost = () => {
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
        <ScrollView>
          <PaddingView paddingSize={3}>
            <OnboardingIllustration3 width={width} height={width * 0.8} />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppText
                textStyle="display5"
                customStyle={styles.textStyle}
                color={Colors.primaryMidnightBlue}>
                Post your goods, offer your services, and find what you’re
                looking for.
              </AppText>
              <AppText textStyle="caption" customStyle={styles.textStyle}>
                Joining Servbees only takes minutes!{' '}
              </AppText>
              <AppButton
                text="Join Now"
                type="primary"
                size="sm"
                customStyle={{marginTop: 18}}
                onPress={() => {
                  clickHandler();
                  setAuthType('signup');
                }}
              />
            </View>
          </PaddingView>
        </ScrollView>
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
