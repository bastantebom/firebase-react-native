import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <LottieView
          source={require('./assets/Servbees-splash.json')}
          autoPlay
        />
        <View style={styles.textContainer}>
          <AppText>© Copyright Servbees 2020.</AppText>
          <AppText>All rights reserved</AppText>
          <AppText>www.servbees.com</AppText>
        </View>
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
