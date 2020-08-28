import React, {useRef, createRef, useState, useEffect, useContext} from 'react';
import {View, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import {AppText, AppButton, PaddingView} from '@/components';
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

let bottomSheetRef = createRef();

export const GuestProfile = () => {
  const {
    sliderState,
    closeSlider,
    openSlider,
    authType,
    setAuthType,
  } = useContext(Context);
  useEffect(() => {
    if (authType === '') {
      return bottomSheetRef?.current.snapTo(1);
    }

    bottomSheetRef?.current.snapTo(1);

    setTimeout(() => {
      bottomSheetRef?.current.snapTo(0);
    }, 1200);
  }, [authType, setAuthType]);

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#EAEAEA',
            width: 40,
            height: 5,
            marginVertical: 8,
          }}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (authType === 'signup') {
      return (
        <View
          style={{
            backgroundColor: 'white',
            height: '100%',
            position: 'relative',
            zIndex: 9999,
          }}>
          <SignUp />
        </View>
      );
    }
    if (authType === 'login') {
      return (
        <View style={{backgroundColor: 'white', height: '100%'}}>
          <Login />
        </View>
      );
    }
  };

  if (sliderState === 'close') {
    bottomSheetRef?.current.snapTo(1);
  }

  const clickHandler = () => {
    openSlider();
    // _panel.current.show();
    bottomSheetRef?.current.snapTo(0);
  };

  const closeHandler = () => {
    openSlider();
    // _panel.current.hide();
    bottomSheetRef?.current.snapTo(1);
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
              Some text here encouraging them to be part of the Servbees
              community
            </AppText>
            <AppText textStyle="caption" customStyle={styles.textStyle}>
              Additional benefits of joining Servbees here{' '}
            </AppText>
            <AppButton
              text="Join Now"
              type="primary"
              size="sm"
              customStyle={{marginTop: 18}}
              onPress={() => {
                clickHandler();
                setAuthType('signup');
                bottomSheetRef.current.snapTo(0);
                // console.log('hasjjhjh');
              }}
            />
          </View>
        </PaddingView>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['85%', '0%']}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
