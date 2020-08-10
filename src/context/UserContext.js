import React, { createContext, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  
  const initialState = {
    uid: '',
    email: '',
    displayName: '',
    isSignedOut: undefined,
  }

  const [users, setUsers] = useState(initialState);
  const user = auth().currentUser;
  
  const onAuthStateChanged = () => {
    if (user) {
      fetchProfile(user);
      // console.log(user);
    } 
    return null
  }

  const fetchProfile = () => {
    if (user) {
      setUsers({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    }
  }

  const signOut = async () => {
    // if (user) {
    await
    auth()
    .signOut()
    .then(function() {
      setUsers({
        ...initialState
      })
      console.log('User signed out')
    }).catch(function(error) {
      console.log('Error signing out', error);
    });
    // }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    onAuthStateChanged();
    return subscriber; 
  }, [])

  return (
    <UserContext.Provider 
      value={{ 
        user: users,
        isLoggedIn: user,
        signOut: signOut
      }} 
    >
      {children}
    </UserContext.Provider>
  )
}