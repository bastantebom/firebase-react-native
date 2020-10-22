import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import AsyncStorage from '@react-native-community/async-storage';

export const UserContext = createContext(null);

export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [userDataAvailable, setUserDataAvailable] = useState(false);
  const [tokenState, setTokenState] = useState({});

  async function onAuthStateChanged(user) {
    if (user) {
      const {uid, displayName, email} = user;
      setUser({
        uid: uid,
        displayName: displayName,
        email: email,
      });
    }
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
      ProfileInfoService.getUser(user.uid)
        .then((response) => {
          setUserInfo({...userInfo, ...response.data});
          setUserDataAvailable(true);
        })
        .catch((error) => {
          setUserDataAvailable(false);
        });
    }
  }, [user]);

  const fetch = () => {
    if (user)
      ProfileInfoService.getUser(user.uid)
        .then((response) => {
          setUserInfo({...userInfo, ...response.data});
          setUserDataAvailable(true);
        })
        .catch((error) => {
          setUserDataAvailable(false);
        });
  };

  const signOut = async () => {
    await auth()
      .signOut()
      .then(() => {
        setUser(null);
        setUserInfo({});
        //to do clear all post state
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
