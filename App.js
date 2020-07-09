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

const App: () => React$Node = () => {
  useEffect(() => {
    // for splashscreen
    SplashScreen.hide();
  }, []);

<<<<<<< HEAD
  return (
    <Routes />
  )
}
=======
  return <Routes />;
};
>>>>>>> 1724c63b8b9a5cae6c3fc8ba8193ab3f9af12cf0
export default App;
