import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';

import {AppText, BottomSheetHeader} from '@/components';

const CategoryOptions = ({close}) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <View style={{paddingHorizontal: 24}}>
        <BottomSheetHeader />
        <AppText>Edit Category</AppText>
        
      </View>
    </SafeAreaView>
  );
};

export default CategoryOptions;
