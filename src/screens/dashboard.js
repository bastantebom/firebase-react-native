import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {AppButton, AppText} from '@/components';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function Dashboard({ navigation }) {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  const signOut = () => {
    if (user) {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'))
    } else {
      navigation.navigate('Onboarding');
    }
  }

  const currentUser = auth()?.currentUser?.email ? auth().currentUser.email : "guest";

  return (

    <View style={styles.container}>
      <AppText textStyle="body1" > {!user ? "Guest" : "Member"} Dashboard </AppText>
      <AppButton
        text={!user ? "Back to onboarding" : "Sign out"}
        onPress={() => signOut()}
        type="primary"
        size="sm"
      />
      {user ? (
        <AppButton
          text="Go to profile"
          onPress={() => navigation.navigate('Profile')}
          type="primary"
          size="sm"
        />
      ) : <></>}
      <AppButton
        text="Go to Reset Password screen"
        onPress={() => navigation.navigate('ResetPassword')}
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