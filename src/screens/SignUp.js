//import liraries
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//App Specific Component
import AppColor from '@/globals/Colors';
import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
//import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
//SVG Import
import SignUpService from '@/services/SignUpService';
import {Close, EyeDark, EyeLight} from '@/assets/images/icons/';

import {Context} from '@/context';

// create a component
const SignUp = (props) => {
  const [isVisible, setIsVisible] = useState(false);

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
  //const ref = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  //const [data, setData] = useState({});
  //const [passForm, setPassForm] = useState({});
  //const [uid, setUid] = useState('');

  //const [authType, setAuthType] = useState('signup');

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

  useEffect(() => {
    // exit early when we reach 0
    if (email.length === 11) {
      setSignUpForm({login: '+63' + email.substr(1)});
    } else {
      setSignUpForm({login: email});
    }

    //console.log(signUpForm);
    checkInputComplete();
  }, [isValidMobileNumber]);

  useEffect(() => {
    // exit early when we reach 0
    setIsValidName(() => isValidName);
  }, [isValidName]);

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
      //setEmailBorder({borderColor: AppColor.contentEbony});
      return true;
    } else {
      //console.log('Pumasok sa else');
      setIsValidMobileNumber(false);

      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === false) {
        setEmail(email);
        return false;
      } else {
        setEmail(email);
        //setEmailBorder({borderColor: AppColor.contentEbony});
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
      //setLoginUse('');
      const newKeyValue = {login: email};
      setSignUpForm({...signUpForm, ...newKeyValue});
      checkInputComplete();
    } else {
      //console.log('Pumasok sa else On Chnage');
      if (email.substring(0, 1) === '+' || email.substring(0, 1) === '0') {
        setLoginUse(() => {
          setLoginUse('mobile number');
        });
      } else {
        setLoginUse(() => {
          setLoginUse('email');
        });
      }

      //setEmailBorder({borderColor: AppColor.neutralGray});
      setIsValidEmail(false);
      setButtonText('Sign up');
    }
  };

  const onNameChange = (name) => {
    let nameReg = /^[a-z ,.'-]+$/i;
    if (nameReg.test(name)) {
      setName(name);
      setIsValidName(true);
      //setNameBorder({borderColor: AppColor.contentEbony});
      const newKeyValue = {full_name: name};
      setSignUpForm({...signUpForm, ...newKeyValue});
      //console.log(signUpForm);
      checkInputComplete();
    } else {
      setName(name);
      setIsValidName(false);
      //setNameBorder({borderColor: AppColor.errorCopy});
    }

    if (name.length === 0) {
      setIsValidName(true);
      //setNameBorder({borderColor: AppColor.errorCopy});
    }
  };

  const onPasswordChange = (password) => {
    if (password.length > 5) {
      setIsValidPassword(true);
      setPassword(password);
      //setPasswordBorder({borderColor: AppColor.contentEbony});
      const newKeyValue = {password: password};
      setSignUpForm({...signUpForm, ...newKeyValue});
      checkInputComplete();
    } else {
      //setPasswordBorder({borderColor: AppColor.errorInput});
      setPassword(password);
      setIsValidPassword(false);
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
      setButtonDisabled(true);
    }
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
    setEmailBorder({});
    if (loginUse === 'email') {
      if (!isValidEmail) {
        console.log('Invalid Email');
        setIsValidLogin(false);
        //setEmailBorder({borderColor: AppColor.errorInput});
        setButtonStyle({
          backgroundColor: AppColor.buttonDisable,
          borderColor: AppColor.buttonDisable,
        });
        setButtonDisabled(true);
      } else if (isValidEmail) {
        //setEmailBorder({borderColor: AppColor.contentEbony});
      }
    }
    if (loginUse === 'mobile number') {
      if (!isValidMobileNumber) {
        console.log('invalid mobile');
        setIsValidLogin(false);
        //setEmailBorder({borderColor: AppColor.errorInput});
        setButtonStyle({
          backgroundColor: AppColor.buttonDisable,
          borderColor: AppColor.buttonDisable,
        });
        setButtonDisabled(true);
      } else if (isValidMobileNumber) {
        //setEmailBorder({borderColor: AppColor.contentEbony});
      }
    }
    if (email.length === 0) {
      setIsValidLogin(false);
    }
  };

  const onFocusEmail = () => {
    //alert('Focus');
    setIsValidLogin(true);
    setEmailBorder({borderColor: AppColor.contentOcean});
  };

  const onBlurName = () => {
    setNameBorder({});
  };

  const onFocusName = () => {
    //setIsValidName(true);
    setNameBorder({borderColor: AppColor.contentOcean});
  };

  const onBlurPassword = () => {
    setPasswordBorder({});
  };

  const onFocusPassword = () => {
    //alert('Focus');
    setPasswordBorder({borderColor: AppColor.contentOcean});
    setIsValidPassword(true);
  };

  // const { closeSlider } = useContext(Context);
  const {closeSlider, authType, setAuthType} = useContext(Context);

  signUpEmail = (formValues) => {
    setIsLoading(true);

    //console.log(formValues);

    SignUpService.createUser(JSON.stringify(formValues))
      .then((response) => {
        setIsLoading(false);
        cleanSignUpForm();
        if (response.success) {
          navigation.navigate('VerifyAccount', {...response, ...formValues});
        } else {
          navigation.navigate('Onboarding');
        }
      })
      .catch((error) => {
        console.log('With Error in the API SignUp ' + error);
      });
  };

  return (
    ////////////////////
    <>
      {authType === 'signup' ? (
        <View style={styles.mainWrapper}>
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={closeSlider}>
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
                customStyle={{
                  ...styles.customInputStyle,
                  ...(!isValidLogin && email.length > 0
                    ? styles.withError
                    : isValidLogin && email.length > 0
                    ? styles.withoutError
                    : styles.defaultBorder),
                  ...emailBorder,
                }}
                onChangeText={(email) => onEmailChange(email)}
              />
              {!isValidLogin && email.length > 0 ? (
                <AppText textStyle="caption" customStyle={styles.errorCopy}>
                  Enter a valid {loginUse}
                </AppText>
              ) : null}

              <AppInput
                label="Full Name"
                value={name}
                onBlur={onBlurName}
                onFocus={onFocusName}
                keyboardType="default"
                customStyle={{
                  ...styles.customInputStyle,
                  ...(!isValidName && name.length > 0
                    ? styles.withError
                    : isValidName && name.length > 0
                    ? styles.withoutError
                    : styles.defaultBorder),
                  ...nameBorder,
                }}
                onChangeText={(name) => onNameChange(name)}
              />
              {!isValidName ? (
                <AppText textStyle="caption" customStyle={styles.errorCopy}>
                  Don’t add special character(s)
                </AppText>
              ) : null}
              <View style={{position: 'relative'}}>
                {!isValidMobileNumber ? (
                  <AppInput
                    label="Password"
                    onBlur={onBlurPassword}
                    onFocus={onFocusPassword}
                    secureTextEntry={!isVisible ? true : false}
                    password
                    value={password}
                    keyboardType="default"
                    customStyle={{
                      ...styles.customInputStyle,
                      ...(!isValidPassword && password.length > 0
                        ? styles.withError
                        : isValidPassword && password.length > 0
                        ? styles.withoutError
                        : styles.defaultBorder),
                      ...passwordBorder,
                    }}
                    onChangeText={(password) => onPasswordChange(password)}
                  />
                ) : null}

                {!isValidMobileNumber ? (
                  <View style={styles.passwordToggle}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                      {!isVisible ? <EyeDark /> : <EyeLight />}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
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
                customStyle={{...styles.customButtonStyle, ...buttonStyle}}
                onPress={() => {
                  signUpEmail(signUpForm);
                }}
                loading={isLoading}
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
                onPress={() => {
                  LoginServices.facebookLogin();
                }}
              />
              <AppButton
                text="Sign up with Google"
                type="primary"
                height="md"
                icon="Google"
                iconPosition="left"
                customStyle={styles.disableButton}
                onPress={() => {
                  LoginServices.googleLogin();
                }}
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
      ) : (
        <Login />
      )}
    </>
  );
};

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
    marginBottom: 12,
  },

  withError: {
    marginBottom: 4,
    borderColor: AppColor.errorInput,
  },

  withoutError: {
    marginBottom: 16,
    borderColor: AppColor.contentEbony,
  },

  defaultBorder: {
    marginBottom: 16,
    borderColor: AppColor.neutralGray,
  },

  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 18,
  },
});

//make this component available to the app
export default SignUp;
