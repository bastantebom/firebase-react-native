import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

import {AppText, AppInput} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostImages} from '@/assets/images/icons';

const NeedPostForm = ({navToPost, togglePostModal}) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const togglePickupState = () => {
    setPickupState(!pickupState);
  };

  const toggleDeliveryState = () => {
    setDeliveryState(!deliveryState);
  };

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [pickupState, setPickupState] = useState(false);
  const [deliveryState, setDeliveryState] = useState(false);
  const [storeLocation, setStoreLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const clearForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setPickupState(false);
    setDeliveryState(false);
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
  }, [
    title,
    price,
    pickupState,
    deliveryState,
    storeLocation,
    paymentMethod,
    description,
  ]);

  const navigateToPost = () => {
    togglePostModal();
    navToPost({
      title: title
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
      <View
        style={{
          height: normalize(114),
          borderStyle: 'dashed',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: Colors.neutralGray,
          justifyContent: 'center',
          marginBottom: 8,
        }}>
        <TouchableOpacity activeOpacity={0.7}>
          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <PostImages width={normalize(56)} height={normalize(56)} />
            <AppText textStyle="body2" color={Colors.contentOcean}>
              Upload Cover Photos
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
      <AppText textStyle="metadata" customStyle={{marginBottom: 16}}>
        <AppText customStyle={{fontWeight: 'bold'}}>
          Photos - {photoCount}/10
        </AppText>{' '}
        Choose your listing’s main photo first for Cover Photo. And more photos
        with multiple angles to show any damage or wear.
      </AppText>

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
        // disabled={buttonEnabled}
        style={{
          backgroundColor: buttonEnabled
            ? Colors.neutralsGainsboro
            : Colors.primaryYellow,
          paddingVertical: 12,
          alignItems: 'center',
        }}>
        <AppText textStyle="button2">Publish</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default NeedPostForm;
