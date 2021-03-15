import React from 'react'
import { StyleSheet } from 'react-native'

/**
 * @param {object} props
 */
const Banner = ({ children, containerStyle }) => {
  return <View style={[styles.wrapper, containerStyle]}>{children}</View>
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
})

export default Banner
