import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import AppText from '../components/AppText/AppText'
import AppInput from '../components/AppInput/AppInput'
import AppButton from '../components/AppButton'
import Colors from '../globals/Colors';
import { useNavigation } from '@react-navigation/native';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
import SignUp from './SignUp'

function Divider() {
  return (
    <View style={styles.dividerWrapper}>
      <View style={styles.divider} />
      <AppText textStyle="body1" customStyle={styles.dividerText}>or</AppText>
    </View>
  )
}

function Login() {

  const navigation = useNavigation();
  const [ authType, setAuthType ] = useState('login'); 

  return (
    <>
      { authType === 'login' ? (
        <AppViewContainer paddingSize={3}>
          <View style={styles.container}>
            <AppText textStyle="display5">Welcome back!</AppText>
            <AppText textStyle="caption" customStyle={styles.caption}>
              Log in to get going, Buzzybee.
            </AppText>
            <AppViewContainer 
              paddingSize={4}
              customStyle={{ paddingHorizontal: 0 }}
            >
              <AppInput 
                label="Email or Mobile Number" 
                propsInputCustomStyle={styles.inputText}
              />
              <AppInput
                label="Password"
                propsInputCustomStyle={styles.inputText}
              />
              <TouchableOpacity>
                <AppText textStyle="caption" customStyle={styles.caption}>Forgot Password?</AppText>
              </TouchableOpacity>
              <AppButton
                text="Log In"
                type="primary"
                onPress={() => navigation.navigate('Dashboard')}
              />
            </AppViewContainer>
            {/* <Divider/> */}
            <AppButton
              text="Log In with Facebook"
              type="primary"
              propsButtonCustomStyle={styles.customButton}
            />
            <AppButton
              text="Sign up with Google"
              type="primary"
              propsButtonCustomStyle={styles.customButton}
            />
            <View style={styles.cta}>
              <AppText textStyle="button2">New to Servbees? </AppText>
              <TouchableOpacity onPress={() => setAuthType('signup')}>
                <AppText textStyle="button2" customStyle={styles.link}>Sign up</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </AppViewContainer>
      ) : (
        <SignUp/>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  link: {
    color: Colors.contentOcean
  },
  caption: {
    color: Colors.contentPlaceholder
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  inputText: {
    marginBottom: 16
  },
  customButton: {
    //change button color 
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable
  },
  divider: {
    position: 'relative',
    borderWidth: 1,
    width: '100%',
    borderColor: '#000',
    zIndex: 0
  },
  dividerText: {
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    // textAlign: 'center'
  }
})

export default Login;