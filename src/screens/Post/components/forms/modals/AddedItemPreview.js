import React, { useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import { AppText, Item, ScreenHeaderTitle } from '@/components'
import { Colors } from '@/globals'
import { CircleAdd } from '@/assets/images/icons'
import Modal from 'react-native-modal'
import CategoryOptions from './CategoryOptions'

import { Context } from '@/context'

const AddedItemPreview = ({
  closeAddItemModal,
  closeModal,
  data,
  clearData,
  setInitialData,
  setData,
  ...props
}) => {
  const { getItemsByCategory } = useContext(Context)
  const { navigation } = props
  const { categoryName } = props?.route?.params
  const [items] = useState(getItemsByCategory(categoryName))
  const [options, showOptions] = useState(false)

  const AddAnotherItemHandler = () => {
    navigation.replace('AddItemScreen')
  }

  const submitAddedItems = () => {
    navigation.navigate('CreatePostScreen')
  }

  const editItemHandler = item => {
    navigation.navigate('EditItemScreen', { itemToEdit: item })
  }

  const ItemList = () => {
    return items.map((item, index) => {
      return (
        <Item item={item} key={index}>
          <TouchableOpacity onPress={() => editItemHandler(item)}>
            <AppText textStyle="caption" color={Colors.contentOcean}>
              Edit
            </AppText>
          </TouchableOpacity>
        </Item>
      )
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: '#fff',
        }}>
        <View>
          <ScreenHeaderTitle
            close={() => {
              navigation.navigate('CreatePostScreen')
            }}
            title={categoryName}
            paddingSize={0}
            withOptions={true}
            openOptions={() => {
              showOptions(true)
            }}
          />
          <View style={{ paddingTop: 24 }}>
            <ItemList />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={AddAnotherItemHandler}
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CircleAdd style={{ marginRight: 5 }} />
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
      <Modal
        isVisible={options}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <CategoryOptions
          categoryName={categoryName}
          close={() => showOptions(false)}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default AddedItemPreview
