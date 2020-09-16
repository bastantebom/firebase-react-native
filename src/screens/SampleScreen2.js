import React from 'react';
import {View} from 'react-native';
import {AppText} from '@/components';

const SampleScreen2 = () => {
  console.log('SAMPLE SCREEN');

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <AppText>SAMPLE Screen 2</AppText>
    </View>
  );
};

export default SampleScreen2;
