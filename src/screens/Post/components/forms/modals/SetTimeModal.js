import React, {useState} from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';

import {
  AppText,
  AppRadio,
  BottomSheetHeader
} from '@/components';

import {normalize} from '@/globals';

import {
  Public
} from '@/assets/images/icons';

const SetTimeModal = () => { 
  return (
    <View 
        style={{
        backgroundColor: 'white',
        height: '28%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20
      }}>
        
      <BottomSheetHeader />
      <View style={{paddingTop: 30}}>
        <AppText textStyle="body3">Set Time</AppText>
        <TouchableOpacity
          style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
          onPress={() => navigation.navigate('Servbees')}>
          <AppText textStyle="button2">
            Next: Set Date
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SetTimeModal;