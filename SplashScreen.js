import React, { useState, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'
import LottieView from 'lottie-react-native'

import { AppText } from '@/components'
import { Colors } from '@/globals'

const SplashScreenComponent = () => {
  const [copyrightOpacity] = useState(new Animated.Value(0))
  const [containerOpacity] = useState(new Animated.Value(1))

  useEffect(() => {
    Animated.sequence([
      Animated.timing(copyrightOpacity, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  let copyrightAnimationStyle = {
    opacity: copyrightOpacity,
  }

  let fadingAnimationStyle = {
    opacity: containerOpacity,
  }

  return (
    <Animated.View style={[styles.container, fadingAnimationStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <LottieView
          source={require('./assets/servbees-splash-tm.json')}
          autoPlay
        />
        <Animated.View style={[styles.textContainer, copyrightAnimationStyle]}>
          <AppText textStyle="body2">
            © Copyright Servbees {new Date().getFullYear()}.
          </AppText>
          <AppText textStyle="body2">All rights reserved</AppText>
          <AppText
            textStyle="metadata"
            customStyle={{ marginTop: 24, marginBottom: 16 }}>
            www.servbees.com
          </AppText>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  )
}

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryYellow,
    height: height,
    width: width,
    position: 'absolute',
    top: 0,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {
    alignItems: 'center',
  },
})

export default SplashScreenComponent
