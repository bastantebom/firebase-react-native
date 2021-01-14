import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'

import {
  AppText,
  ScreenHeaderTitle,
  FloatingAppInput,
  AppCheckbox,
} from '@/components'
import { AngleDown, PostInfo } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import Section from '../../Section'
import ItemImageUpload from '../../ItemImageUpload'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppInput, PriceInput } from '@/components/AppInput'

import AddCategoryModal from './AddCategoryModal'
import AddedItemPreview from './AddedItemPreview'
import { CategoryService } from '@/services'
import { Context } from '@/context'

const EditItemModal = ({
  closeModal,
  setData,
  data,
  indexOfItemToEdit,
  ...props
}) => {
  const { navigation } = props

  const { itemToEdit } = props?.route?.params

  const { editItem } = useContext(Context)

  const [title, setTitle] = useState(itemToEdit.title)
  const [description, setDescription] = useState(itemToEdit.description)
  const [itemImage, setItemImage] = useState(itemToEdit.itemImage)
  const [price, setPrice] = useState(itemToEdit.price)
  const [free, setFree] = useState(itemToEdit.price === 'Free' ? true : false)
  const [categoryName, setCategoryName] = useState(itemToEdit.categoryName)

  const [categoryModal, setCategoryModal] = useState(false)
  const [previewItemModal, setPreviewItemModal] = useState(false)

  const [buttonEnabled, setButtonEnabled] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const editItemHandler = () => {
    let newData = {
      ...itemToEdit,
      title: title,
      description: description,
      itemImage: itemImage,
      price: price,
      categoryName: categoryName,
    }

    editItem(newData)
    clearData()

    navigation.push('AddedItemPreviewScreen', {
      categoryName: categoryName,
    })

    // setPreviewItemModal(true);
  }

  const clearData = () => {
    setTitle('')
    setDescription('')
    setItemImage()
    setPrice()
    setCategoryName('')
    setFree(false)
  }

  const freeItemHandler = () => {
    setFree(!free)
  }

  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    let response = CategoryService.getCategories()

    setCategoryList(response)
  }, [])

  useEffect(() => {
    if (free) {
      setPrice('Free')
    } else {
      if (price === 'Free') {
        setPrice('')
      }
    }
  }, [free, price])

  // check if all required fields are not empty
  useEffect(() => {
    if (title && price) {
      setButtonEnabled(true)
    } else {
      setButtonEnabled(false)
    }
  }, [title, price])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="Add an Item"
        paddingSize={2}
      />
      <KeyboardAwareScrollView>
        <View
          style={{
            backgroundColor: Colors.neutralsZirconLight,
            //   backgroundColor: 'red',
            flex: 1,
          }}>
          <Section
            style={{
              padding: 16,
              backgroundColor: 'white',
              borderBottomEndRadius: 4,
              borderBottomStartRadius: 4,
            }}>
            <AppText textStyle="body1">Categories</AppText>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>
              No specific category? Your service will be automatically
              categorized under "Others”.
            </AppText>

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
                {categoryName === 'others' ? (
                  <AppText textStyle="body2">Select Category</AppText>
                ) : (
                  <></>
                )}
                <AppText
                  textStyle="body1"
                  customStyle={{ textTransform: 'capitalize' }}>
                  {categoryName}
                </AppText>
              </View>
              <AngleDown width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </Section>

          <Section>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View
                style={{
                  width: normalize(114),
                  height: normalize(114),
                  borderRadius: 4,
                }}>
                <ItemImageUpload
                  imgSourceHandler={itemImage => {
                    setItemImage(itemImage)
                  }}
                  imgSrc={itemImage}
                />
              </View>
            </View>

            <FloatingAppInput
              customStyle={{ marginBottom: 16 }}
              label="Item Name"
              value={title}
              onChangeText={text => setTitle(text)}
            />

            <TextInput
              value={description}
              multiline={true}
              placeholder="Description"
              placeholderTextColor={Colors.neutralGray}
              numberOfLines={Platform.OS === 'ios' ? null : 6}
              minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
              style={{
                color: Colors.contentEbony,
                fontFamily: 'RoundedMplus1c-Regular',
                fontSize: normalize(16),
                letterSpacing: 0.5,
                borderColor: Colors.neutralGray,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 16,
                textAlign: 'left',
              }}
              onChangeText={text => setDescription(text)}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />

            <View style={{ marginBottom: 64 }}>
              <PriceInput
                value={price}
                keyboardType="number-pad"
                onChangeText={text => setPrice(text)}
                placeholder="00"
                editable={!free}
              />
            </View>

            <TouchableOpacity
              onPress={editItemHandler}
              activeOpacity={0.7}
              disabled={!buttonEnabled}
              style={{
                backgroundColor: !buttonEnabled
                  ? Colors.neutralsGainsboro
                  : Colors.primaryYellow,
                paddingVertical: 12,
                alignItems: 'center',
                height: 48,
                justifyContent: 'center',
              }}>
              {loadingSubmit ? (
                <ActivityIndicator />
              ) : (
                <AppText textStyle="button2">Update</AppText>
              )}
            </TouchableOpacity>
          </Section>
        </View>
      </KeyboardAwareScrollView>

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
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          close={() => setCategoryModal(false)}
        />
      </Modal>

      {/* Preview Item Modal */}
      <Modal
        isVisible={previewItemModal}
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
        <AddedItemPreview
          closeModal={() => setPreviewItemModal(false)}
          closeAddItemModal={closeModal}
          data={data}
          setData={setData}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default EditItemModal
