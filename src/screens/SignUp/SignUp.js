//import liraries
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
//App Specific Component
import AppColor from '@/globals/Colors';
import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
//SVG Import
import Close from '@/assets/images/icons/close.svg';

// create a component
const SignUp = (props) => {
  return (
    <View style={styles.mainWrapper}>
      <View style={styles.contentWrapper}>
        <View style={styles.closeIconWrapper} onPress={props.closePanel}>
          <Close width={14} height={14} />
        </View>
        <AppText textStyle="display5">Sign Up</AppText>
        <AppText textStyle="caption" customStyle={styles.textCaption}>
          Join Servbees today. It’s free!
        </AppText>
        <View style={styles.formWrapper}>
          <AppInput
            label="Email or Mobile Number"
            customStyle={styles.customInputStyle}
          />
          <AppInput label="Full Name" customStyle={styles.customInputStyle} />
          <AppInput
            label="Password"
            secureTextEntry
            password
            customStyle={styles.customInputStyle}
          />
        </View>

        <View>
          <AppButton
            text="Sign up"
            type="primary"
            height="xl"
            customStyle={styles.customButtonStyle}
            onPress={signUpEmail}
            loading={props.loading}
          />
        </View>
        <View style={styles.orCopyWrapper}>
          <AppText>or</AppText>
        </View>
        <View style={styles.otherLoginWrapper}>
          <AppButton
            text="Log in with Facebook"
            type="primary"
            height="md"
            icon="fb"
            customStyle={styles.customButtonStyle}
            //onPress={}
          />
          <AppButton
            text="Sign up with Google"
            type="primary"
            height="md"
            icon="g"
            customStyle={styles.customButtonStyle}
            //onPress={}
          />
        </View>

        <View style={styles.loginLinkCopy}>
          <AppText textStyle="button2">Already have an account?</AppText>
          <TouchableOpacity onPress={props.loginClick}>
            <AppText textStyle="button2" customStyle={styles.underLineText}>
              Login
            </AppText>
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
    flexDirection: 'column',
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: AppColor.neutralsWhite,
  },

  closeIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'red',
    paddingBottom: 16,
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
