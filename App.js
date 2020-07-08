/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Routes from './Routes';
import SplashScreen from 'react-native-splash-screen';

const App: () => React$Node = () => {

  useEffect(() => {
    // for splashscreen
    SplashScreen.hide();
  }, []);

  return (
    <Routes />
  )
}

export default App;
