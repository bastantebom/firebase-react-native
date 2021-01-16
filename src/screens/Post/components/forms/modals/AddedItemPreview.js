import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

import { AppText, Item, ScreenHeaderTitle } from '@/components'
import { Colors, GlobalStyle, normalize } from '@/globals'
import { CircleAdd } from '@/assets/images/icons'
import Modal from 'react-native-modal'
import CategoryOptions from './CategoryOptions'
import { Divider } from 'react-native-paper'

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
  const { getItemsByCategory, editItem } = useContext(Context)

  const { navigation } = props

  const { categoryName } = props?.route?.params

  const [items, setItems] = useState(getItemsByCategory(categoryName))
  const [editItemModal, showEditItemModal] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(false)
  const [indexOfItemToEdit, setIndexOfItemToEdit] = useState(0)
  const [options, showOptions] = useState(false)

  const AddAnotherItemHandler = () => {
    navigation.replace('AddItemScreen')
  }

  const submitAddedItems = () => {
    navigation.navigate('CreatePostScreen')
  }

  const editItemHandler = (item, index) => {
    setItemToEdit(item)
    setIndexOfItemToEdit(index)

    navigation.navigate('EditItemScreen', { itemToEdit: item })
  }

  const ItemList = () => {
    return items.map((item, index) => {
      return (
        <>
          <Item item={item} key={index}>
            <TouchableOpacity onPress={() => editItemHandler(item)}>
              <AppText textStyle="caption" color={Colors.contentOcean}>
                Edit Item
              </AppText>
            </TouchableOpacity>
          </Item>
          <Divider style={[GlobalStyle.dividerStyle, { marginVertical: 8 }]} />
        </>
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
            style={{ marginTop: 24 }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <CircleAdd />
              <AppText
                customStyle={{ marginLeft: 4 }}
                textStyle="caption"
                color={Colors.contentOcean}>
                Add an Item
              </AppText>
            </View>
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
