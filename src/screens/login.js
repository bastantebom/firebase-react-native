import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppText from '../components/AppText/AppText';
import AppInput from '../components/AppInput/AppInput';
import AppButton from '../components/AppButton';
import Colors from '../globals/Colors';
import {useNavigation} from '@react-navigation/native';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
import SignUpWrapper from '@/screens/SignUp/SignUpWrapper';
import Close from '../assets/images/icons/close.svg';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-community/google-signin';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';

GoogleSignin.configure({
  webClientId: '717890893531-4cvrbrnmfq1gb5j4kt6ug7vu7t2gdqda.apps.googleusercontent.com',
});

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
  const [authType, setAuthType] = useState('login');
  const [setUserInfo] = useState(null);

  async function facebookSignIn() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    return auth().signInWithCredential(facebookCredential);
  }

  async function googleLogin() {
    // await GoogleSignin.hasPlayServices();
    const { idToken } = GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  };

  async function isGoogleSignedIn() {
    await GoogleSignin.isSignedIn();
  };

  async function googleSignOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    isGoogleSignedIn();
  }, [])

  return (
    <>
      {authType === 'login' ? (
        <AppViewContainer paddingSize={3}>
          <AppViewContainer 
            paddingSize={3}
            customStyle={{ paddingTop: 0, paddingHorizontal: 0 }}
          >
            <Close/>
          </AppViewContainer>
          <View style={styles.container}>
            <AppText textStyle="display5">Welcome back!</AppText>
            <AppText textStyle="caption" customStyle={styles.caption}>
              Log in to get going, Buzzybee.
            </AppText>
            <AppViewContainer
              paddingSize={4}
              customStyle={{ paddingHorizontal: 0, paddingBottom: 0 }}>
              <AppInput
                label="Email or Mobile Number"
                customStyle={styles.inputText}
              />
              <AppInput
                label="Password"
              />
              <TouchableOpacity>
                <AppText 
                  textStyle="caption" 
                  customStyle={styles.caption}
                >
                  Forgot Password?
                </AppText>
              </TouchableOpacity>
              <AppButton
                text="Log In"
                type="primary"
                height="xl"
                customStyle={styles.customLogin}
                onPress={() => navigation.navigate('Dashboard')}
              />
            </AppViewContainer>
            <Divider/>
            <AppButton
              text={"Log in with Facebook"}
              type="primary"
              height="md"
              icon="fb"
              customStyle={styles.customButton}
              onPress={() => facebookSignIn()}
            />
            <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      console.log(data.accessToken.toString())
                    }
                  )
                }
              }
            }
            onLogoutFinished={() => console.log("logout.")}/>
            <AppButton
              text={"Sign up with Google"}
              type="primary"
              height="md"
              icon="g"
              customStyle={styles.customButton}
              onPress={() => googleLogin().then(() => console.log('Signed in with Google!'))}
            />
            <View style={styles.cta}>
              <AppText textStyle="button2">Don't have an account? </AppText>
              <TouchableOpacity onPress={() => setAuthType('signup')}>
                <AppText textStyle="button2" customStyle={styles.link}>
                  Sign up
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </AppViewContainer>
      ) : (
        <SignUpWrapper />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: Colors.contentOcean,
  },
  caption: {
    color: Colors.contentPlaceholder,
    marginTop: 5
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputText: {
    marginBottom: 16,
  },
  customSpacing: {
    marginBottom: 16
  },
  customButton: {
    //change button color
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
    marginBottom: 16
  },
  customLogin: {
    marginTop: 25
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
    marginVertical: 16
  }
})

export default Login;
