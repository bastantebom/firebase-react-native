import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'

import { AppText, ScreenHeaderTitle, FloatingAppInput } from '@/components'
import { AngleDown } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import Section from '../../Section'
import ItemImageUpload from '../../ItemImageUpload'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PriceInput } from '@/components/AppInput'

import AddCategoryModal from './AddCategoryModal'

import { Context } from '@/context'
import { formatPrice } from '@/globals/Utils'

const AddItemModal = ({ closeModal, ...props }) => {
  const type = props?.route?.params?.type
  const { addItem } = useContext(Context)

  const { navigation } = props
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [itemImage, setItemImage] = useState()
  const [price, setPrice] = useState(0)
  const [free, setFree] = useState(false)
  const [categoryName, setCategoryName] = useState('others')

  const [categoryModal, setCategoryModal] = useState(false)

  const [buttonEnabled, setButtonEnabled] = useState(false)
  const [loadingSubmit] = useState(false)
  const [clearPhoto, setClearPhoto] = useState(false)

  // If editing
  const [index, setIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  const addItemHandler = () => {
    let newData = {
      title: title,
      description: description,
      itemImage: itemImage,
      price: price,
      categoryName: categoryName,
    }

    clearData()

    addItem(newData)
    setClearPhoto(true)

    navigation.push('AddedItemPreviewScreen', {
      categoryName: categoryName,
    })
  }

  const clearData = () => {
    setTitle('')
    setDescription('')
    setItemImage('')
    setPrice()
    setFree(false)
  }

  useEffect(() => {
    clearData()
  }, [])

  const setInitialData = {
    setTitle,
    setDescription,
    setItemImage,
    setPrice,
    setCategoryName,
    setFree,
    setIndex,
    setIsEditing,
  }

  const freeItemHandler = () => {
    setFree(!free)
  }

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
        close={() => {
          navigation.navigate('CreatePostScreen')
        }}
        title="Add an Item"
        paddingSize={2}
      />
      <KeyboardAwareScrollView>
        <View
          style={{
            backgroundColor: Colors.neutralsZirconLight,
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
              No specific category? The item will be automatically categorized
              under "Others”.
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
                  clear={clearPhoto}
                />
              </View>
            </View>

            <FloatingAppInput
              customStyle={{ marginBottom: 16 }}
              label="Item Name"
              value={title}
              onChangeText={text => setTitle(text)}
              placeholder="e.g. Laptops, Tea, Coffee"
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
                onChangeText={text => setPrice(formatPrice(text))}
                placeholder="00"
                editable={!free}
              />
            </View>

            <TouchableOpacity
              onPress={addItemHandler}
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
                <AppText textStyle="button2">
                  {isEditing ? 'Update' : 'Add Item'}
                </AppText>
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
          type={type}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          close={() => setCategoryModal(false)}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default AddItemModal
