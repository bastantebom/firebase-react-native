import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';

import {AppText, BottomSheetHeader} from '@/components';
import CategoryFormModal from './CategoryFormModal';
import Modal from 'react-native-modal';
import {CategoryService} from '@/services';
import {Context} from '@/context';
import {useNavigation} from '@react-navigation/native';

const CategoryOptions = ({close, categoryName}) => {
  const [categoryFormModal, showCategoryFormModal] = useState(false);
  const {editCategory} = useContext(Context);

  const navigation = useNavigation();

  const deleteCategoryHandler = async () => {
    // DELETE CATEGORY FROM CATEGORY ARRAY
    let cats = await CategoryService.getCategories().then((res) => {
      return res;
    });

    cats.map((category) => {
      if (category.category === categoryName) {
        CategoryService.deleteCategory(category.id).then((res) => {
          console.log('DELETE CATEGORY BACKEND RESPONSE');
          console.log(res);
        });
      }
      return;
    });

    // PROMPT TO DELETE ITEMS UNDER THE CATEGORY OR MOVE ITEMS TO CERTAIN CATEGORY??? 
    // kung imomove parang equal lang din sya to rename category?

    // MOVE ITEMS UNDER THIS CATEGORY
    editCategory('items', categoryName);

    navigation.push('AddedItemPreviewScreen', {
      categoryName: 'items',
    });
    close();
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <View style={{paddingHorizontal: 24}}>
        <BottomSheetHeader />
        <AppText textStyle="display6" customStyle={{paddingBottom: 24}}>
          Edit Category
        </AppText>

        {/* Change category name of all items && edit category name then redirect to sell post form */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{paddingBottom: 24}}
          onPress={() => {
            showCategoryFormModal(true);
          }}>
          <AppText textStyle="body2">Change Category Name</AppText>
        </TouchableOpacity>

        {/* Prompt if the user wants to delete the items under this category OR delete the category and move the items to uncategorized then redirect to sell post form*/}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{paddingBottom: 24}}
          onPress={() => deleteCategoryHandler()}>
          <AppText textStyle="body2">Delete Category</AppText>
        </TouchableOpacity>
      </View>

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
            showCategoryFormModal(false);
            close();
          }}
          editing={true}
          categoryName={categoryName}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryOptions;
