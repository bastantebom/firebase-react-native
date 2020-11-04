import React from 'react'
import { Divider } from 'react-native-paper'
import { GlobalStyle } from '@/globals'

const newDivider = props => {
  return (
    <Divider
      style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]}
      {...props}
    />
  )
}
export default newDivider
