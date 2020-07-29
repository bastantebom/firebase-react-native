import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Button
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

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

  const currentUser = auth().currentUser;

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState('')

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const imageRef = storage()
    .ref(`${currentUser.uid}/display-photos/`); //get current image
      imageRef
        .getDownloadURL()
        .then((url) => {
          setProfileImageUrl(url)
        })
        .catch((e) => 
        console.log('Error => ', e)
      );
    
  const signOut = () => {
    if (user) {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'))
    } else {
      navigation.navigate('Onboarding');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;


  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Profile </AppText>
      <AppButton
        text="Go back to dashboard"
        onPress={() => navigation.goBack()}
        type="primary"
        size="sm"
      />
      <AppButton
        text="Hives"
        onPress={() => navigation.navigate('ProfileHives')}
        size="sm"
      />
      <AppText>Welcome, {currentUser.email}</AppText>
      <ImageUpload size={120} />
      <HexagonBorder imgSrc={profileImageUrl} size={150} />

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