/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'

import Routes from './Routes'
import SplashScreen from 'react-native-splash-screen'
import { ContextProvider } from '@/context'
import { UserContextProvider } from '@/context/UserContext'
//import {ProfileInfoContextProvider} from '@/context/ProfileInfoContext';

const App = () => {
  const [hideSplash, setHideSplash] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setHideSplash(true)
    }, 3000)
  }, [])

  useEffect(() => {
    hideSplash && SplashScreen.hide()
  }, [hideSplash])

  return (
    <UserContextProvider>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </UserContextProvider>
  )
}
export default App
