import React, {useState, useContext} from 'react';
import {View, SafeAreaView, TouchableOpacity, Dimensions} from 'react-native';

import {AppText, Item, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CircleAdd} from '@/assets/images/icons';
import Modal from 'react-native-modal';
import EditItemModal from './EditItemModal';

import {Context} from '@/context';

const AddedItemPreview = ({
  closeAddItemModal,
  closeModal,
  data,
  clearData,
  setInitialData,
  setData,
  ...props
}) => {
  // console.log(data);
  const {getItemsByCategory, editItem} = useContext(Context);

  const {navigation} = props;

  const {categoryName} = props?.route?.params;

  // console.log('ITEM PREVIEW');
  // console.log(getItemsByCategory(categoryName));

  const [items, setItems] = useState(getItemsByCategory(categoryName));

  // console.log("ITEMS")
  // console.log(items[0])

  // var items = getItemsByCategory(categoryName);

  const [editItemModal, showEditItemModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(false);
  const [indexOfItemToEdit, setIndexOfItemToEdit] = useState(0);

  const AddAnotherItemHandler = () => {
    // console.log(navigation)
    navigation.navigate('AddItemScreen');
  };

  const submitAddedItems = () => {
    closeModal();
    closeAddItemModal();
  };

  const editItemHandler = (item, index) => {
    console.log('Edit this:');
    console.log(item);
    setItemToEdit(item);
    setIndexOfItemToEdit(index);

    console.log(editItem(item));

    // navigation.navigate('EditItemScreen', {itemToEdit: item});

    // showEditItemModal(true);
    // closeModal();
  };

  const ItemList = () => {
    return items.map((item, index) => {
      return (
        <Item item={item} key={index}>
          <TouchableOpacity onPress={() => editItemHandler(item)}>
            <AppText textStyle="caption" color={Colors.contentOcean}>
              Edit Item {item.itemId}
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
            close={() => {
              navigation.goBack();
            }}
            title={categoryName}
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
      {/* <Modal
        isVisible={editItemModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <EditItemModal
          closeModal={() => {
            showEditItemModal(false);
          }}
          itemToEdit={itemToEdit}
          setData={setData}
          data={data}
          indexOfItemToEdit={indexOfItemToEdit}
        />
      </Modal> */}
    </SafeAreaView>
  );
};

export default AddedItemPreview;
