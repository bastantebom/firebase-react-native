import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';

import {
  AppText,
  ScreenHeaderTitle,
  FloatingAppInput,
  AppCheckbox,
} from '@/components';
import {AngleDown, PostInfo} from '@/assets/images/icons';
import {Colors, normalize} from '@/globals';
import Section from '../../Section';
import ItemImageUpload from '../../ItemImageUpload';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppInput, PriceInput} from '@/components/AppInput';

const AddItemModal = ({closeModal}) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [itemImage, setItemImage] = useState();
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
                <AppText textStyle="body1">Uncategorized</AppText>
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

            <View style={{marginBottom: 16}}>
              <FloatingAppInput
                label="Price"
                customStyle={{marginBottom: 8}}
                value={title}
                keyboardType="number-pad"
                onChangeText={(text) => setTitle(text)}
              />
              <PriceInput />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setFree(!free)}
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
              // onPress={publish}
              activeOpacity={0.7}
              disabled={buttonEnabled || loadingSubmit}
              style={{
                backgroundColor: buttonEnabled
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
                <AppText textStyle="button2">Add Item</AppText>
              )}
            </TouchableOpacity>
          </Section>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddItemModal;
