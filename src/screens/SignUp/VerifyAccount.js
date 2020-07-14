//import liraries
import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import AppColor from '@/globals/Colors';
import {useNavigation} from '@react-navigation/native';
import AppButton from '@/components/AppButton';

import VerifyIcon from '@/assets/images/verify.svg';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
import AppText from '@/components/AppText/AppText';
import {TouchableOpacity} from 'react-native-gesture-handler';

// create a component
const VerifyAccount = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppViewContainer marginSize={2} customStyle={styles.defaultStyle}>
        <VerifyIcon />
      </AppViewContainer>
      <AppViewContainer customStyle={styles.defaultStyle}>
        <AppText textStyle="display5">Enter Your Verification</AppText>
      </AppViewContainer>
      <AppViewContainer customStyle={styles.defaultStyle}>
        <AppText textStyle="body2" customStyle={styles.bodyContent}>
          An email with the 4-digit code has been sent to{' '}
          <AppText textStyle="subtitle1" customStyle={styles.bodyContent}>
            demo@demo.com
          </AppText>
        </AppText>
      </AppViewContainer>
      <AppViewContainer customStyle={styles.timerWrapper}>
        <AppText textStyle="body2" customStyle={styles.timerText}>
          9:50
        </AppText>
      </AppViewContainer>
      <AppViewContainer customStyle={styles.verificationWrapper}>
        <TextInput style={styles.inputVerification} value="0" />
        <TextInput style={styles.inputVerification} value="0" />
        <TextInput style={styles.inputVerification} value="0" />
        <TextInput style={styles.inputVerification} value="0" />
      </AppViewContainer>
      <TouchableOpacity onPress={() => navigation.push('Onboarding')}>
        <AppText>Go Back</AppText>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection: 'column',
    //alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
  },
  bodyContent: {
    textAlign: 'center',
  },

  spacing: {
    paddingLeft: 32,
    paddingRight: 32,
  },

  timerWrapper: {
    flexDirection: 'row',
    //alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  timerText: {
    textAlign: 'right',
  },

  verificationWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  inputVerification: {
    borderColor: AppColor.neutralGray,
    borderWidth: 1,
    fontSize: 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 16,
  },

  defaultStyle: {
    alignItems: 'center',
  },
});

//make this component available to the app
export default VerifyAccount;
