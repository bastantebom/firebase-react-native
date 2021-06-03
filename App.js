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
import * as Sentry from '@sentry/react-native'
import { APP_ENV } from '@env'
import Toast from '@/components/toast'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const App = () => {
  useEffect(() => {
    SplashScreen.hide()

    if (APP_ENV === 'production')
      Sentry.init({
        dsn:
          'https://88ccd3662f0e450fb143363e346d9a9c@o503038.ingest.sentry.io/5587548',
      })
  }, [])

  return (
    <UserContextProvider>
      <ContextProvider>
        <Toast
          containerStyle={{ marginTop: getStatusBarHeight() }}
          ref={ref => Toast.setRef(ref, 'root')}
        />
        <Routes />
      </ContextProvider>
    </UserContextProvider>
  )
}
export default App
