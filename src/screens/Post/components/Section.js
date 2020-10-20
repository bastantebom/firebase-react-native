import React from 'react';
import {View} from 'react-native';

const Section = ({children, style}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 24,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        paddingVertical: 32,
        borderRadius: 4,
        marginBottom: 8,
        ...style,
      }}>
      {children}
    </View>
  );
};

export default Section;
