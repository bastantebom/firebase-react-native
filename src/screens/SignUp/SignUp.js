//import liraries
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
//App Specific Component
import AppColor from '@/globals/Colors';
import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
//import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
//SVG Import
import Close from '@/assets/images/icons/close.svg';

import { Context } from '@/context';

// create a component
const SignUp = forwardRef((props, ref) => {
  const [loginUse, setLoginUse] = useState('');
  const [isValidLogin, setIsValidLogin] = useState(true);

  const [isValidMobileNumber, setIsValidMobileNumber] = useState(false);

  const [email, setEmail] = useState('');
  const [emailBorder, setEmailBorder] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(false);

  const [name, setName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [nameBorder, setNameBorder] = useState({});

  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [passwordBorder, setPasswordBorder] = useState({});

  const [signUpForm, setSignUpForm] = useState({});

  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: AppColor.buttonDisable,
    borderColor: AppColor.buttonDisable,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Sign up');

  const cleanSignUpForm = () => {
    setLoginUse('');
    setIsValidLogin(true);

    setIsValidMobileNumber(false);
    setEmail('');
    setEmailBorder({});
    setIsValidEmail(false);

    setName('');
    setIsValidName(true);
    setNameBorder({});

    setPassword('');
    setIsValidPassword(true);
    setPasswordBorder({});

    setSignUpForm({});

    setButtonStyle({
      backgroundColor: AppColor.buttonDisable,
      borderColor: AppColor.buttonDisable,
    });

    setButtonDisabled(true);
    setButtonText('Sign up');

    setIsValidMobileNumber(false);
  };

  useImperativeHandle(ref, () => {
    return {
      cleanSignUpForm: cleanSignUpForm,
    };
  });

  useEffect(() => {
    // exit early when we reach 0
    if (email.length === 11) {
      setSignUpForm({ login: '+63' + email.substr(1) });
    } else {
      setSignUpForm({ login: email });
    }

    //console.log(signUpForm);
    checkInputComplete();
  }, [isValidMobileNumber]);

  const validateEmail = (email) => {
    let mobileReg = /^(09|\+639)\d{9}$/;
    //console.log(mobileReg.test(email) + '&&' + email.length)

    if (
      mobileReg.test(email) === true &&
      ((email.substring(0, 1) === '0' && email.length === 11) ||
        (email.length === 13 && email.substring(0, 1) === '+'))
    ) {
      setEmail(email);
      //console.log('Mobile number validation');
      //console.log(isValidMobileNumber);
      setIsValidMobileNumber((isValidMobileNumber) => !isValidMobileNumber);
      //console.log(isValidMobileNumber);
      setEmailBorder({ borderColor: AppColor.contentEbony });
      return true;
    } else {
      //console.log('Pumasok sa else');
      setIsValidMobileNumber(false);
      setName('');
      setPassword('');

      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === false) {
        setEmail(email);
        return false;
      } else {
        setEmail(email);
        setEmailBorder({ borderColor: AppColor.contentEbony });
        return true;
      }
    }
  };

  const onEmailChange = (email) => {
    if (validateEmail(email)) {
      setButtonText('Next');
      setIsValidEmail(true);
      //console.log('After Validate');
      //console.log(isValidMobileNumber);
      setLoginUse('');
      const newKeyValue = { login: email };
      setSignUpForm({ ...signUpForm, ...newKeyValue });
      checkInputComplete();
    } else {
      //console.log('Pumasok sa else On Chnage');
      if (email.substring(0, 1) === '+' || email.substring(0, 1) === '0') {
        setLoginUse('mobile number');
      } else {
        setLoginUse('email');
      }

      setEmailBorder({ borderColor: AppColor.neutralGray });
      setIsValidEmail(false);
      setButtonText('Sign up');
    }
  };

  const onNameChange = (name) => {
    setName(name);
    setNameBorder({ borderColor: AppColor.contentEbony });
    const newKeyValue = { full_name: name };
    setSignUpForm({ ...signUpForm, ...newKeyValue });
    //console.log(signUpForm);
    checkInputComplete();
  };

  const onPasswordChange = (password) => {
    setPassword(password);
    setPasswordBorder({ borderColor: AppColor.contentEbony });
    const newKeyValue = { password: password };
    setSignUpForm({ ...signUpForm, ...newKeyValue });
    checkInputComplete();
  };

  const checkInputComplete = () => {
    //console.log('On Check Complete');
    //console.log(isValidMobileNumber);
    //console.log(signUpForm);
    if (isValidMobileNumber && name.length > 1) {
      setButtonStyle({});
      setButtonDisabled(false);
    } else {
      //console.log('Pumasok sa else Complete');
      if (
        !isValidMobileNumber &&
        isValidEmail &&
        name.length > 1 &&
        password.length > 1
      ) {
        setButtonStyle({});
        setButtonDisabled(false);
      } else {
        if (name.length === 0) {
          setNameBorder({});
        }
        if (name.length === 0) {
          setPasswordBorder({});
        }
        setButtonStyle({
          backgroundColor: AppColor.buttonDisable,
          borderColor: AppColor.buttonDisable,
        });
        setButtonDisabled(true);
      }
    }
  };

  const onBlurEmail = () => {
    //alert('Blur');
    //setIsActive(false);
    if (loginUse === 'email') {
      console.log('Invalid Email');
      setIsValidLogin(false);
      setEmailBorder({ borderColor: AppColor.errorInput });
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
    if (loginUse === 'mobile number') {
      console.log('invalid mobile');
      setIsValidLogin(false);
      setEmailBorder({ borderColor: AppColor.errorInput });
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
  };

  const onFocusEmail = () => {
    //alert('Focus');
    setIsValidLogin(true);
    //setEmailBorder({borderColor: AppColor.contentOcean});
  };

  const onBlurName = () => {
    //alert('Blur');
    //setIsActive(false);
    let nameReg = /^[a-z ,.'-]+$/i;
    if (nameReg.test(name)) {
      setIsValidName(true);
    } else if (name.length > 1) {
      setNameBorder({ borderColor: AppColor.errorInput });
      setIsValidName(false);
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
  };

  const onFocusName = () => {
    //alert('Focus');
    setIsValidName(true);
    //setNameBorder({borderColor: AppColor.contentOcean});
  };

  const onBlurPassword = () => {
    if (password.length > 5) {
      setIsValidPassword(true);
    } else if (password.length > 1) {
      setPasswordBorder({ borderColor: AppColor.errorInput });
      setIsValidPassword(false);
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
  };

  const onFocusPassword = () => {
    //alert('Focus');
    //setPasswordBorder({borderColor: AppColor.contentOcean});
    setIsValidPassword(true);
  };

  // const { closeSlider } = useContext(Context);
  const { closeSlider, setAuthType } = useContext(Context);

  return (
    <ScrollView>
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
              label="Email or Mobile Number"
              value={email}
              onBlur={onBlurEmail}
              onFocus={onFocusEmail}
              keyboardType="email-address"
              customStyle={{ ...styles.customInputStyle, ...emailBorder }}
              onChangeText={(email) => onEmailChange(email)}
            />
            {!isValidLogin ? (
              <AppText textStyle="caption" customStyle={styles.errorCopy}>
                Enter a valid {loginUse}
              </AppText>
            ) : (
                <AppText
                  textStyle="caption"
                  customStyle={styles.emptyErrorCopy}></AppText>
              )}

            <AppInput
              label="Full Name"
              value={name}
              onBlur={onBlurName}
              onFocus={onFocusName}
              keyboardType="default"
              customStyle={{ ...styles.customInputStyle, ...nameBorder }}
              onChangeText={(name) => onNameChange(name)}
            />
            {!isValidName ? (
              <AppText textStyle="caption" customStyle={styles.errorCopy}>
                Don’t add special character(s)
              </AppText>
            ) : (
                <AppText
                  textStyle="caption"
                  customStyle={styles.emptyErrorCopy}></AppText>
              )}

            {!isValidMobileNumber ? (
              <AppInput
                label="Password"
                onBlur={onBlurPassword}
                onFocus={onFocusPassword}
                secureTextEntry
                password
                value={password}
                keyboardType="default"
                customStyle={{ ...styles.customInputStyle, ...passwordBorder }}
                onChangeText={(password) => onPasswordChange(password)}
              />
            ) : null}
            {!isValidPassword ? (
              <AppText textStyle="caption" customStyle={styles.errorCopy}>
                Must be at least 6 characters
              </AppText>
            ) : (
                <AppText
                  textStyle="caption"
                  customStyle={styles.emptyErrorCopy}></AppText>
              )}
          </View>

          <View>
            <AppButton
              text={buttonText}
              type="primary"
              height="xl"
              disabled={buttonDisabled}
              customStyle={{ ...styles.customButtonStyle, ...buttonStyle }}
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
              icon="Facebook"
              iconPosition="left"
              customStyle={styles.disableButton}
            //onPress={}
            />
            <AppButton
              text="Sign up with Google"
              type="primary"
              height="md"
              icon="Google"
              iconPosition="left"
              customStyle={styles.disableButton}
            //onPress={}
            />
          </View>

          <View style={styles.loginLinkCopy}>
            <AppText textStyle="button2">Already have an account?</AppText>
            <TouchableOpacity onPress={() => setAuthType('login')}>
              <AppText textStyle="button2" customStyle={styles.underLineText}>
                Login
            </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

// define your styles
const styles = StyleSheet.create({
  mainWrapper: {
    // flex: 1,
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
    marginBottom: 4,
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

  errorCopy: {
    color: AppColor.errorInput,
    marginBottom: 16,
  },

  emptyErrorCopy: {
    color: AppColor.errorInput,
    marginBottom: 12,
  },
});

//make this component available to the app
export default SignUp;
