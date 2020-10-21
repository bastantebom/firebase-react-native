//import liraries
import React, {useState, useContext, useEffect, createRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, LinkText} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppColor from '@/globals/Colors';

import {
  AppText,
  AppCheckbox,
  AppButton,
  FloatingAppInput,
  AppInput,
} from '@/components';
import Validator from '@/components/AppInput/Validator';
import valueHandler from '@/components/AppInput/ValueHandler';

import SignUpService from '@/services/SignUpService';
import LoginService from '@/services/LoginService';
import {
  Close,
  EyeDark,
  EyeLight,
  LoginApple,
  LoginFB,
  LoginGoogle,
  CheckboxCheck,
} from '@/assets/images/icons/';

import {Context} from '@/context';
import SwitchComponent from '@/components/Switch/Switch';

import {ScrollView} from 'react-native-gesture-handler';

import Privacy from '@/screens/Authentication/SignUp/components/PrivacyPolicy';
import Terms from '@/screens/Authentication/SignUp/components/TermsOfUse';
import {normalize} from '@/globals';

// create a component
const SignUp = (props) => {
  const [isPromo, setIsPromo] = useState(false);
  const [isTerms, setIsTerms] = useState(false);
  const [modalContentNumber, setModalContentNumber] = useState(0);
  const toggleSwitch = () => {
    setIsPromo((previousState) => !previousState);
  };

  const toggleTerms = () => {
    setIsTerms((previousState) => !previousState);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible((previousState) => !previousState);
  };
  const [isModalVisibleT, setModalVisibleT] = useState(false);
  const toggleModalT = () => {
    setModalVisibleT((previousState) => !previousState);
  };
  const modalContent = (contentNum) => setModalContentNumber(contentNum);
  const [error, setError] = useState([]);
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const [signUpLabel, setSignUpLabel] = useState('email');
  const [isVisible, setIsVisible] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
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
  const [signUpForm, setSignUpForm] = useState({
    terms_conditions: false,
    receive_updates: false,
  });
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: buttonDisabled
      ? AppColor.buttonDisable
      : AppColor.primaryYellow,
    borderColor: AppColor.buttonDisable,
  });
  const [changingValidation, setChangingValidation] = useState(false);
  const inputRef = createRef();

  const [errors, setErrors] = useState({
    email: {
      passed: false,
      shown: false,
      message: '',
    },
    name: {
      passed: false,
      shown: false,
      message: '',
    },
    password: {
      passed: false,
      shown: false,
      message: '',
    },
  });

  const checkErrorState = () => {
    let temp = true;

    for (const [key, value] of Object.entries(errors)) {
      if (!value.passed) {
        temp = false;
        break;
      }
    }

    if (temp && isTerms) {
      // ENABLE BUTTON
      // console.log('All fields are valid');
      setButtonDisabled(false);
    } else {
      // DISABLE BUTTON
      // console.log('One or more field is invalid');
      setButtonDisabled(true);
    }
  };

  useEffect(() => {
    checkErrorState();
  }, [errors, isTerms]);

  const toggleSignUpMethod = () => {
    setEmail('');
    // setError([]);
    setChangingValidation(!changingValidation);
    setSignUpLabel((previousState) => !previousState);
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [validationRule, setValidationRule] = useState(['email']);

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

    setSignUpForm({
      terms_conditions: false,
      receive_updates: false,
    });

    setButtonStyle({
      backgroundColor: AppColor.buttonDisable,
      borderColor: AppColor.buttonDisable,
    });

    setButtonDisabled(true);
    //setButtonText('Sign up');

    setIsValidMobileNumber(false);
  };

  // useEffect(() => {
  //   // exit early when we reach 0
  //   const newKeyValue = {
  //     login: email.length === 11 ? '+63' + email.substr(1) : email,
  //   };
  //   setSignUpForm({...signUpForm, ...newKeyValue});
  //   checkInputComplete();
  // }, [isValidMobileNumber]);

  useEffect(() => {
    // exit early when we reach 0
    const newKeyValue = {receive_updates: isPromo};
    setSignUpForm({...signUpForm, ...newKeyValue});
  }, [isPromo]);

  useEffect(() => {
    // exit early when we reach 0
    const newKeyValue = {terms_conditions: isTerms};
    setSignUpForm({...signUpForm, ...newKeyValue});
    // checkInputComplete();
  }, [isTerms]);

  // const validateEmail = (email) => {
  //   let mobileReg = /^(09|\+639)\d{9}$/;
  //   if (
  //     mobileReg.test(email) === true &&
  //     ((email.substring(0, 1) === '0' && email.length === 11) ||
  //       (email.length === 13 && email.substring(0, 1) === '+'))
  //   ) {
  //     setEmail(email);
  //     setIsValidMobileNumber((isValidMobileNumber) => !isValidMobileNumber);
  //     return true;
  //   } else {
  //     setIsValidMobileNumber(false);
  //     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //     if (reg.test(email) === false) {
  //       setEmail(email);
  //       return false;
  //     } else {
  //       setEmail(email);
  //       return true;
  //     }
  //   }
  // };

  // const onEmailChange = (email) => {
  //   if (validateEmail(email)) {
  //     //setButtonText('Sign up');
  //     setIsValidEmail(true);
  //     const newKeyValue = {login: email};
  //     setSignUpForm({...signUpForm, ...newKeyValue});
  //     //console.log(signUpForm);
  //     checkInputComplete();
  //   } else {
  //     if (email.substring(0, 1) === '+' || email.substring(0, 1) === '0') {
  //       setLoginUse(() => {
  //         setLoginUse('mobile number');
  //       });
  //     } else {
  //       setLoginUse(() => {
  //         setLoginUse('email');
  //       });
  //     }

  //     setIsValidEmail(false);
  //     //setButtonText('Sign up');
  //   }
  // };

  // const onNameChange = (name) => {
  //   let nameReg = /^[a-z ,.'-]+$/i;
  //   if (nameReg.test(name)) {
  //     setName(name);
  //     setIsValidName(true);

  //     const newKeyValue = {full_name: name};
  //     setSignUpForm({...signUpForm, ...newKeyValue});
  //     //console.log('Password Valid');
  //     //console.log(signUpForm);
  //     checkInputComplete();
  //   } else {
  //     setName(name);
  //     setIsValidName(false);
  //   }

  //   if (name.length === 0) {
  //     setIsValidName(true);
  //   }
  // };

  // const onPasswordChange = (password) => {
  //   if (password.length > 5) {
  //     setIsValidPassword(true);
  //     setPassword(password);

  //     const newKeyValue = {password: password};
  //     setSignUpForm({...signUpForm, ...newKeyValue});
  //     //console.log('Password Valid');
  //     //console.log(signUpForm);
  //     checkInputComplete();
  //   } else {
  //     setPassword(password);
  //     setIsValidPassword(false);
  //     setButtonStyle({
  //       backgroundColor: AppColor.buttonDisable,
  //       borderColor: AppColor.buttonDisable,
  //     });
  //     setButtonDisabled(true);
  //   }
  // };

  // const checkInputComplete = () => {
  //   if (isValidMobileNumber && name.length > 1) {
  //     setButtonStyle({});
  //     setButtonDisabled(false);
  //   } else {
  //     if (
  //       !isValidMobileNumber &&
  //       isValidEmail &&
  //       name.length > 1 &&
  //       password.length > 1 &&
  //       isTerms
  //     ) {
  //       setButtonStyle({});
  //       setButtonDisabled(false);
  //     } else {
  //       if (name.length === 0) {
  //         setNameBorder({});
  //       }
  //       if (name.length === 0) {
  //         setPasswordBorder({});
  //       }
  //       setButtonStyle({
  //         backgroundColor: AppColor.buttonDisable,
  //         borderColor: AppColor.buttonDisable,
  //       });
  //       setButtonDisabled(true);
  //     }
  //   }
  // };

  const onFocusEmail = () => {
    setIsValidLogin(true);
    setEmailBorder({borderColor: AppColor.contentOcean});
    // setSignUpLabel('Email Address');
    setIsToggleVisible(true);
  };

  const onBlurName = () => {
    setNameBorder({});
  };

  const onFocusName = () => {
    setNameBorder({borderColor: AppColor.contentOcean});
  };

  const onBlurPassword = () => {
    setPasswordBorder({});
  };

  const onFocusPassword = () => {
    setPasswordBorder({borderColor: AppColor.contentOcean});
    setIsValidPassword(true);
  };

  const {closeSlider, openSlider, authType, setAuthType} = useContext(Context);

  const setButtonState = (j) => {
    if (j) {
      setButtonStyle({
        backgroundColor: AppColor.buttonDisable,
        borderColor: AppColor.buttonDisable,
      });
    } else {
      setButtonStyle({});
    }
    setButtonDisabled(j);
  };

  const signUpEmail = (formValues) => {
    console.log(formValues);
    console.log('Signup button clicked');
    console.log('password:', password);
    console.log('name:', name);
    console.log('email:', email);

    let formSubmitted = {
      ...formValues,
      login: email,
      full_name: name,
      password: password,
    };

    setIsLoading(true);
    SignUpService.createUser(JSON.stringify(formSubmitted))
      .then((response) => {
        cleanSignUpForm();
        console.log(response);

        if (response.success) {
          navigation.navigate('VerifyAccount', {...response, ...formValues});
        } else {
          //console.log('_________________');
          alert(response.message);
          navigation.navigate('Onboarding');
        }
        closeSlider();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const TandC = () => {
    return (
      <>
        <View style={styles.promos}>
          <View>
            <AppCheckbox
              Icon=""
              label=""
              value={signUpForm.terms_conditions}
              valueChangeHandler={toggleTerms}
              style={{
                marginLeft: 0,
                paddingLeft: 0,
                marginTop: 8,
                backgroundColor: 'transparent',
              }}
            />
          </View>
          <View style={styles.terms}>
            <AppText
              textStyle="caption"
              customStyle={{color: AppColor.promoCopy}}>
              By signing up, I agree to Servbees
            </AppText>
            <TouchableOpacity
              onPress={() => {
                //modalContent(0);
                toggleModalT();
              }}>
              <AppText
                textStyle="promo"
                customStyle={{
                  color: AppColor.promoCopy,
                  textDecorationLine: 'underline',
                }}>
                Terms of Use
              </AppText>
            </TouchableOpacity>

            <AppText
              textStyle="caption"
              customStyle={{color: AppColor.promoCopy}}>
              {' '}
              and{' '}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}>
              <AppText
                textStyle="promo"
                customStyle={{
                  color: AppColor.promoCopy,
                  textDecorationLine: 'underline',
                }}>
                Privacy Policy.
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.promos}>
          <View style={styles.promoCopy}>
            <AppText
              textStyle="caption"
              customStyle={{color: AppColor.promoCopy}}>
              I want to receive offers, promos, and updates from Servbees.
            </AppText>
          </View>
          <View style={styles.promoSwitch}>
            <SwitchComponent onValueChange={toggleSwitch} value={isPromo} />
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <ScrollView>
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
              {/* <FloatingAppInput
                value={email}
                valueHandler={setEmail}
                label={!signUpLabel ? 'Email' : 'Mobile Number'}
                customStyle={{marginBottom: normalize(8)}}
                validation={validationRule}
                setValidationRule={setValidationRule}
                // validation={['email', 'number']}
                keyboardType={!signUpLabel ? 'email-address' : 'phone-pad'}
                onInputFocus={onFocusEmail}
                setError={setError}
                error={error}
                setButtonState={setButtonState}
                onChangeTextInput={(email) => onEmailChange(email)}
                setChangingValidation={setChangingValidation}
                changingValidation={changingValidation}
              /> */}
              <Validator
                style={{marginBottom: normalize(16)}}
                errorState={errors.email}>
                <AppInput
                  label={
                    signUpLabel === 'number' ? 'Mobile Number' : 'Email'
                    // signUpLabel.charAt(0).toUpperCase() + signUpLabel.slice(1)
                  }
                  onChangeText={(email) =>
                    valueHandler(
                      email,
                      signUpLabel,
                      'email',
                      errors,
                      setErrors,
                      setEmail,
                    )
                  }
                  value={email}
                  inputRef={inputRef}
                  onFocusInput={() => {
                    setIsToggleVisible(true);
                  }}
                  onBlurInput={() => {
                    console.log('BLURR');
                    setIsToggleVisible(false);
                  }}
                  onEndEditing={() => {
                    console.log('DONE');
                  }}
                  keyboardType={
                    signUpLabel === 'email' ? 'email-address' : 'phone-pad'
                  }
                  onKeyPress={(e) => {
                    setErrors({
                      ...errors,
                      email: {
                        ...errors.email,
                        shown: false,
                      },
                    });
                  }}
                />
              </Validator>

              <View style={{display: isToggleVisible ? 'flex' : 'none'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log(signUpLabel);
                    signUpLabel === 'number'
                      ? setSignUpLabel('email')
                      : setSignUpLabel('number');

                    valueHandler(
                      email,
                      signUpLabel === 'number' ? 'email' : 'number',
                      'email',
                      errors,
                      setErrors,
                      setEmail,
                    );
                  }}>
                  <AppText
                    textStyle="button3"
                    color={AppColor.contentOcean}
                    customStyle={{marginBottom: 16}}>
                    {signUpLabel === 'email'
                      ? 'Use mobile number instead'
                      : 'Use email instead'}
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* <FloatingAppInput
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
              /> */}
              <Validator
                style={{marginBottom: normalize(16)}}
                errorState={errors.name}>
                <AppInput
                  label="Full Name"
                  onChangeText={(name) =>
                    valueHandler(
                      name,
                      'name',
                      'name',
                      errors,
                      setErrors,
                      setName,
                    )
                  }
                  value={name}
                  // keyboardType={'email-address'}
                  onKeyPress={() => {
                    setErrors({
                      ...errors,
                      name: {
                        ...errors.name,
                        shown: false,
                      },
                    });
                  }}
                />
              </Validator>

              <View style={{position: 'relative'}}>
                {/* <FloatingAppInput
                  label="Password"
                  onBlur={onBlurPassword}
                  onFocus={onFocusPassword}
                  secureTextEntry={!isVisible ? true : false}
                  password
                  value={password}
                  valueHandler={setPassword}
                  keyboardType="default"
                  setError={setError}
                  error={error}
                  validation={['password']}
                  setButtonState={setButtonState}
                  onChangeText={(val) => onPasswordChange(val)}
                /> */}

                <Validator
                  style={{marginBottom: normalize(16)}}
                  errorState={errors.password}>
                  <AppInput
                    label="Password"
                    onChangeText={(password) =>
                      valueHandler(
                        password,
                        'password',
                        'password',
                        errors,
                        setErrors,
                        setPassword,
                      )
                    }
                    secureTextEntry={!isVisible ? true : false}
                    value={password}
                    onKeyPress={() => {
                      setErrors({
                        ...errors,
                        password: {
                          ...errors.password,
                          shown: false,
                        },
                      });
                    }}
                  />
                </Validator>

                <View style={styles.passwordToggle}>
                  <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                    {!isVisible ? <EyeDark /> : <EyeLight />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TandC />
            <Privacy isModalVisible={isModalVisible} onClose={toggleModal} />
            <Terms isModalVisibleT={isModalVisibleT} onClose={toggleModalT} />

            <View style={{marginTop: 16}}>
              <AppButton
                text="Sign up"
                type="primary"
                height="xl"
                disabled={buttonDisabled}
                customStyle={{
                  ...styles.customButtonStyle,
                  backgroundColor: buttonDisabled
                    ? AppColor.buttonDisable
                    : AppColor.primaryYellow,

                  borderColor: buttonDisabled
                    ? AppColor.buttonDisable
                    : AppColor.primaryYellow,
                }}
                onPress={() => {
                  signUpEmail(signUpForm);
                }}
                loading={isLoading}
              />
            </View>
            <View style={styles.orCopyWrapper}>
              <AppText textStyle="body1">or</AppText>
            </View>
            <View style={styles.socialMediaLogin}>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  onPress={() => {
                    //alert();
                    LoginService.appleLogin().then(() => {
                      closeSlider();
                    });
                  }}
                  style={{paddingHorizontal: normalize(8)}}>
                  <LoginApple />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  LoginService.facebookSignIn().then(() => closeSlider());
                }}
                style={{paddingHorizontal: normalize(8)}}>
                <LoginFB />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  LoginService.googleLogin().then(() => {
                    console.log('Signed in with Google!');
                    closeSlider();
                  });
                }}
                style={{paddingHorizontal: normalize(8)}}>
                <LoginGoogle />
              </TouchableOpacity>
            </View>

            <View style={styles.loginLinkCopy}>
              <AppText textStyle="button2">Already have an account?</AppText>
              <TouchableOpacity
                onPress={() => {
                  closeSlider();
                  setTimeout(() => {
                    setAuthType('login');
                    openSlider();
                  }, 450);
                }}>
                <AppText textStyle="button2" customStyle={styles.underLineText}>
                  Login
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainWrapper: {
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
  },

  forgotPasswordLink: {
    marginTop: 4,
    marginBottom: 24,
  },

  customButtonStyle: {
    borderWidth: 1.5,
    marginBottom: 16,
    borderRadius: 4,
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

  terms: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 16,
  },

  promos: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'flex-start',
  },

  promoCopy: {
    width: '80%',
  },
  promoSwitch: {
    width: '20%',
    alignItems: 'flex-end',
  },
  socialMediaLogin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalize(8),
    paddingBottom: normalize(16),
  },
});

//make this component available to the app
export default SignUp;
