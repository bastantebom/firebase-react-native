//import liraries
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import AppColor from '../globals/Colors';
import AppText from '../components/AppText/AppText';
import AppInput from '../components/AppInput/AppInput';
import AppButton from '../components/AppButton';

// create a component
const SignUp = (props) => {
  return (
    <View style={styles.mainWrapper}>
      <View style={styles.contentWrapper}>
        <AppText textStyle="display5">Sign Up</AppText>
        <AppText textStyle="caption" customStyle={styles.textCaption}>
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
            propsInputCustomStyle={''}
          />
        </View>

        <View style={styles.forgotPasswordLink}>
          <TouchableOpacity
            onPress={() => {
              alert('Forgot Password Press');
            }}>
            <AppText customStyle={styles.textCaption}>Forgot Password?</AppText>
          </TouchableOpacity>
        </View>

        <View>
          <AppButton
            text="Sign up"
            type="primary"
            size="lg"
            height="xl"
            propsButtonCustomStyle={styles.customButtonStyle}
            //onPress={}
          />
        </View>
        <View style={styles.orCopyWrapper}>
          <AppText>or</AppText>
        </View>
        <View style={styles.otherLoginWrapper}>
          <AppButton
            text="Log in with Facebook"
            type="primary"
            size="lg"
            height="s"
            propsButtonCustomStyle={styles.customButtonStyle}
            //onPress={}
          />
          <AppButton
            text="Sign up with Google"
            type="primary"
            size="lg"
            height="s"
            propsButtonCustomStyle={styles.customButtonStyle}
            //onPress={}
          />
        </View>

        <View style={styles.loginLinkCopy}>
          <AppText>Already have an account?</AppText>
          <TouchableOpacity
            onPress={() => {
              alert('Link Press');
            }}>
            <AppText customStyle={styles.underLineText}>Login</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 24,
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: AppColor.neutralsWhite,
  },

  formWrapper: {
    justifyContent: 'space-around',
    marginTop: 32,
  },

  textCaption: {
    color: AppColor.contentPlaceholder,
  },

  customInputStyle: {
    marginBottom: 16,
    //borderColor: AppColor.neutralGray,
  },

  forgotPasswordLink: {
    marginTop: 4,
    marginBottom: 24,
  },

  customButtonStyle: {
    backgroundColor: AppColor.buttonDisable,
    borderWidth: 1.5,
    borderColor: AppColor.buttonDisable,
    alignSelf: 'stretch',
    marginBottom: 16,
  },

  orCopyWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },

  underLineText: {
    color: AppColor.contentOcean,
    paddingLeft: 4,
  },

  loginLinkCopy: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
});

//make this component available to the app
export default SignUp;
