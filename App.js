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

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 3000)
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
