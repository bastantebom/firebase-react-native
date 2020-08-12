import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';

import {AppText} from '@/components';

const SplashScreenComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText>SPLASH SCREEN</AppText>
    </View>
  );
};

export default SplashScreenComponent;
