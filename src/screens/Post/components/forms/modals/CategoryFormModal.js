import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';

import {AppText, FloatingAppInput} from '@/components';
import {Colors, normalize} from '@/globals';
import {CategoryService} from '@/services';

const CategoryFormModal = ({close}) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const submitHandler = () => {
    console.log('save new category');
    // call create category api
    console.log('call API');
    CategoryService.createCategory(newCategoryName);

    // update choices state
    close();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={close}>
        <AppText>Hello</AppText>
      </TouchableOpacity>

      {/* <FloatingAppInput label="Category Name" /> */}

      <FloatingAppInput
        label="Category Name"
        value={newCategoryName}
        onChangeText={(value) => setNewCategoryName(value)}
        customStyle={{marginBottom: normalize(16)}}
      />

      <TouchableOpacity
        onPress={submitHandler}
        style={{backgroundColor: Colors.primaryYellow}}>
        <AppText>Add Category</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CategoryFormModal;
