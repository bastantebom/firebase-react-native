import React from 'react'
import { Text, StyleSheet } from 'react-native'

import { normalize } from '@/globals'

const HyperLink = ({ children, onPress, ...props }) => {
  return (
    <Text style={styles.hyperlink} onPress={onPress} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  hyperlink: {
    fontFamily: 'RoundedMplus1c-Regular',
    color: '#3781FC',
    lineHeight: normalize(21),
    fontSize: normalize(18),
  },
})

export default HyperLink
