import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView, TouchableOpacity, View, Keyboard} from 'react-native';

import {AppText, FloatingAppInput, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CategoryService} from '@/services';
import {Context} from '@/context';
import {useNavigation} from '@react-navigation/native';

const CategoryFormModal = ({close, editing, categoryName}) => {
  const [newCategoryName, setNewCategoryName] = useState(
    editing ? categoryName : '',
  );
  const [buttonPadding, setButtonPadding] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const {items, editCategory} = useContext(Context);

  const navigation = useNavigation();

  const submitHandler = () => {
    console.log('save new category');
    CategoryService.createCategory(newCategoryName).then((res) => {
      console.log(res);
    });
    close();
  };

  const editHandler = async (oldCategoryName) => {
    editCategory(newCategoryName, oldCategoryName);

    let cats = await CategoryService.getCategories().then((res) => {
      return res;
    });

    cats.map((category) => {
      if (category.category === oldCategoryName) {
        CategoryService.editCategory(category.id, newCategoryName);
      }
      return;
    });

    // CategoryService.editCategory(id, newCategoryName)

    navigation.push('AddedItemPreviewScreen', {
      categoryName: newCategoryName,
    });

    close();
  };

  useEffect(() => {
    if (newCategoryName) {
      setButtonDisabled(false);
    }
  }, [newCategoryName]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeaderTitle
        // close={closeModal}
        close={close}
        title={editing ? 'Edit Category Name' : 'Create a New Category'}
        paddingSize={2}
      />

      {/* <FloatingAppInput label="Category Name" /> */}

      <View
        style={{
          paddingHorizontal: 24,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <FloatingAppInput
          label="Category"
          value={newCategoryName}
          onChangeText={(value) => setNewCategoryName(value)}
          customStyle={{marginBottom: normalize(16)}}
          onInputFocus={() => {
            setButtonPadding(340);
          }}
          onInputBlur={() => {
            setButtonPadding(0);
          }}
        />

        <TouchableOpacity
          onPress={() =>
            editing ? editHandler(categoryName) : submitHandler()
          }
          disabled={buttonDisabled}
          style={{
            backgroundColor: buttonDisabled
              ? Colors.buttonDisable
              : Colors.primaryYellow,
            paddingVertical: 8,
            alignItems: 'center',
            marginBottom: buttonPadding,
          }}>
          <AppText textStyle="body2">
            {editing ? 'Update Category' : 'Add Category'}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CategoryFormModal;
