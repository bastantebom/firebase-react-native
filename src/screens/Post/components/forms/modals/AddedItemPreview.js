import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity, Dimensions} from 'react-native';

import {AppText, Item, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CircleAdd} from '@/assets/images/icons';
import Modal from 'react-native-modal';
import EditItemModal from './EditItemModal';

const AddedItemPreview = ({
  closeAddItemModal,
  closeModal,
  data,
  clearData,
  setInitialData,
  categoryName,
  setData,
}) => {
  console.log(data);

  const [editItemModal, showEditItemModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(false);
  const [indexOfItemToEdit, setIndexOfItemToEdit] = useState(0);

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
    setItemToEdit(item);
    setIndexOfItemToEdit(index)

    showEditItemModal(true);
    // closeModal();
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
      <Modal
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
      </Modal>
    </SafeAreaView>
  );
};

export default AddedItemPreview;
