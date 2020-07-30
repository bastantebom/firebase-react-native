import React from 'react';
import {View} from 'react-native';

import {normalize} from '@/globals';

const bottomSheetHeader = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: '#EAEAEA',
          width: normalize(40),
          height: 5,
          marginVertical: 8,
          borderRadius: 100
        }}
      />
    </View>
  );
};

export default bottomSheetHeader;
