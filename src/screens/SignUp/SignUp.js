//import liraries
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
//App Specific Component
import AppColor from '@/globals/Colors';
import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
//import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
//SVG Import
import Close from '@/assets/images/icons/close.svg';

import {Context} from '@/context';

// create a component
const SignUp = forwardRef((props, ref) => {
  const [email, setEmail] = useState('');
  const [emailBorder, setEmailBorder] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(false);

  const [name, setName] = useState('');
  const [nameBorder, setNameBorder] = useState({});

  const [password, setPassword] = useState('');
  const [passwordBorder, setPasswordBorder] = useState({});

  const [signUpForm, setSignUpForm] = useState({});

  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: AppColor.buttonDisable,
    borderColor: AppColor.buttonDisable,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Sign up');

  const cleanSignUpForm = () => {
    setEmail('');
    setEmailBorder({});
    setIsValidEmail(false);

    setName('');
    setNameBorder({});

    setPassword('');
    setPasswordBorder({});

    setSignUpForm({});

    setButtonStyle({
      backgroundColor: AppColor.buttonDisable,
      borderColor: AppColor.buttonDisable,
    });

    setButtonDisabled(true);
    setButtonText('Sign up');
  };

  useImperativeHandle(ref, () => {
    return {
      cleanSignUpForm: cleanSignUpForm,
    };
  });

  const validateEmail = (email) => {
    //console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      //console.log('Email is Not Correct');
      //setEmailBorder({borderColor: AppColor.neutralGray});
      setEmail(email);
      return false;
    } else {
      setEmail(email);
      setEmailBorder({borderColor: AppColor.contentEbony});
      //console.log('Email is Correct');
      return true;
    }
  };

  const onEmailChange = (email) => {
    if (validateEmail(email)) {
      setButtonText('Next');
      setIsValidEmail(true);
    } else {
      setEmailBorder({borderColor: AppColor.neutralGray});
      setIsValidEmail(false);
      setButtonText('Sign up');
    }
    const newKeyValue = {login: email};
    setSignUpForm({...signUpForm, ...newKeyValue});
    checkInputComplete();
  };

  const onNameChange = (name) => {
    setName(name);
    setNameBorder({borderColor: AppColor.contentEbony});
    const newKeyValue = {full_name: name};
    setSignUpForm({...signUpForm, ...newKeyValue});
    checkInputComplete();
  };

  const onPasswordChange = (password) => {
    setPassword(password);
    setPasswordBorder({borderColor: AppColor.contentEbony});
    const newKeyValue = {password: password};
    setSignUpForm({...signUpForm, ...newKeyValue});
    checkInputComplete();
  };

  const checkInputComplete = () => {
    //console.log(name.length);
    //console.log(password.length);
    if (isValidEmail && name.length > 1 && password.length > 1) {
      //onsole.log('VALID FORM');
      setButtonStyle({});
      setButtonDisabled(false);
    } else {
      //console.log('INVALID FORM');
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
  };

  const {closeSlider} = useContext(Context);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.closeIconWrapper} onPress={closeSlider}>
          <Close height={24} width={24} />
        </TouchableOpacity>
        <AppText textStyle="display5">Sign Up</AppText>
        <AppText textStyle="caption" customStyle={styles.textCaption}>
          Join Servbees today. It’s free!
        </AppText>
        <View style={styles.formWrapper}>
          <AppInput
            label="Email"
            value={email}
            keyboardType="email-address"
            customStyle={{...styles.customInputStyle, ...emailBorder}}
            onChangeText={(email) => onEmailChange(email)}
          />
          <AppInput
            label="Full Name"
            value={name}
            keyboardType="default"
            customStyle={{...styles.customInputStyle, ...nameBorder}}
            onChangeText={(name) => onNameChange(name)}
          />
          <AppInput
            label="Password"
            secureTextEntry
            password
            value={password}
            keyboardType="default"
            customStyle={{...styles.customInputStyle, ...passwordBorder}}
            onChangeText={(password) => onPasswordChange(password)}
          />
        </View>

        <View>
          <AppButton
            text={buttonText}
            type="primary"
            height="xl"
            disabled={buttonDisabled}
            customStyle={{...styles.customButtonStyle, ...buttonStyle}}
            onPress={() => {
              signUpEmail(signUpForm);
            }}
            loading={props.loading}
          />
        </View>
        <View style={styles.orCopyWrapper}>
          <AppText>or</AppText>
        </View>
        <View style={styles.otherLoginWrapper}>
          <AppButton
            text="Sign up with Facebook"
            type="primary"
            height="md"
            icon="fb"
            customStyle={styles.disableButton}
            //onPress={}
          />
          <AppButton
            text="Sign up with Google"
            type="primary"
            height="md"
            icon="g"
            customStyle={styles.disableButton}
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
});

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
    marginBottom: 13,
    paddingBottom: 24,
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
    borderWidth: 1.5,
    marginBottom: 16,
  },

  disableButton: {
    borderWidth: 1.5,
    marginBottom: 16,
    backgroundColor: AppColor.buttonDisable,
    borderColor: AppColor.buttonDisable,
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
