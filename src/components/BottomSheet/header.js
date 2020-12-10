import React from 'react'
import { Dimensions, View } from 'react-native'

import { normalize } from '@/globals'
const width = Dimensions.get('window').width

const bottomSheetHeader = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: '#EAEAEA',
          width: normalize(width * 0.35),
          height: 5,
          marginVertical: 8,
          borderRadius: 100,
        }}
      />
    </View>
  )
}

export default bottomSheetHeader
