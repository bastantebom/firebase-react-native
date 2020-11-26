import React from 'react'
import { Text, Dimensions, PixelRatio, StyleSheet } from 'react-native'
// import styles from './AppText.scss';
import { Colors, scaleFont, normalize } from '@/globals'

/**
 *
 * @param {listed on Apptext.scss} textStyle
 */

const AppText = ({
  children,
  textStyle,
  customStyle,
  color,
  numberOfLines,
}) => {
  let computedTextStyle = styles[textStyle]

  if (customStyle || color) {
    computedTextStyle = {
      ...computedTextStyle,
      color: color ? color : Colors.contentEbony,
      ...customStyle,
    }
  }

  // console.log(color)

  return (
    <Text style={computedTextStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

// first value is 14
const defaultFontSize = 14

const styles = StyleSheet.create({
  body1: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize + 2),
    letterSpacing: 0.5,
  },

  body1medium: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize + 2),
    letterSpacing: 0.5,
  },

  body2: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 0.25,
  },

  body2medium: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 0.25,
  },

  caption: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.4,
  },

  body2Dashboard: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 0.25,
  },
  captionDashboard: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.4,
  },

  caption2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.4,
  },

  body3: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize + 2),
    letterSpacing: 0.25,
  },
  button1: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  button2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 1.25,
  },
  button3: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 1.25,
  },

  captionConstant: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: 0.4,
  },
  caption2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.4,
  },
  display1: {
    fontFamily: 'RoundedMplus1c-Light',
    fontSize: normalize(56),
    letterSpacing: -1.5,
  },
  display2: {
    fontFamily: 'RoundedMplus1c-Light',
    fontSize: normalize(48),
    letterSpacing: -0.5,
  },
  display3: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(40),
    letterSpacing: 0,
  },
  display4: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(32),
    letterSpacing: 0.25,
  },
  display5: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(24),
    letterSpacing: 0,
  },
  display6: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize + 6),
    letterSpacing: 0.15,
  },
  eyebrow1: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize - 4),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  eyebrow2: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.8,
  },
  price: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize - 2),
    lineHeight: 18,
  },
  subtitle1: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize + 4),
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 0.1,
  },
  subtitle2constant: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.1,
  },
  promo: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(defaultFontSize - 2),
    letterSpacing: 0.4,
  },
  tabNavigation: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize),
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  metadata: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(defaultFontSize - 4),
    letterSpacing: 0.8,
  },
  nav: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(13),
  },
})

export default AppText
