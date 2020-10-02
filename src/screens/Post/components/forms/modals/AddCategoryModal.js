import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {Divider} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {GlobalStyle, Colors, normalize} from '@/globals';
import {
  AppText,
  BottomSheetHeader,
  AppRadio,
  FloatingAppInput,
} from '@/components';

const AddCategoryModal = ({
  categoryName,
  setCategoryName,
  choice,
  setChoice,
  close,
}) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);

  const onFocusHandler = () => {
    setPaddingBottom(320);
  };

  const onEndEditHandler = () => {
    setPaddingBottom(40);
  };

  const [paddingBottom, setPaddingBottom] = useState(40);

  const submitHandler = () => {
    setCategoryName(newCategoryName);
    close();
  };

  const [newActiveHeight] = useState(new Animated.Value(0));
  const [newActiveOpacity] = useState(new Animated.Value(0));

  let newActiveStyle = {
    height: newActiveHeight,
    opacity: newActiveOpacity,
    marginBottom: 16,
  };

  useEffect(() => {
    if (choice.newCategory) showNewCategory();
  }, []);

  const showNewCategory = async () => {
    Animated.sequence([
      Animated.timing(newActiveHeight, {
        toValue: 54,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(newActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideNewCategory = async () => {
    Animated.sequence([
      Animated.timing(newActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(newActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: paddingBottom,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        paddingHorizontal: 24,
      }}>
      <BottomSheetHeader />
      <AppRadio
        label="Uncategorized"
        value={choice.uncategorized}
        style={{paddingLeft: 0, marginTop: 24}}
        valueChangeHandler={() => {
          setChoice({
            uncategorized: true,
            newCategory: false,
          });
          setNewCategoryName('uncategorized');
          hideNewCategory();
        }}
      />
      <AppText textStyle="caption" color={Colors.contentPlaceholder}>
        If you don't have categories, items will be displayed under "items".
      </AppText>
      <Divider style={[GlobalStyle.dividerStyle, {marginVertical: 16}]} />
      <AppRadio
        label="Create a New Category"
        value={choice.newCategory}
        style={{paddingLeft: 0, marginBottom: 8}}
        valueChangeHandler={() => {
          setChoice({
            uncategorized: false,
            newCategory: true,
          });
          showNewCategory();
        }}
      />

      <Animated.View style={newActiveStyle}>
        <FloatingAppInput
          label="Category"
          value={newCategoryName}
          onInputFocus={onFocusHandler}
          onEndEditing={onEndEditHandler}
          onChangeText={(value) => setNewCategoryName(value)}
          customStyle={{marginBottom: normalize(16)}}
        />
      </Animated.View>
      <TouchableOpacity
        onPress={submitHandler}
        activeOpacity={0.7}
        // disabled={buttonEnabled || loadingSubmit}
        style={{
          backgroundColor: Colors.primaryYellow,
          paddingVertical: 12,
          alignItems: 'center',
          height: 48,
          justifyContent: 'center',
        }}>
        <AppText textStyle="button2">Add New Category</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default AddCategoryModal;
