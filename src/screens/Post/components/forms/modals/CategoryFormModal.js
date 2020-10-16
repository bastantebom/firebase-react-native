import React, {useState, useEffect} from 'react';
import {SafeAreaView, TouchableOpacity, View, Keyboard} from 'react-native';

import {AppText, FloatingAppInput, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CategoryService} from '@/services';

const CategoryFormModal = ({close}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [buttonPadding, setButtonPadding] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const submitHandler = () => {
    console.log('save new category');
    // call createCategory api
    CategoryService.createCategory(newCategoryName);

    CategoryService.deleteCategory("pWKgtLwX6dobG9NdQi4B")
    CategoryService.deleteCategory("WqwFr3nQJ7jdjpoQzE1l")

    // update choices state
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
        title="Create a New Category"
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
            console.log('INCREASE PADDING');
            setButtonPadding(340);
          }}
          onInputBlur={() => {
            setButtonPadding(0);
          }}
        />

        <TouchableOpacity
          onPress={submitHandler}
          disabled={buttonDisabled}
          style={{
            backgroundColor: buttonDisabled
              ? Colors.buttonDisable
              : Colors.primaryYellow,
            paddingVertical: 8,
            alignItems: 'center',
            marginBottom: buttonPadding,
          }}>
          <AppText textStyle="body2">Add Category</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CategoryFormModal;
