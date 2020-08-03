import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Platform,
} from 'react-native';
import styles from './AppViewContainer.scss';

/**
 * margin size(none): default(0)
 * margin size(xs): 4
 * margin size(1): 1 x 8
 * margin size(2): 2 x 8
 * margin size(3): 3 x 8
 * margin size(4): 4 x 8
 * margin size(5): 5 x 8
 * margin size(6): 6 x 8
 * margin size(7): 7 x 8
 * margin size(8): 8 x 8
 * margin size(9): 9 x 8
 * margin size(10): 10 x 8
 *
 */

const MarginView = ({children, marginSize, style}) => {
  let computedStyles = StyleSheet.create({
    margin: 0,
  });

  // compute margin size
  computedStyles.margin = marginSize
    ? marginSize === 'xs'
      ? 4
      : marginSize * 8
    : 0;

  if (style) {
    computedStyles = {
      ...computedStyles,
      ...style,
    };
  }

  return <View style={computedStyles}>{children}</View>;
};

export default MarginView;
