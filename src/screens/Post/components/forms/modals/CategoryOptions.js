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
        <AppText textStyle="display6" customStyle={{paddingBottom: 24}}>
          Edit Category
        </AppText>

        {/* Change category name of all items && edit category name then redirect to sell post form */}
        <TouchableOpacity activeOpacity={0.7} style={{paddingBottom: 24}}>
          <AppText textStyle="body2">Change Category Name</AppText>
        </TouchableOpacity>

        {/* Prompt if the user wants to delete the items under this category OR delete the category and move the items to uncategorized then redirect to sell post form*/}
        <TouchableOpacity activeOpacity={0.7} style={{paddingBottom: 24}}>
          <AppText textStyle="body2">Delete Category</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CategoryOptions;
