import React from 'react'
import { View, StyleSheet, Text, Animated } from 'react-native'

import { normalize, Colors } from '@/globals'
import utilStyles from '@/globals/util-styles'

const Dialog = ({ children, title, description }) => {
  return (
    <View style={styles.container}>
      <Animated.View style={styles.animatedView}>
        <View
          style={[
            utilStyles.justifyCenter,
            utilStyles.alignCenter,
            styles.titleWrapper,
          ]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  animatedView: {
    padding: normalize(24),
  },
  titleWrapper: {
    marginBottom: normalize(32),
    marginTop: normalize(15),
  },
  title: {
    color: Colors.contentEbony,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: 0.15,
    fontFamily: 'RoundedMplus1c-Medium',
  },
  description: {
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    textAlign: 'center',
    lineHeight: normalize(21),
    letterSpacing: 0.25,
  },
})

export default Dialog
