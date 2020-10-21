/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import Routes from './Routes';
import SplashScreen from 'react-native-splash-screen';
import {ContextProvider} from '@/context';
import {UserContextProvider} from '@/context/UserContext';
//import {ProfileInfoContextProvider} from '@/context/ProfileInfoContext';

import * as Sentry from '@sentry/react-native';

const App = () => {
  useEffect(() => {
    Sentry.init({
      dsn:
        'https://ff803f5e9a764826bff1ead2ec4df273@o444622.ingest.sentry.io/5419731',
    });

    SplashScreen.hide();
  }, []);

  return (
    <UserContextProvider>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </UserContextProvider>
  );
};
export default App;
