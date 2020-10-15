import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Animated, Dimensions} from 'react-native';
import {Divider} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Modal from 'react-native-modal';
import CategoryFormModal from './CategoryFormModal';

import {GlobalStyle, Colors, normalize} from '@/globals';
import {
  AppText,
  BottomSheetHeader,
  AppRadio,
  FloatingAppInput,
} from '@/components';

import {CategoryService} from '@/services';

const AddCategoryModal = ({
  categoryName,
  setCategoryName,
  // choices,
  // setChoices,
  close,
}) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [newCategoryModal, setNewCategoryModal] = useState(false);

  const onFocusHandler = () => {
    setPaddingBottom(320);
  };

  const onEndEditHandler = () => {
    setPaddingBottom(40);
  };

  const [paddingBottom, setPaddingBottom] = useState(40);

  const submitHandler = () => {
    // setCategoryName(newCategoryName);
    close();
  };

  const [newActiveHeight] = useState(new Animated.Value(0));
  const [newActiveOpacity] = useState(new Animated.Value(0));

  let newActiveStyle = {
    height: newActiveHeight,
    opacity: newActiveOpacity,
    marginBottom: 16,
  };

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // CategoryService.deleteCategory('Cdn4bLyPq7RXKgMrXkJI');
    CategoryService.getCategories().then((res) => {
      setCategoryList(res);
    });
  }, []);

  // useEffect(() => {
  //   if (choices.newCategory) showNewCategory();
  // }, []);

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

  const radioGroupHandler = (selected) => {
    // setChoices((choice) => {
    //   return choice.map((choice) => {
    //     return {
    //       ...choice,
    //       selected: selected.id === choice.id ? true : false,
    //     };
    //   });
    // });

    setCategoryName(selected.category);
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
      {/* <AppRadio
        label="Uncategorized"
        value={choices[0]?.selected}
        style={{paddingLeft: 0, marginTop: 24}}
        valueChangeHandler={() => {
          radioGroupHandler({id: 0, name: 'items', selected: true});
        }}
      /> */}
      <AppText textStyle="caption" color={Colors.contentPlaceholder}>
        If you don't have categories, items will be displayed under "items".
      </AppText>
      <Divider style={[GlobalStyle.dividerStyle, {marginVertical: 16}]} />

      {categoryList.map((choice, index) => {
        console.log(choice);

        return (
          <AppRadio
            label={choice.category}
            // value={choice.selected}
            style={{paddingLeft: 0, marginBottom: 8}}
            valueChangeHandler={() => {
              radioGroupHandler(choice);
            }}
          />
          // <AppText>asdas</AppText>
        );
      })}

      <Divider style={[GlobalStyle.dividerStyle, {marginVertical: 16}]} />

      {/* <AppRadio
        label="Create a New Category"
        value={choices.newCategory}
        style={{paddingLeft: 0, marginBottom: 8}}
        valueChangeHandler={() => {
          setChoice({
            uncategorized: false,
            newCategory: true,
          });
          showNewCategory();
        }}
      /> */}

      <TouchableOpacity onPress={() => setNewCategoryModal(true)}>
        <AppText>or Create a New Category</AppText>
      </TouchableOpacity>

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
        <AppText textStyle="button2">Select Category</AppText>
      </TouchableOpacity>

      <Modal
        isVisible={newCategoryModal}
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
            setNewCategoryModal(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default AddCategoryModal;
