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
import GlobalFont from 'react-native-global-font'



const App: () => React$Node = () => {

  useEffect(() => {
    // for splashscreen
    SplashScreen.hide();

    // for global fonts
    let fontName = 'MPLUSRounded1c-Regular'
    GlobalFont.applyGlobal(fontName)

    console.log(GlobalFont.applyGlobal('MPLUSRounded1c-Regular'))
  }, []);

  return(
    <Routes/>
  )
}
export default App;