import React from 'react';
import {Text} from 'react-native';
import styles from './AppViewContainer.scss';

/**
 * padding size(none): default(0) 
 * padding size(xs): 4
 * padding size(1): 1 x 8
 * padding size(2): 2 x 8
 * padding size(3): 3 x 8
 * padding size(4): 4 x 8
 * padding size(5): 5 x 8
 * padding size(6): 6 x 8
 * padding size(7): 7 x 8
 * padding size(8): 8 x 8
 * padding size(9): 9 x 8
 * padding size(10): 10 x 8
 * 
 */


const AppViewContainer = ({children, paddingSize, horizonal, vertical, customStyle}) => {
  

  if (customStyle) {
    computedTextStyle = {
      ...computedTextStyle,
      ...customStyle,
    };
  }

  return <View style={computedTextStyle}>{children}</View>;
};

export default AppViewContainer;
