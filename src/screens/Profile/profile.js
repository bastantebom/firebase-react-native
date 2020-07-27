import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Button
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {AppText, AppButton} from '@/components';
import ImageUpload from '@/components/ImageUpload/ProfileImageUpload';
import HexagonBorder from '@/components/ImageUpload/HexagonBorder'
import PostFilter from '@/components/Post/PostFilter';

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
      {/* <AppButton
        text="Hives"
        onPress={() => navigation.navigate('ProfileHives')}
        type="tertiary"
        size="sm"
      /> */}
      <AppText>Welcome, {currentUser}</AppText>
      <ImageUpload size={120} />
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