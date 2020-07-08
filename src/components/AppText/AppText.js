import React from 'react';
import { Text } from 'react-native';
import styles from './AppText.scss'

const AppText = ({ children, textStyle, customStyle }) => {
<<<<<<< HEAD
=======
  let computedTextStyle = styles[textStyle];
>>>>>>> added custom style for AppText center aligned text

  if (customStyle) {
    computedTextStyle = {
      ...computedTextStyle,
      ...customStyle
    }
  }

<<<<<<< HEAD
    if (customStyle) {
        computedTextStyle = {
            ...computedTextStyle,
            ...customStyle
        }
    }

    return (
        <Text style={computedTextStyle}>{children}</Text>
    )
=======
  return (
    <Text style={computedTextStyle}>{children}</Text>
  )
>>>>>>> added custom style for AppText center aligned text
}

export default AppText