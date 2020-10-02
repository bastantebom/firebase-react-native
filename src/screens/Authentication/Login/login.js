import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LoginService from '@/services/LoginService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppButton, AppInput, AppText, FloatingAppInput} from '@/components';
import Colors from '@/globals/Colors';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
////import Close from '@/assets/images/icons/close.svg';
////import EyeDark from '@/assets/images/icons/eye-dark.svg';
////import EyeLight from '@/assets/images/icons/eye-light.svg';

import {
  Close,
  EyeDark,
  EyeLight,
  LoginApple,
  LoginFB,
  LoginGoogle,
} from '@/assets/images/icons';

import {PaddingView} from '@/components';

import {Context} from '@/context';
import {normalize} from '@/globals';

function Divider() {
  return (
    <View style={styles.dividerWrapper}>
      <View style={styles.divider} />
      <AppText textStyle="body1" customStyle={styles.dividerText}>
        or
      </AppText>
    </View>
  );
}

function Login() {
  const navigation = useNavigation();
  // const [authType, setAuthType] = useState('login');

  const [emailAddress, setEmailAddress] = useState('');

  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState([]);

  const {closeSlider, openSlider, authType, setAuthType} = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    console.log('Handle login');

    await LoginService.loginMobile({
      login: emailAddress,
      password: password,
    })
      .then((response) => {
        //console.log('Response');
        //console.log(response);
        if (response.success && response.verified) {
          //console.log('SUCCESS---------------');
          //console.log(response.custom_token);

          return auth()
            .signInWithCustomToken(response.custom_token)
            .then(() => {
              auth().currentUser.getIdToken(true).then(function(idToken) {
                console.log(idToken)
                console.log('idToken')
              })
              setIsLoading(false);
              navigation.push('TabStack');
            })
            .catch((err) => {
              setIsLoading(false);
              console.log(err);
            });
        }
        if (response.success && !response.verified) {
          closeSlider();
          navigation.navigate('VerifyAccount', {
            uid: response.uid,
            login: emailAddress,
          });
        }

        if (!response.success) {
          setIsLoading(false);
          alert('Invalid login credentials');
          setPassword('');
          //console.log(response);
        }
      })
      .catch((error) => {
        console.log('FAILED---------------');
        console.log('With Error in the API Login ' + error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrollView>
      <KeyboardAwareScrollView resetScrollToCoords={{x: 0, y: 0}}>
        <PaddingView
          paddingSize={2}
          style={{paddingTop: 5, paddingBottom: 100}}>
          <AppViewContainer
            paddingSize={2}
            customStyle={{paddingTop: 0, paddingHorizontal: 0}}>
            <TouchableOpacity onPress={closeSlider}>
              <Close />
            </TouchableOpacity>
          </AppViewContainer>

          <View style={styles.container}>
            <AppText textStyle="display5">Welcome back!</AppText>
            <AppText textStyle="caption" customStyle={styles.caption}>
              Log in to get going, Buzzybee.
            </AppText>
            <AppViewContainer
              marginSize={3}
              customStyle={{marginHorizontal: 0, marginBottom: 0}}>
              <FloatingAppInput
                label="Email or Mobile Number"
                customStyle={styles.inputText}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                value={emailAddress}
                keyboardType={'email-address'}
              />
              <View style={{position: 'relative'}}>
                {/* <AppInput
                  label="Password"
                  onChangeText={(password) => setPassword(password)}
                  value={password}
                  secureTextEntry={!isVisible ? true : false}
                /> */}
                <FloatingAppInput
                  label="Password"
                  // onBlur={onBlurPassword}
                  // onFocus={onFocusPassword}
                  secureTextEntry={!isVisible ? true : false}
                  password
                  value={password}
                  valueHandler={setPassword}
                  keyboardType="default"
                  setError={setError}
                  error={error}
                  validation={['password']}
                  setButtonState={() => {}}
                />
                <View style={styles.passwordToggle}>
                  <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                    {!isVisible ? <EyeDark /> : <EyeLight />}
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  closeSlider();
                  navigation.push('ResetPassword');
                }}>
                <AppText textStyle="caption" customStyle={styles.caption}>
                  Forgot Password?
                </AppText>
              </TouchableOpacity>
              <AppButton
                text="Log In"
                type="primary"
                height="xl"
                customStyle={styles.customLogin}
                onPress={() => {
                  handleLogin();
                }}
                loading={isLoading}
              />
            </AppViewContainer>

            <Divider />

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

            <View style={styles.cta}>
              <AppText textStyle="button2">Don't have an account? </AppText>
              <TouchableOpacity
                onPress={() => {
                  closeSlider();
                  setTimeout(() => {
                    setAuthType('signup');
                    openSlider();
                  }, 450);
                }}>
                <AppText textStyle="button2" customStyle={styles.link}>
                  Sign up
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </PaddingView>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  link: {
    color: Colors.contentOcean,
  },
  caption: {
    color: Colors.contentPlaceholder,
    marginTop: 5,
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputText: {
    marginBottom: 16,
  },
  customSpacing: {
    marginBottom: 16,
  },
  customButton: {
    //change button color
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
    marginBottom: 16,
  },
  customLogin: {
    marginTop: 25,
  },
  // divider: {
  //   position: 'relative',
  //   borderWidth: StyleSheet.hairlineWidth,
  //   width: '100%',
  //   borderColor: Colors.buttonDisable,
  //   zIndex: 0
  // },
  dividerText: {
    // position: 'absolute',
    // top: -12,
    // width: 75,
    textAlign: 'center',
    marginVertical: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 18,
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

export default Login;
