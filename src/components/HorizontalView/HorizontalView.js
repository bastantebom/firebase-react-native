import React from 'react'
import { View } from 'react-native'

const HorizontalView = props => {
  const { children, style } = props

  return <View style={[{ flexDirection: 'row' }, style]}>{children}</View>
}

export default HorizontalView
