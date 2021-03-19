import { BottomSheetHeader } from '@/components'
import { normalize } from '@/globals'
import React from 'react'
import { StyleSheet, View } from 'react-native'

/**
 * @param {object} props
 **/
const Drawer = ({ children }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
})

export default Drawer
