import React, { createContext, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import ProfileInfoService from '@/services/Profile/ProfileInfo'
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'
export const UserContext = createContext(null)
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [userDataAvailable, setUserDataAvailable] = useState(false)
  const [providerData, setProviderData] = useState({})
  const [token, setToken] = useState(null)
  const [userStatus, setUserStatus] = useState({})

  let unsubscribe
  async function onAuthStateChanged(user) {
    if (user) {
      const { uid, displayName, email, providerData } = user
      setProviderData(providerData)
      setUser({
        uid: uid,
        displayName: displayName,
        email: email,
        date_joined: new Date(user.metadata.creationTime).getTime(),
      })

      unsubscribe = unsubscribe?.()
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
    if (user && !unsubscribe) {
      unsubscribe = firestore()
        .doc(`users/${user.uid}`)
        .onSnapshot(snap => {
          if (snap?.data())
            setUserInfo({
              ...snap.data(),
              date_joined: user.date_joined,
            })
        })
    }

    if (userInfo?.uid && !userStatus?.verified) updateUserStatus()
  }, [user])

  useEffect(() => {
    if (userInfo.uid) updateUserStatus()
  }, [userInfo])

  useEffect(() => {
    if (token && !userStatus.verified) updateUserStatus()
  }, [token])

  const updateUserStatus = async () => {
    try {
      if (token && !(await AsyncStorage.getItem('token')))
        await AsyncStorage.setItem('token', token)

      const response = await Api.getUserStatus({ uid: userInfo.uid })
      if (response.success)
        setUserStatus({
          ...userStatus,
          ...(response.status || {}),
        })
    } catch {}
  }

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
      setUserStatus({})
      setToken(null)
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('uid')
      unsubscribe?.()
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
        updateUserStatus,
      }}>
      {children}
    </UserContext.Provider>
  )
}
