import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import ProfileInfoService from '@/services/Profile/ProfileInfo';

export const UserContext = createContext(null);

export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [userDataAvailable, setUserDataAvailable] = useState(false);

  function onAuthStateChanged(user) {
    if (user) {
      const {uid, displayName, email} = user;
      setUser({
        uid: uid,
        displayName: displayName,
        email: email,
      });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (user) {
      console.log('pumasok pa din sa useEffect');
      ProfileInfoService.getUser(user.uid)
        .then((response) => {
          setUserInfo({...userInfo, ...response});
          setUserDataAvailable(true);
        })
        .catch((error) => {
          setUserDataAvailable(false);
        });
    }
  }, [user]);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
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
      }}>
      {children}
    </UserContext.Provider>
  );
};
