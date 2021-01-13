import React from 'react'
import { View } from 'react-native'

import { AppText } from '@/components'

const Validator = ({
  errorState,
  setErrorState,
  value,
  style,
  customTextStyle,
  ...props
}) => {
  let textStyle = {
    display: errorState.shown ? 'flex' : 'none',
    ...customTextStyle,
  }

  return (
    <View style={style}>
      {props.children}
      <AppText color={'red'} customStyle={textStyle}>
        {errorState.message}
      </AppText>
    </View>
  )
}

export default Validator
