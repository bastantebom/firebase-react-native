import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'

import { AppText, BottomSheetHeader } from '@/components'
import CategoryFormModal from './CategoryFormModal'
import DeleteCategoryModal from './DeleteCategoryModal'

import Modal from 'react-native-modal'
import { CategoryService } from '@/services'
import { Context } from '@/context'
import { useNavigation } from '@react-navigation/native'
import { Draft, Trash } from '@/assets/images/icons'
import { Colors } from '@/globals'

const CategoryOptions = ({ close, categoryName }) => {
  const [categoryFormModal, showCategoryFormModal] = useState(false)
  const [deleteCategoryModal, showDeleteCategoryModal] = useState(false)
  const { editCategory } = useContext(Context)

  const navigation = useNavigation()

  const deleteCategoryHandler = () => {
    showDeleteCategoryModal(true)
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <View style={{ paddingHorizontal: 24 }}>
        <BottomSheetHeader />
        <AppText textStyle="display6" customStyle={{ paddingBottom: 24 }}>
          Edit Category
        </AppText>

        {/* Change category name of all items && edit category name then redirect to sell post form */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ paddingBottom: 24, flexDirection: 'row' }}
          onPress={() => {
            showCategoryFormModal(true)
          }}>
          <Draft />
          <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
            Edit Category Name
          </AppText>
        </TouchableOpacity>

        {/* Prompt if the user wants to delete the items under this category OR delete the category and move the items to uncategorized then redirect to sell post form*/}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ paddingBottom: 24, flexDirection: 'row' }}
          onPress={() => deleteCategoryHandler()}>
          <Trash />
          <AppText
            textStyle="body2"
            customStyle={{ paddingLeft: 8 }}
            color={Colors.red}>
            Delete Category
          </AppText>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={deleteCategoryModal}
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
        <DeleteCategoryModal
          close={() => {
            showDeleteCategoryModal(false)
            close()
          }}
          categoryName={categoryName}
        />
      </Modal>

      <Modal
        isVisible={categoryFormModal}
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
        <CategoryFormModal
          close={() => {
            showCategoryFormModal(false)
            close()
          }}
          editing={true}
          categoryName={categoryName}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default CategoryOptions
