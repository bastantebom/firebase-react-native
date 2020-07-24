import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {AppText, AppButton} from '@/components';
import ProfileImageUpload from '@/components/ImageUpload/ProfileImageUpload';
import PostFilter from '@/components/PostFilter/PostFilter';

function Profile({ navigation }) {

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

  const currentUser = auth().currentUser.email;

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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <AppText textStyle="body1" > Sample Profile </AppText>
        <AppButton
          text={!user ? "Back to onboarding" : "Sign out"}
          onPress={() => signOut()}
          type="primary"
          size="sm"
        />

        <AppText>Welcome, {currentUser}</AppText>

        <View style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
          <ProfileImageUpload/>
          <PostFilter/>
        </View>
      </View>
    </ScrollView>
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