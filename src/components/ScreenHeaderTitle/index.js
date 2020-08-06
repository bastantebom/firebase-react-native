import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText} from '@/components';

const ScreenHeaderTitle = ({close}) => {
  return (
    <View
      style={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        onPress={close}
        activeOpacity={0.7}
        style={{position: 'absolute', left: 0}}>
        <HeaderBackGray width={normalize(16)} height={normalize(16)} />
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeaderTitle;
