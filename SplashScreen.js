import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';

const SplashScreenComponent = () => {
  const [copyrightOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(copyrightOpacity, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();
  }, []);

  let copyrightAnimationStyle = {
    opacity: copyrightOpacity,
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <LottieView
          source={require('./assets/Servbees-splash.json')}
          autoPlay
        />
        <Animated.View style={[styles.textContainer, copyrightAnimationStyle]}>
          <AppText textStyle="body2">© Copyright Servbees 2020.</AppText>
          <AppText textStyle="body2">All rights reserved</AppText>
          <AppText
            textStyle="metadata"
            customstyle={{marginTop: 24, marginBottom: 8}}>
            www.servbees.com
          </AppText>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryYellow,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {
    alignItems: 'center',
  },
});

export default SplashScreenComponent;
