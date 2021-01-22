import React, { useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import { AppText, Item, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'
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
    if (items) {
      return items?.map((item, index) => {
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
    } else {
      return <></>
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeaderTitle
        close={() => {
          navigation.navigate('CreatePostScreen')
        }}
        title={categoryName}
        paddingSize={3}
        withOptions
        openOptions={() => showOptions(true)}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: normalize(24),
          paddingTop: 0,
        }}>
        <View>
          <ItemList />

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
