import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {
  AppText,
  AppButton,
  ProfileImageUpload,
  HexagonBorder,
  TransparentHeader,
} from '@/components';
import PostFilter from '@/components/Post/PostFilter';

import {ProfileHeaderDefault} from '@/assets/images';
import {normalize} from '@/globals';

function Profile({navigation}) {
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
  const [ellipsisState, setEllipsisState] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menu, setMenu] = useState(false);

  const [headerState, setHeaderState] = useState('own');

  const changeHeaderHandler = () => {
    headerState === 'own' ? setHeaderState('other') : setHeaderState('own');
  };

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState);
  };

  const toggleFollowing = () => {
    setFollowing(!following);
  };

  const toggleMenu = () => {
    setMenu(!menu);
  };

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
        .then(() => console.log('User signed out!'));
    } else {
      navigation.navigate('Onboarding');
    }
  };

  const width = Dimensions.get('window').width;

  return (
    <>
      <TransparentHeader
        type={headerState}
        ellipsisState={ellipsisState}
        toggleEllipsisState={toggleEllipsisState}
        toggleFollowing={toggleFollowing}
        following={following}
        toggleMenu={toggleMenu}
        menu={menu}
        signOut={signOut}
      />
      <View style={{backgroundColor: 'red', height: normalize(158)}}>
        <ProfileHeaderDefault
          width={normalize(375 * 1.2)}
          height={normalize(158 * 1.2)}
        />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <AppText textStyle="body1"> Sample Profile </AppText>
          <AppButton
            text="Go back to dashboard"
            onPress={() => navigation.goBack()}
            type="primary"
            size="sm"
          />
          <AppText>Welcome, {currentUser}</AppText>
          <ProfileImageUpload />
          <HexagonBorder />

          <Button title="Change header" onPress={changeHeaderHandler} />
          <Button title="sign out" onPress={signOut} />
          <Button title="show bottom modal" onPress={toggleEllipsisState} />
        </View>
      </ScrollView>
    </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
    // justifyContent: 'center',
  },
});
