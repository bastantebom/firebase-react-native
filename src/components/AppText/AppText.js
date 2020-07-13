import React from 'react';
import { Text, Platform } from 'react-native';
import styles from './AppText.scss';

const AppText = ({ children, textStyle, customStyle }) => {
  let computedTextStyle = styles[textStyle];

  if (customStyle) {
    computedTextStyle = {
      ...computedTextStyle,
      ...customStyle,
    };
  }

  // if (Platform.OS === 'ios') {
  //   let fontFamily = computedTextStyle['fontFamily'];
  //   let newFontFamily = fontFamily.replace("MPLUSRounded1c", "RoundedMplus1c");


  //   if (newFontFamily) {
  //     computedTextStyle = {
  //       ...computedTextStyle,
  //       fontFamily: newFontFamily
  //     }
  //   }
  // }

  return <Text style={computedTextStyle}>{children}</Text>;
};

export default AppText;
