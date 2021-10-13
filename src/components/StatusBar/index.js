import { useIsFocused } from '@react-navigation/native'
import React from 'react'
import { StatusBar as BaseStatusBar } from 'react-native'

const StatusBar = ({ ...props }) => {
  const isFocused = useIsFocused()

  return isFocused ? <BaseStatusBar {...props} /> : null
}

export default StatusBar
