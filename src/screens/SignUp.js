//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppColor from '../globals/Colors';
import AppText from '../components/AppText/AppText';
import AppInput from '../components/AppInput/AppInput';
import AppButton from '../components/AppButton';

// create a component
const SignUp = (props) => {
  const textCaption = {
    color: AppColor.contentPlaceholder,
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.contentWrapper}>
        <AppText textStyle="display5">Sign Up</AppText>
        <AppText textStyle="caption" customStyle={textCaption}>
          Join Servbees today. It’s free!
        </AppText>
        <View style={styles.formWrapper}>
          <AppInput
            label="Email or Mobile Number"
            propsInputCustomStyle={styles.customInputStyle}
          />
          <AppInput
            label="Full Name"
            propsInputCustomStyle={styles.customInputStyle}
          />
          <AppInput
            label="Password"
            secureTextEntry
            password
            propsInputCustomStyle={styles.customInputStyle}
          />

          <AppButton
            text="Next"
            type="primary"
            size="lg"
            height="xl"
            propsButtonCustomStyle={styles.customButtonStyle}
            //onPress={}
          />
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 20,
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: AppColor.neutralsWhite,
  },

  formWrapper: {
    justifyContent: 'space-around',
    marginTop: 32,
    marginBottom: 32,
  },

  customInputStyle: {
    marginBottom: 16,
  },

  customButtonStyle: {
    backgroundColor: AppColor.buttonDisable,
    borderWidth: 1.5,
    borderColor: AppColor.buttonDisable,
    alignSelf: 'stretch',
  },
});

//make this component available to the app
export default SignUp;
