import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import auth from '@react-native-firebase/auth';
import ResetPasswordScreen from '@/screens/resetPassword';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function Dashboard({ navigation }) {

  const signOut = () => {
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));
  }

  const currentUser = auth().currentUser.email;

  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Dashboard </AppText>
      <AppButton
        text="Sign out"
        onPress={() => signOut()}
        type="primary"
        size="sm"
      />
      <AppButton
        text="Go to profile"
        onPress={() => navigation.push('Profile')}
        type="primary"
        size="sm"
      />

      <AppText>Welcome, {currentUser}</AppText>

      {/* <AppButton
        text="Go back to onboarding"
        onPress={() => navigation.goBack()}
        type="primary"
        size="sm"
      />

      <AppButton
        text="Go to reset password screen"
        onPress={() => navigation.push("ResetPassword")}
        type="primary"
        size="sm"
      /> */}
    </View>
  )
}

export default Dashboard;