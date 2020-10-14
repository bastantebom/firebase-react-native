import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import AddedItemPreview from '@/screens/Post/components/forms/modals/AddedItemPreview';

const ItemCategory = ({items}) => {
  // console.log(items);
  const [previewItemModal, setPreviewItemModal] = useState(false);

  const navigation = useNavigation();

  const result = [
    ...items
      .reduce((r, {categoryName, description, itemImage, price, title}) => {
        r.has(categoryName) ||
          r.set(categoryName, {
            categoryName,
            items: [],
          });

        r.get(categoryName).items.push({description, itemImage, price, title});

        return r;
      }, new Map())
      .values(),
  ];

  // console.log('RESULT:');
  // console.log(result);

  const categoryHandler = (category) => {
    console.log(`open ${category} items`);
    setPreviewItemModal(true);
    navigation.navigate('AddedItemPreviewScreen', {
      categoryName: category,
    });
  };

  const CategoryList = () => {
    return result.map((category) => {
      return (
        <TouchableOpacity
          onPress={() =>
            categoryHandler(category.categoryName, category.items)
          }>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginTop: 24,
              borderColor: Colors.neutralGray,
            }}>
            <AppText
              textStyle="body2"
              customStyle={{textTransform: 'capitalize'}}>
              {category.categoryName}{' '}
            </AppText>
            <AppText textStyle="caption">
              {category.items?.length}{' '}
              {category.items?.length > 1 ? 'Items' : 'Item'}
            </AppText>
          </View>
          {/* <Modal
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
              // closeAddItemModal={closeModal}
              categoryName={category.categoryName}
              data={category.items}
              // setInitialData={setInitialData}
            />
          </Modal> */}
        </TouchableOpacity>
      );
    });
  };

  return (
    <View>
      <CategoryList />
    </View>
  );
};

export default ItemCategory;
