import React, { createContext, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import ProfileInfoService from '@/services/Profile/ProfileInfo'
import AsyncStorage from '@react-native-community/async-storage'

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [userInfo, setUserInfo] = useState({})
  const [userDataAvailable, setUserDataAvailable] = useState(false)
  const [token, setToken] = useState(null)
  const [userStatus, setUserStatus] = useState({})

  async function onAuthStateChanged(user) {
    if (user) {
      const { uid, displayName, email } = user
      setUser({
        uid: uid,
        displayName: displayName,
        email: email,
      })
    }
    if (user && AsyncStorage.getItem('uid') !== user.uid) {
      const idToken = await auth().currentUser.getIdToken(true)
      await AsyncStorage.setItem('token', idToken)
      await AsyncStorage.setItem('uid', user.uid)
      setToken(idToken)
    } else {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('uid')
      setToken(null)
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  useEffect(() => {
    if (user) {
      ProfileInfoService.getUser(user.uid)
        .then(response => {
          setUserInfo({ ...userInfo, ...response.data })
          setUserDataAvailable(true)
        })
        .catch(error => {
          setUserDataAvailable(false)
        })

      ProfileInfoService.getStatus(user.uid)
        .then(res => {
          setUserStatus({ ...userStatus, ...res.status.verified })
        })
        .catch(error => {
          console.log(error.message)
        })
    }
  }, [user])

  const fetch = () => {
    if (user)
      ProfileInfoService.getUser(user.uid)
        .then(response => {
          setUserInfo({ ...userInfo, ...response.data })
          setUserDataAvailable(true)
        })
        .catch(error => {
          setUserDataAvailable(false)
        })
  }

  const signOut = async () => {
    try {
      await auth().signOut()
      setUser(null)
      setUserInfo({})
      setToken(null)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        signOut,
        userInfo,
        setUserInfo,
        userStatus,
        setUserStatus,
        userDataAvailable,
        fetch,
        token,
      }}>
      {children}
    </UserContext.Provider>
  )
}
