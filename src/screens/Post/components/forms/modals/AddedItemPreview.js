import React from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';

import {AppText, Item, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CircleAdd} from '@/assets/images/icons';

const AddedItemPreview = ({
  closeAddItemModal,
  closeModal,
  data,
  clearData,
  setInitialData,
}) => {
  console.log(data);

  const AddAnotherItemHandler = () => {
    closeModal();
  };

  const submitAddedItems = () => {
    closeModal();
    closeAddItemModal();
  };

  const editItemHandler = (item, index) => {
    console.log('Edit this:');
    console.log(item);

    setInitialData.setTitle(item.title);
    setInitialData.setDescription(item.description);
    setInitialData.setItemImage(item.itemImage);
    setInitialData.setPrice(item.price);
    setInitialData.setCategoryName(item.categoryName);
    setInitialData.setIndex(index);
    setInitialData.setIsEditing(true);
    closeModal();
  };

  const ItemList = () => {
    return data.map((item, index) => {
      return (
        <Item item={item} key={index}>
          <TouchableOpacity onPress={() => editItemHandler(item, index)}>
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
          <ScreenHeaderTitle
            close={closeModal}
            title={'Items'}
            paddingSize={0}
          />
          <View style={{paddingTop: 24}}>
            <ItemList />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={AddAnotherItemHandler}
            style={{marginTop: 24}}>
            <AppText textStyle="caption" customStyle={{alignItems: 'center'}}>
              <CircleAdd /> Add an Item
            </AppText>
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
