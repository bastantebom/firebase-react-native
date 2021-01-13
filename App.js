/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'
import React, { useEffect } from 'react'

import Routes from './Routes'
import SplashScreen from 'react-native-splash-screen'
import { ContextProvider } from '@/context'
import { UserContextProvider } from '@/context/UserContext'
//import {ProfileInfoContextProvider} from '@/context/ProfileInfoContext';

const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <UserContextProvider>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </UserContextProvider>
  )
}
export default App
