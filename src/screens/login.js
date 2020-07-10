import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import AppText from '../components/AppText/AppText'
import AppInput from '../components/AppInput/AppInput'
import AppButton from '../components/AppButton'
import Colors from '../globals/Colors';
import { useNavigation } from '@react-navigation/native';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

function Login() {

  const navigation = useNavigation();

  return (
    <AppViewContainer 
      paddingSize={3}
    >
      <View style={styles.container}>
        <AppText textStyle="display5">Welcome back!</AppText>
        <AppText textStyle="caption" customStyle={styles.caption}>Log in to get going, Buzzybee.</AppText>
        <AppInput 
          label="Email or Mobile Number" 
        />
        <AppInput
          label="Password"
        />
        <TouchableOpacity>
          <AppText textStyle="caption" customStyle={styles.caption}>Forgot Password?</AppText>
        </TouchableOpacity>
        <AppButton
          text="Log In"
          type="primary"
          onPress={() => navigation.navigate('Dashboard')}
        />
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
          <TouchableOpacity>
            <AppText textStyle="button2" customStyle={styles.link}>Sign up</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </AppViewContainer>
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
    fontFamily: 'MPLUSRounded1c-Regular',
    fontSize: 25,
    letterSpacing: .5,
  },
  customButton: {
    //change button color 
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable
  }
})

export default Login;