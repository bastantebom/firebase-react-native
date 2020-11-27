import React from 'react'
import { View } from 'react-native'

import { ScreenHeaderTitle } from '@/components'

import { normalize } from '@/globals'

const GrabPayModal = ({ closeModal }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: normalize(20),
      }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="GrabPay"
        iconSize={normalize(16)}
      />
    </View>
  )
}
export default GrabPayModal
