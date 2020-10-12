import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  AppText,
  ScreenHeaderTitle,
  FloatingAppInput,
  AppCheckbox,
  BottomSheetHeader,
} from '@/components';
import {AngleDown, PostInfo} from '@/assets/images/icons';
import {Colors, normalize} from '@/globals';
import Section from '../../Section';
import ItemImageUpload from '../../ItemImageUpload';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppInput, PriceInput} from '@/components/AppInput';

import AddCategoryModal from './AddCategoryModal';
import AddedItemPreview from './AddedItemPreview';
import {CategoryService} from '@/services';

const AddItemModal = ({closeModal, setData, data}) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [itemImage, setItemImage] = useState();
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);
  const [categoryName, setCategoryName] = useState('uncategorized');
  const [choices, setChoices] = useState([
    {
      name: 'items',
      id: 0,
      selected: true,
    },
    ...CategoryService.getCategories().map((category) => {
      return {...category, selected: false};
    }),
  ]);

  const [categoryModal, setCategoryModal] = useState(false);
  const [previewItemModal, setPreviewItemModal] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // If editing
  const [index, setIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // const [data, setData] = useState([]);

  const addItemHandler = () => {
    // console.log('Data submitted: ');
    // console.log(data);
    let newData = {
      title: title,
      description: description,
      itemImage: itemImage,
      price: price,
      categoryName: categoryName,
    };

    let itemArray = [...data];

    if (isEditing) {
      itemArray[index] = newData;
    } else {
      itemArray.push(newData);
    }

    setData(itemArray);
    clearData();

    setPreviewItemModal(true);
  };

  const clearData = () => {
    setTitle('');
    setDescription('');
    setItemImage();
    setPrice();
    setCategoryName('');
    setFree(false);
  };

  const setInitialData = {
    setTitle,
    setDescription,
    setItemImage,
    setPrice,
    setCategoryName,
    setFree,
    setIndex,
    setIsEditing,
  };

  const freeItemHandler = () => {
    setFree(!free);
  };

  useEffect(() => {
    if (free) {
      setPrice('Free');
    } else {
      if (price === 'Free') {
        setPrice('');
      }
    }
  }, [free, price]);

  // check if all required fields are not empty
  useEffect(() => {
    if (title && price) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [title, price]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeaderTitle
        close={closeModal}
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
              If you don't have categories added, items will be automatically
              displayed under 'Items'.
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
              <View style={{flex: 1}}>
                <AppText textStyle="body2">Select Category</AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{textTransform: 'capitalize'}}>
                  {categoryName}
                </AppText>
              </View>
              <AngleDown width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </Section>

          <Section>
            <View style={{alignItems: 'center', marginBottom: 24}}>
              <View
                style={{
                  // backgroundColor: 'red',
                  width: normalize(114),
                  height: normalize(114),
                  borderRadius: 4,
                }}>
                <ItemImageUpload
                  imgSourceHandler={(itemImage) => {
                    setItemImage(itemImage);
                  }}
                  imgSrc={itemImage}
                />
              </View>
            </View>

            <FloatingAppInput
              customStyle={{marginBottom: 16}}
              label="Item Name"
              value={title}
              onChangeText={(text) => setTitle(text)}
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
              onChangeText={(text) => setDescription(text)}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />

            {/* <AppInput
              style={{marginBottom: 16}}
              label="Price"
              value={title}
              onChangeText={(text) => setTitle(text)}
            /> */}

            <View style={{marginBottom: 64}}>
              {/* <FloatingAppInput
                label="Price"
                customStyle={{marginBottom: 8}}
                value={title}
                keyboardType="number-pad"
                onChangeText={(text) => setTitle(text)}
              /> */}
              <PriceInput
                value={price}
                keyboardType="number-pad"
                onChangeText={(text) => setPrice(text)}
                placeholder="00"
                editable={!free}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={freeItemHandler}
                  activeOpacity={0.7}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <PostInfo />
                  <AppText customStyle={{marginLeft: 4}}>
                    I'm offering this item for FREE
                  </AppText>
                </TouchableOpacity>
                <AppCheckbox
                  Icon=""
                  label=""
                  value={free}
                  valueChangeHandler={() => setFree(!free)}
                />
              </View>
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
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <AddCategoryModal
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          choices={choices}
          setChoices={setChoices}
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
          setInitialData={setInitialData}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default AddItemModal;
