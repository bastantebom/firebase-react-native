import React from 'react';
import {View} from 'react-native';

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
          width: 40,
          height: 5,
          marginVertical: 8,
        }}
      />
    </View>
  );
};

export default bottomSheetHeader;
