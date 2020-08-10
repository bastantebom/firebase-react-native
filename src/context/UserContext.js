import React, { createContext, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    if (user) {
      const { uid, displayName, email} = user
      setUser({
        uid: uid,
        displayName: displayName,
        email: email
      });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    console.log(user)
  }, [user])

  const signOut = () => {
    auth()
    .signOut()
    .then(() => {
      setUser(null);
      console.log('User signed out')
    }).catch(function(error) {
      console.log('Error signing out', error);
    });
  };

  return (
    <UserContext.Provider 
      value={{ 
        user: user,
        signOut: signOut
      }} 
    >
      {children}
    </UserContext.Provider>
  )
}