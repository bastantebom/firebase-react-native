import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import AsyncStorage from '@react-native-community/async-storage';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [userDataAvailable, setUserDataAvailable] = useState(false);
  const [tokenState, setTokenState] = useState({});

  async function onAuthStateChanged(user) {
    if (user) {
      const { uid, displayName, email } = user;
      setUser({
        uid: uid,
        displayName: displayName,
        email: email,
      });
    }
    //if (!token)
    // Registration call: skip the first call with a flag.
    // User signed in: user from parameter is != null.
    // User signed out: user from parameter is == null.
    // Current user changes: user from parameter is != null and last user id is != user id from parameter
    // User token refresh: user from parameter is != null and last user id is == user id from parameter

    if (user && AsyncStorage.getItem('uid') !== user.uid) {
      const idToken = await auth().currentUser.getIdToken(true);
      await AsyncStorage.setItem('token', idToken);
      await AsyncStorage.setItem('uid', user.uid);
    } else {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('uid');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (user) {
      //console.log('pumasok pa din sa useEffect');
      ProfileInfoService.getUser(user.uid)
        .then((response) => {
          //console.log(response.data);
          // console.log("------------");
          // console.log(response);
          // console.log("------------");
          setUserInfo({ ...userInfo, ...response.data });
          setUserDataAvailable(true);
        })
        .catch((error) => {
          setUserDataAvailable(false);
        });
    }
  }, [user]);

  const fetch = () => {
    // console.log("Fetchfetch")
    if (user)
      ProfileInfoService.getUser(user.uid)
        .then((response) => {
          // console.log("------------x");
          // console.log(response);
          // console.log("------------x");
          setUserInfo({ ...userInfo, ...response.data });
          setUserDataAvailable(true);
        })
        .catch((error) => {
          setUserDataAvailable(false);
        });
  };

  const signOut = async () => {
    //setTokenState({});

    await auth()
      .signOut()
      .then(() => {
        setUser(null);
        setUserInfo({});
        //clear all Post context state
        console.log('User signed out');
      })
      .catch(function (error) {
        console.log('Error signing out', error);
      });
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        signOut: signOut,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        userDataAvailable: userDataAvailable,
        fetch: fetch,
      }}>
      {children}
    </UserContext.Provider>
  );
};
