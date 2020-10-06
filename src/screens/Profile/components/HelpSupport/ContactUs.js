//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  ProfileInfo,
  AppButton,
} from '@/components';

import {ContactUsImg} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {UserContext} from '@/context/UserContext';
import AdminFunctionService from '@/services/Admin/AdminFunctions';

// create a component
const ContactUs = ({toggleContactUs}) => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{padding: normalize(16)}}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Invite Friends"
            close={toggleContactUs}
          />
        </View>
        <View
          style={{
            padding: normalize(24),
          }}>
          <View style={styles.imageWrapper}>
            <ContactUsImg width={normalize(214)} height={normalize(214)} />
          </View>
          <View style={styles.copyWrapper}></View>
          <AppButton
            text="Submit"
            type="primary"
            size="l"
            height="xl"
            onPress={() => {}}
          />
        </View>
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
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
});

//make this component available to the app
export default ContactUs;
