import React from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';

import {AppText, ScreenHeaderTitle} from '@/components';
import {AngleDown} from '@/assets/images/icons';
import {Colors, normalize} from '@/globals';

const AddItemModal = ({closeModal}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeaderTitle
        close={closeModal}
        title="Add an Item"
        paddingSize={2}
      />
      <View
        style={{
          backgroundColor: Colors.neutralsZirconLight,
          //   backgroundColor: 'red',
          flex: 1,
        }}>
        <View
          style={{
            padding: 16,
            backgroundColor: 'white',
            borderBottomEndRadius: 4,
            borderBottomStartRadius: 4,
          }}>
          <AppText textStyle="body1">Categories</AppText>
          <AppText textStyle="caption" color={Colors.contentPlaceholder}>
            If you don't have categories added, items will be automatically
            displayed under 'Items'.
          </AppText>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutralGray,
              borderRadius: 4,
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 4,
              alignItems: 'center',
              marginTop: 24,
            }}>
            <View style={{flex: 1}}>
              <AppText textStyle="body2">Select Category</AppText>
              <AppText textStyle="body1">Uncategorized</AppText>
            </View>
            <AngleDown width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddItemModal;
