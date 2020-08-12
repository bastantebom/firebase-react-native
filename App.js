/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {AppText} from '@/components';

import Routes from './Routes';
import SplashScreen from 'react-native-splash-screen';
import {ContextProvider} from '@/context';
import {UserContextProvider} from '@/context/UserContext';

const App: () => React$Node = () => {
  useEffect(() => {
    // for splashscreen
    SplashScreen.hide();

    setTimeout(() => {
      setShowSplash(false);
    }, 2000);
  }, []);

  const [showSplash, setShowSplash] = useState(true);

  const SplashScreenComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText>SPLASH SCREEN</AppText>
      </View>
    );
  };

  // if (showSplash) return <SplashScreenComponent />;

  return (
    <UserContextProvider>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </UserContextProvider>
  );
};
export default App;
