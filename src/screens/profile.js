import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Button
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {AppText, AppButton} from '@/components';
import ProfileImageUpload from '@/components/ImageUpload/ProfileImageUpload';
import PostFilter from '@/components/PostFilter/PostFilter';

function Profile({ navigation }) {

  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber;
  // }, []);

  // if (initializing) return null;

  const currentUser = auth().currentUser.email;

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


  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Profile </AppText>
      <AppButton
        text="Go back to dashboard"
        onPress={() => navigation.goBack()}
        type="primary"
        size="sm"
      />
      <AppText>Welcome, {currentUser}</AppText>
      <ImageUpload />
      <HexagonBorder />

      <Button title="hello" onPress={signOut} />
    </View>
  )
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
})