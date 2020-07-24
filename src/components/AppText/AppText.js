import React from 'react';
import { Text, Dimensions, Platform } from 'react-native';
import styles from './AppText.scss';
import { Colors } from '@/globals'

/**
 * 
 * @param {listed on Apptext.scss} textStyle
 */

const AppText = ({ children, textStyle, customStyle, color }) => {
  let computedTextStyle = styles[textStyle];

  if (customStyle) {
    computedTextStyle = {
      ...computedTextStyle,
      ...customStyle,
      color: color ? color : Colors.contentEbony
    };
  }

  if (Platform.OS === 'android') {
    console.log(Dimensions.get('window').height)
    console.log(Dimensions.get('window').width)
  }

  return <Text style={computedTextStyle}>{children}</Text>;
};

export default AppText;
