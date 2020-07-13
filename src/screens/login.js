import React, {useState} from 'react';
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
              text="Log in with Facebook"
              type="primary"
              height="md"
              icon="fb"
              customStyle={styles.customButton}
            />
            <AppButton
              text="Sign up with Google"
              type="primary"
              height="md"
              icon="g"
              customStyle={styles.customButton}
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
