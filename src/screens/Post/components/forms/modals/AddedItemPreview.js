import React from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';

import {AppText, Item} from '@/components';
import {Colors} from '@/globals';

const AddedItemPreview = ({closeAddItemModal, closeModal, data, clearData}) => {
  console.log(data);

  const AddAnotherItemHandler = () => {
    closeModal();
  };

  const submitAddedItems = () => {
    closeModal();
    closeAddItemModal();
  };

  const ItemList = () => {
    return data.map((item) => {
      return (
        <Item item={item}>
          <TouchableOpacity>
            <AppText textStyle="caption" color={Colors.contentOcean}>
              Edit Item
            </AppText>
          </TouchableOpacity>
        </Item>
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <View>
          <TouchableOpacity onPress={closeModal}>
            <AppText>X</AppText>
          </TouchableOpacity>
          <ItemList />

          <TouchableOpacity
            onPress={AddAnotherItemHandler}
            style={{marginTop: 24}}>
            <AppText textStyle="caption">Add an Item</AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={submitAddedItems}
          activeOpacity={0.7}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 12,
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
          }}>
          <AppText textStyle="button2">Add Items</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddedItemPreview;
