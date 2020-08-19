import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

import {AppText, AppInput} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import { PostImageUpload } from '../PostImageUpload';

const ServicePostForm = ({
  navToPost,
  togglePostModal,
  formState,
  initialData,
}) => {
  const {user} = useContext(UserContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [postImages, setPostImages] = useState([]);

  console.log('post images', postImages)

  const getImage = (postImages) => {
    setPostImages([...postImages]);
  }

  const {
    title,
    setTitle,
    price,
    setPrice,
    description,
    setDescription,
    pickupState,
    setPickupState,
    deliveryState,
    setDeliveryState,
    storeLocation,
    setStoreLocation,
    paymentMethod,
    setPaymentMethod,
  } = formState;

  const clearForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setStoreLocation('');
    setPaymentMethod('');
  };

  const checkFormContent = () => {
    if (title && price && storeLocation && paymentMethod)
      return setButtonEnabled(false);

    return setButtonEnabled(true);
  };

  useEffect(() => {
    checkFormContent();
  }, [title, price, storeLocation, paymentMethod, description]);

  const navigateToPost = async () => {
    let type = 'service';
    // let data = {
    //   uid: user.uid,
    //   post_type: type,
    //   images: [],
    //   title: title,
    //   price: price,
    //   description: description,
    //   payment_method: paymentMethod,
    //   store_location: storeLocation,
    //   delivery_method: [],
    // };
    let data = {
      uid: user.uid,
      post_type: type,
      images: [],
      title: title,
      price: price,
      description: description,
      payment_method: paymentMethod,
      store_location: storeLocation,
      delivery_method: {
        pickup: pickupState,
        delivery: deliveryState,
      },
    };

    // console.log('im saving');
    // console.log(initialData);

    if (initialData.post_id) {
      // console.log('I will edit post with id: ');
      // console.log(initialData.post_id)
      return await PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost({...res, viewing: false, created: false, edited: true});
        },
      );
    }

    return await PostService.createPost(data).then((res) => {
      togglePostModal();
      navToPost({...res, viewing: false, created: true, edited: false});
    });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 24,
        marginBottom: 8,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        paddingBottom: 48,
      }}>

      <PostImageUpload getImage={getImage} />

      <AppInput
        customStyle={{marginBottom: 16}}
        label="Title"
        placeholder="Eg. Iphone, Macbook"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <AppInput
        customStyle={{marginBottom: 16}}
        label="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
      />

      {/* <AppInput
        // wont work because of fixed height
        customStyle={{marginBottom: 16, height: undefined}}
        label="Description"
        multiline="true"
        numberOfLines={5}
      /> */}

      <Textarea
        containerStyle={{
          // backgroundColor: 'red',
          borderColor: Colors.neutralGray,
          borderRadius: 4,
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginBottom: 16,
        }}
        defaultValue={description}
        onChangeText={(text) => setDescription(text)}
        style={{
          color: Colors.contentEbony,
          fontFamily: 'RoundedMplus1c-Regular',
          fontSize: normalize(16),
          letterSpacing: 0.5,
        }}
        maxLength={1000}
        placeholder={'Description'}
        placeholderTextColor={'#c7c7c7'}
        underlineColorAndroid={'transparent'}
      />
      <AppInput
        label="Location Address"
        customStyle={{marginBottom: 16}}
        value={storeLocation}
        onChangeText={(text) => setStoreLocation(text)}
      />

      <AppInput
        label="Payment Method"
        placeholder="Eg: Cash, Gcash"
        customStyle={{marginBottom: 64}}
        value={paymentMethod}
        onChangeText={(text) => setPaymentMethod(text)}
      />

      <TouchableOpacity
        onPress={navigateToPost}
        activeOpacity={0.7}
        disabled={buttonEnabled}
        style={{
          backgroundColor: buttonEnabled
            ? Colors.neutralsGainsboro
            : Colors.primaryYellow,
          paddingVertical: 12,
          alignItems: 'center',
        }}>
        <AppText textStyle="button2">
          {initialData.post_id ? 'Update' : 'Publish'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default ServicePostForm;
