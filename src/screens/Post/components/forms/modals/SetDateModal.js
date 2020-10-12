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

const SetDateModal = () => { 
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
        <AppText textStyle="body3">Set Date</AppText>
        <TouchableOpacity
          style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
          onPress={() => showDateModal(false)}>
          <AppText textStyle="button2">
            Save
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SetDateModal;