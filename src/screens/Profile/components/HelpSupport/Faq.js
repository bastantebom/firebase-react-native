//import liraries
import React, {useState, useContext} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  ProfileInfo,
  AppButton,
} from '@/components';

import {ContactUsImg} from '@/assets/images';
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {UserContext} from '@/context/UserContext';
import AdminFunctionService from '@/services/Admin/AdminFunctions';

// create a component
const Faq = ({toggleFaq}) => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Frequently Asked Question"
            close={toggleFaq}
          />
        </PaddingView>
        <View style={{flex: 1}}>
          <View style={[styles.contentWrapper]}>
            <PaddingView paddingSize={3}></PaddingView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
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
// define your styles

//make this component available to the app
export default Faq;
