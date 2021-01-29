import React, { useState, useContext } from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Divider } from 'react-native-paper'
import Modal from 'react-native-modal'

import { Context } from '@/context'
import { Colors, normalize, GlobalStyle } from '@/globals'
import { AppText, ScreenHeaderTitle, AppRadio } from '@/components'
import { Category } from '@/assets/images'
import { AngleDown } from '@/assets/images/icons'
import AddCategoryModal from './AddCategoryModal'
import Api from '@/services/Api'

const DeleteCategoryModal = ({ close, categoryName }) => {
  const { editCategory, deleteItemsByCategory } = useContext(Context)

  const [deleteItems, setDeleteItems] = useState(false)
  const [moveItems, setMoveItems] = useState(false)
  const [NewCategoryName, setNewCategoryName] = useState('Others')
  const [categoryModal, setCategoryModal] = useState(false)

  const navigation = useNavigation()

  const deleteCategoryHandler = async () => {
    const { data } = await Api.getCategories()

    data.map(async category => {
      if (category.category === categoryName) {
        const result = await Api.deleteCategory({ id: category.id })

        if (result) {
          if (deleteItems) {
            deleteItemsByCategory(categoryName)
          }
          if (moveItems) {
            editCategory(NewCategoryName, categoryName)
          }
        }
      }

      navigation.push('AddedItemPreviewScreen', {
        category: NewCategoryName,
      })
      close()
    })
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
        close={close}
        title="Delete Category"
        paddingSize={2}
      />

      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <View style={{ alignItems: 'center', paddingTop: 24 }}>
            <Category />
            <AppText
              textStyle="body2medium"
              customStyle={{ marginTop: 8, marginBottom: 4 }}>
              Are you sure?
            </AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Before you proceed, review your items and choose whether to delete
              or move to another category.
            </AppText>
          </View>

          <View
            style={{
              marginTop: 40,
              paddingHorizontal: 8,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => select('delete')}
              style={{
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <AppRadio
                  valueChangeHandler={() => select('delete')}
                  value={deleteItems}
                  style={{ paddingLeft: 0 }}
                />
                <View>
                  <AppText textStyle="body2medium">Yes, Delete</AppText>
                  <AppText textStyle="body2">
                    I’m ready to delete all items under this category
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
            <Divider
              style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => select('move')}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                width: '100%',
              }}>
              <AppRadio
                valueChangeHandler={() => select('move')}
                value={moveItems}
                style={{ paddingLeft: 0 }}
              />
              <View>
                <AppText textStyle="body2medium">Move items instead</AppText>
                <AppText textStyle="body2">
                  I just want to move items to another category
                </AppText>
              </View>
            </TouchableOpacity>

            {moveItems && (
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
                  marginTop: 24,
                }}>
                <View style={{ flex: 1 }}>
                  {NewCategoryName === 'others' ? (
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
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
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
