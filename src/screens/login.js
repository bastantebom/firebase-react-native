import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import AppText from '../components/AppText/AppText'
import AppInput from '../components/AppInput/AppInput'
import AppButton from '../components/AppButton'
import Colors from '../globals/Colors';
import { useNavigation } from '@react-navigation/native';

function Login() {

  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <AppText textStyle="display5">Welcome back!</AppText>
        <AppText textStyle="caption">Log in to get going, Buzzybee.</AppText>
        <AppInput 
          label="Email or Mobile Number" 
        />
        <AppInput
          label="Password"
        />
        <AppButton
          text="Log In"
          type="primary"
          onPress={() => navigation.navigate('Dashboard')}
        />
        <View style={styles.cta}>
          <AppText textStyle="button2">New to Servbees? </AppText>
          <TouchableOpacity>
            <AppText textStyle="button2" customStyle={styles.link}>Sign up</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24
  },
  link: {
    color: Colors.contentOcean
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  inputText: {
    fontFamily: 'MPLUSRounded1c-Regular',
    fontSize: 25,
    letterSpacing: .5,
  }
})

export default Login;