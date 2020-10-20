import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView, TouchableOpacity, View, Keyboard} from 'react-native';

import {AppText, FloatingAppInput, ScreenHeaderTitle} from '@/components';
import {Colors, normalize} from '@/globals';
import {CategoryService} from '@/services';
import {Context} from '@/context';
import {useNavigation} from '@react-navigation/native';

const CategoryFormModal = ({close, editing, categoryName}) => {
  const [buttonPadding, setButtonPadding] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const {items, editCategory} = useContext(Context);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeaderTitle
        // close={closeModal}
        close={close}
        title="Delete Category"
        paddingSize={2}
      />

      {/* <FloatingAppInput label="Category Name" /> */}

      <View
        style={{
          paddingHorizontal: 24,
          flex: 1,
        }}>
        <AppText>HELLO</AppText>
      </View>
    </SafeAreaView>
  );
};

export default CategoryFormModal;
