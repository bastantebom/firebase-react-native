import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore'

export const UserContext = createContext(null)
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [providerData, setProviderData] = useState({})
  const [token, setToken] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState({})
  const [unavailableNetwork, setUnavailableNetwork] = useState(false)
  const [counts, setCounts] = useState({})
  const unsubscribe = useRef(null)

  const onAuthStateChanged = useCallback(
    async user => {
      try {
        if (user) {
          const { uid, displayName, email, providerData } = user
          setProviderData(providerData)
          setUser({
            uid: uid,
            displayName: displayName,
            email: email,
          })

          const idToken = await auth().currentUser.getIdToken(true)
          await AsyncStorage.setItem('token', idToken)
          await AsyncStorage.setItem('uid', user.uid)
          await AsyncStorage.setItem('token-timestamp', Date.now().toString())
          setToken(idToken)
        }
      } catch (error) {
        console.log(error)
        if (error.message.includes('auth/network-request-failed'))
          setUnavailableNetwork(true)
      }
    },
    [
      setProviderData,
      setUser,
      setToken,
      setUnavailableNetwork,
      unsubscribe.current,
    ]
  )

  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged)
  }, [])

  useEffect(() => {
    if (user && !unsubscribe.current) {
      const subscribers = []
      subscribers.push(
        firestore()
          .doc(`users/${user.uid}`)
          .onSnapshot(snap => {
            if (snap?.data()) setUserInfo(snap.data())
          })
      )

      subscribers.push(
        firestore()
          .doc(`account_verifications/${user.uid}`)
          .onSnapshot(snap => {
            if (snap?.data()) setVerificationStatus(snap.data())
          })
      )

      subscribers.push(
        firestore()
          .doc(`counts/${user.uid}`)
          .onSnapshot(snap => {
            setCounts(snap?.data() || {})
          })
      )

      unsubscribe.current = () => {
        subscribers.forEach(subscriber => subscriber())
        return null
      }
    }
  }, [user, unsubscribe.current])

  const signOut = async () => {
    try {
      setToken(null)
      setUser(null)
      setUserInfo({})
      setVerificationStatus({})
      unsubscribe.current?.()
      await Promise.all([
        auth().signOut(),
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('uid'),
      ])
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
        verificationStatus,
        token,
        providerData,
        unavailableNetwork,
        counts,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const checkToken = async () => {
  try {
    const timestamp = await AsyncStorage.getItem('token-timestamp')
    if (
      timestamp &&
      Date.now() - +timestamp >= 3600 * 1000 &&
      auth().currentUser
    ) {
      const idToken = await auth().currentUser.getIdToken(true)
      const tokenTimestamp = Date.now().toString()
      await AsyncStorage.setItem('token', idToken)
      await AsyncStorage.setItem('token-timestamp', tokenTimestamp)
    }
  } catch (error) {
    console.log(error)
  }
}
