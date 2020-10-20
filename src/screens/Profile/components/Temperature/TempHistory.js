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

import {ContactUsImg} from '@/assets/images';
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';

// create a component
const TempHistory = ({toggleHistory}) => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Body Temperature History"
            close={toggleHistory}
          />
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
export default TempHistory;
