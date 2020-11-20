import React, { createContext, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import ProfileInfoService from '@/services/Profile/ProfileInfo'
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'
export const UserContext = createContext(null)
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [userInfo, setUserInfo] = useState({})
  const [userDataAvailable, setUserDataAvailable] = useState(false)
  const [providerData, setProviderData] = useState({})
  const [token, setToken] = useState(null)
  const [userStatus, setUserStatus] = useState({})
  const [initUserInfo, setInitUserInfo] = useState(false)

  async function onAuthStateChanged(user) {
    if (user) {
      const { uid, displayName, email, providerData } = user
      setProviderData(providerData)
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
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  useEffect(() => {
    if (user && !initUserInfo) {
      setInitUserInfo(true)
      firestore()
        .doc(`users/${user.uid}`)
        .onSnapshot(async snap => {
          if (snap?.data()) {
            setUserInfo(snap?.data())
            const response = await Api.getUserStatus({ uid: user.uid })
            setUserStatus({
              ...userStatus,
              ...(response.status || {}),
            })
          }
        })
    }
  }, [user])

  const fetch = () => {
    if (user) {
      ProfileInfoService.getUser(user.uid)
        .then(response => {
          setUserInfo({ ...userInfo, ...response.data })
          setUserDataAvailable(true)
        })
        .catch(error => {
          setUserDataAvailable(false)
        })
    }
  }

  const signOut = async () => {
    try {
      await auth().signOut()
      setUser(null)
      setUserInfo({})
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('uid')
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
        userDataAvailable,
        fetch,
        token,
        providerData,
      }}>
      {children}
    </UserContext.Provider>
  )
}
