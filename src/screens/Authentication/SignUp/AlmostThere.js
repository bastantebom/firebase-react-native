//import liraries
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AppColor from '@/globals/Colors';

import {AppViewContainer, AppButton, AppText} from '@/components';

import {Close} from '@/assets/images/icons';
import LocationImage from '@/assets/images/location.svg';

// create a component
const AlmostThere = () => {
  return (
    <AppViewContainer paddingSize={3} customStyle={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity>
          <AppText textStyle="body1" customStyle={styles.skipLink}>
            Skip
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.resetPasswordContainer}>
        <LocationImage width={80} height={80} />
      </View>

      <AppText customStyle={styles.resetPasswordText} textStyle="display5">
        Almost there!
      </AppText>

      <AppText textStyle="body2">
        Let us know your current location so we can show you services and goods
        nearby. You may change this later on.
      </AppText>
    </AppViewContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    alignItems: 'flex-end',
  },
  skipLink: {
    color: AppColor.contentOcean,
  },
});

//make this component available to the app
export default AlmostThere;
