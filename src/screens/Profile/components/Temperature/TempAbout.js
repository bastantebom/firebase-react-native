//import liraries
import React, {useState, useContext} from 'react';
import {View, StyleSheet, SafeAreaView, TextInput} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
  Dimensions,
} from '@/components';

import {BodyTemp} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';

// create a component
const TempAbout = ({toggleTempAbout}) => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3} style={{flex: 1}}>
          <BodyTemp />
          <View>
            <AppText textStyle="body1" customStyle={{marginBottom: 4}}>
              Monitor your body temperature
            </AppText>
            <AppText
              textStyle="captionConstant"
              customStyle={{marginBottom: 24}}>
              This is the text explaining why we are asking for their body
              temperature. How this will be used in contact tracing if needed.
              How this will protect them or their customers to be safe. And how
              this will benefit the whole Servbees community and the Philippines
              char.
            </AppText>
            <AppText
              textStyle="captionConstant"
              customStyle={{marginBottom: 24}}>
              More text explaining why we are asking for their body temperature.
              How this will be used in contact tracing if needed. How this will
              protect them or their customers to be safe. And how this will
              benefit the whole Servbees community and the Philippines char.
            </AppText>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <AppButton
              text="Okay, got it"
              type="primary"
              size="l"
              height="xl"
              onPress={toggleTempAbout}
              customStyle={{marginTop: normalize(20)}}
            />
          </View>
        </PaddingView>
      </SafeAreaView>
    </>
  );
};

// define your styles
// define your styles
const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
  input: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

//make this component available to the app
export default TempAbout;
