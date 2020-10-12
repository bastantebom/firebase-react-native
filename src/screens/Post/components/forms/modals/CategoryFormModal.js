import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';

import {AppText, FloatingAppInput} from '@/components';
import {Colors} from '@/globals';

const CategoryFormModal = ({close}) => {
  const submitHandler = () => {
    console.log('save new category');
    // call create category api
    console.log('call API');

    // update choices state
    close();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={close}>
        <AppText>Hello</AppText>
      </TouchableOpacity>

      <FloatingAppInput label="Category Name" />

      <TouchableOpacity
        onPress={submitHandler}
        style={{backgroundColor: Colors.primaryYellow}}>
        <AppText>Add Category</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CategoryFormModal;
