import { Colors } from '.'
import { normalize } from './Utils'

const { StyleSheet } = require('react-native')

const typography = StyleSheet.create({
  medium: {
    fontFamily: 'RoundedMplus1c-Medium',
  },
  regular: {
    fontFamily: 'RoundedMplus1c-Regular',
  },
  light: {
    fontFamily: 'RoundedMplus1c-Light',
  },
  body1: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    letterSpacing: normalize(0.5),
    color: Colors.contentEbony,
  },
  body1narrow: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    letterSpacing: normalize(-0.5),
    color: Colors.contentEbony,
  },
  body2: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(0.25),
    color: Colors.contentEbony,
  },
  body2narrow: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(-0.25),
    color: Colors.contentEbony,
  },
  display1: {
    fontFamily: 'RoundedMplus1c-Light',
    fontSize: normalize(56),
    lineHeight: normalize(83),
    letterSpacing: normalize(-1.5),
    color: Colors.contentEbony,
  },
  display2: {
    fontFamily: 'RoundedMplus1c-Light',
    fontSize: normalize(48),
    lineHeight: normalize(71),
    letterSpacing: normalize(-0.5),
    color: Colors.contentEbony,
  },
  display3: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(40),
    lineHeight: normalize(59),
    color: Colors.contentEbony,
  },
  display4: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(32),
    lineHeight: normalize(48),
    color: Colors.contentEbony,
  },
  display5: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(24),
    lineHeight: normalize(36),
    color: Colors.contentEbony,
  },
  display6: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
    color: Colors.contentEbony,
  },
  display7: {
    fontFamily: 'Rounded Mplus 1c',
    fontSize: normalize(16),
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: normalize(0.02),
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  eyebrow: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(10),
    lineHeight: normalize(15),
    letterSpacing: normalize(0.8),
    color: Colors.contentEbony,
  },
  subtitle1: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(18),
    lineHeight: normalize(27),
    letterSpacing: normalize(0.15),
    color: Colors.contentEbony,
  },
  subtitle2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.1),
    color: Colors.contentEbony,
  },
  caption: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.4),
    color: Colors.contentEbony,
  },
  button: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(1.25),
    color: Colors.contentEbony,
    textTransform: 'uppercase',
  },
  button2: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(1.25),
    color: Colors.contentEbony,
  },
  button3: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(1.25),
    color: Colors.contentEbony,
  },
  link: {
    color: Colors.link,
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  metadata: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: normalize(0.8),
  },
  uppercase: {
    textTransform: 'uppercase',
  },
})

export default typography
