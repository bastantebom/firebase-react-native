import React, { useState, useEffect, useContext } from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import { Divider } from 'react-native-paper'

import {
  AppText,
  FloatingAppInput,
  ScreenHeaderTitle,
  AppRadio,
} from '@/components'
import { AngleDown } from '@/assets/images/icons'
import { Colors, normalize, GlobalStyle } from '@/globals'
import { CategoryService } from '@/services'
import { Context } from '@/context'
import { useNavigation } from '@react-navigation/native'

import AddCategoryModal from './AddCategoryModal'

const DeleteCategoryModal = ({ close, categoryName }) => {
  const [buttonPadding, setButtonPadding] = useState(0)
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const { items, editCategory, deleteItemsByCategory } = useContext(Context)

  const [deleteItems, setDeleteItems] = useState(false)
  const [moveItems, setMoveItems] = useState(false)
  const [NewCategoryName, setNewCategoryName] = useState('uncategorized')
  const [categoryModal, setCategoryModal] = useState(false)

  const navigation = useNavigation()

  const deleteCategoryHandler = async () => {
    // DELETE CATEGORY FROM CATEGORY ARRAY
    let cats = await CategoryService.getCategories().then(res => {
      return res
    })

    cats.map(category => {
      if (category.category === categoryName) {
        CategoryService.deleteCategory(category.id).then(res => {
          console.log('DELETE CATEGORY BACKEND RESPONSE')
          console.log(res)
        })
      }
      return
    })

    // PROMPT TO DELETE ITEMS UNDER THE CATEGORY OR MOVE ITEMS TO CERTAIN CATEGORY???
    // kung imomove parang equal lang din sya to rename category?
    if (deleteItems) {
      // delete all items that have this category
      deleteItemsByCategory(categoryName)
    }

    // MOVE ITEMS UNDER THIS CATEGORY
    if (moveItems) {
      editCategory(NewCategoryName, categoryName)
    }

    navigation.push('AddedItemPreviewScreen', {
      categoryName: NewCategoryName,
    })

    close()
  }

  const select = option => {
    setDeleteItems(false)
    setMoveItems(false)
    if (option === 'delete') setDeleteItems(true)
    if (option === 'move') setMoveItems(true)
  }

  const deleteCategoryHandler = async () => {
    // DELETE CATEGORY FROM CATEGORY ARRAY
    let cats = await CategoryService.getCategories().then(res => {
      return res
    })

    cats.map(category => {
      if (category.category === categoryName) {
        CategoryService.deleteCategory(category.id).then(res => {
          console.log('DELETE CATEGORY BACKEND RESPONSE')
          console.log(res)
        })
      }
      return
    })

    // PROMPT TO DELETE ITEMS UNDER THE CATEGORY OR MOVE ITEMS TO CERTAIN CATEGORY???
    // kung imomove parang equal lang din sya to rename category?
    if (deleteItems) {
      // delete all items that have this category
      deleteItemsByCategory(categoryName)
    }

    // MOVE ITEMS UNDER THIS CATEGORY
    if (moveItems) {
      editCategory(NewCategoryName, categoryName)
    }

    navigation.push('AddedItemPreviewScreen', {
      categoryName: NewCategoryName,
    })

    // close();
  }

  const select = option => {
    setDeleteItems(false)
    setMoveItems(false)
    if (option === 'delete') setDeleteItems(true)
    if (option === 'move') setMoveItems(true)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        // close={closeModal}
        close={close}
        title="Delete Category"
        paddingSize={2}
      />

      {/* <FloatingAppInput label="Category Name" /> */}
      <View
        style={{
          paddingHorizontal: 24,
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={{ alignItems: 'center' }}>
            <AppText textStyle="body2">Are you sure?</AppText>
            <AppText>Hmmm</AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => select('delete')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <AppRadio
              valueChangeHandler={() => select('delete')}
              value={deleteItems}
              style={{ paddingLeft: 0 }}
            />
            <AppText textStyle="body3">
              Delete all items under this category
            </AppText>
          </TouchableOpacity>
          <Divider style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => select('move')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <AppRadio
              valueChangeHandler={() => select('move')}
              value={moveItems}
              style={{ paddingLeft: 0 }}
            />
            <AppText textStyle="body3">
              ...or move items to another category
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCategoryModal(true)}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutralGray,
              borderRadius: 4,
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 4,
              alignItems: 'center',
            }}>
            <View style={{ flex: 1 }}>
              {NewCategoryName === 'uncategorized' ? (
                <AppText textStyle="body2">Select Category</AppText>
              ) : (
                <></>
              )}
              <AppText
                textStyle="body1"
                customStyle={{ textTransform: 'capitalize' }}>
                {NewCategoryName}
              </AppText>
            </View>
            <AngleDown width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={deleteCategoryHandler}
          activeOpacity={0.7}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 12,
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
            marginBottom: 16,
          }}>
          <AppText textStyle="button2">Delete</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={close}
          activeOpacity={0.7}
          style={{
            backgroundColor: Colors.buttonDisable,
            paddingVertical: 12,
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
            marginBottom: 16,
          }}
          disabled={deleteItems || moveItems}>
          <AppText textStyle="button2">Cancel</AppText>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={categoryModal}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => setCategoryModal(!categoryModal)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <AddCategoryModal
          categoryName={NewCategoryName}
          setCategoryName={setNewCategoryName}
          close={() => setCategoryModal(false)}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default DeleteCategoryModal
