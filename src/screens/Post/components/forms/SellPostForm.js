import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-crop-picker';

import {AppText, AppInput, Switch} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostImages} from '@/assets/images/icons';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';

const SellPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
  const {user} = useContext(UserContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [imageSource, setImageSource] = useState(null);

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      // cropping: true,
      // multiple: true
      includeBase64: true,
    })
      .then((response) => {
        const source = {uri: response.path};
        console.log(source);
        setImageSource(source);
        // const uri = image.path;
        // setImageSource(uri)
        // console.log(image.filename)
      })
      .catch((e) => {
        console.log(e);
      });
  };

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

  const togglePickupState = () => {
    setPickupState(!pickupState);
  };

  const toggleDeliveryState = () => {
    setDeliveryState(!deliveryState);
  };

  // const [title, setTitle] = useState('');
  // const [price, setPrice] = useState('');
  // const [description, setDescription] = useState('');
  // const [pickupState, setPickupState] = useState(false);
  // const [deliveryState, setDeliveryState] = useState(false);
  // const [storeLocation, setStoreLocation] = useState('');
  // const [paymentMethod, setPaymentMethod] = useState('');

  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
    if (
      title &&
      price &&
      (pickupState || deliveryState) &&
      storeLocation &&
      paymentMethod
    )
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

  // const navigateToPost = () => {
  //   togglePostModal();
  //   navToPost({
  //     title: title,
  //     price: price,
  //     description: description,
  //     paymentMethod: paymentMethod,
  //     storeLocation: storeLocation,
  //     deliveryMethod: [pickupState, deliveryState]
  //   });
  // };

  const navigateToPost = async () => {
    setLoadingSubmit(true);
    let type = 'Sell';
    let data = {
      uid: user.uid,
      post_type: type,
      images: [],
      title: title,
      price: price,
      description: description,
      payment_method: paymentMethod,
      store_location: storeLocation,
      delivery_method: [
        pickupState ? 'pickup' : '',
        deliveryState ? 'delivery' : '',
      ],
    };

    if (initialData.post_id) {
      // console.log('I will edit post with id: ');
      // console.log(initialData.post_id)
      return await PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost(res);
        },
      );
    }

    return await PostService.createPost(data).then((res) => {
      setLoadingSubmit(false);
      togglePostModal();
      setTimeout(() => {
        navToPost(res);
      }, 500);
    });
  };

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          marginBottom: 8,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingBottom: 32,
        }}>
        {!imageSource ? (
          <View
            style={{
              height: normalize(114),
              borderStyle: 'dashed',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.neutralGray,
              justifyContent: 'center',
              marginBottom: 8,
              // maxWidth: imageSource && '25%'
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSelect()}>
              <View style={{alignSelf: 'center', alignItems: 'center'}}>
                <PostImages width={normalize(56)} height={normalize(56)} />
                <AppText textStyle="body2" color={Colors.contentOcean}>
                  Upload Cover Photos
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
          ) : (
          <View
            style={{
              // height: 150,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
          <Image 
            source={imageSource} 
            style={{
              width: '25%',
              height: '100%',
              height: normalize(114),
              marginBottom: 25,
              marginRight: 8,
              borderRadius: 4
            }}
          />
          {/* {imageSource.map((item, index) => {
            return (
              <Image 
                key={index}
                source={item.imageSource} 
                style={{
                  width: '25%',
                  height: '100%',
                  height: normalize(114),
                  marginBottom: 25,
                  marginRight: 8,
                  borderRadius: 4
                }}
              />
            )
          })} */}
          <View
            style={{
              height: normalize(114),
              borderStyle: 'dashed',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.neutralGray,
              justifyContent: 'center',
              marginBottom: 8,
              maxWidth: '25%'
            }}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSelect()}>
              <View style={{alignSelf: 'center', alignItems: 'center'}}>
                <PostImages width={normalize(56)} height={normalize(56)} />
                <AppText textStyle="body2" color={Colors.contentOcean} customStyle={{ paddingHorizontal: 15, textAlign: 'center' }}>
                  Upload Photo
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        )}

        <AppText textStyle="metadata" customStyle={{marginBottom: 16}}>
          <AppText customStyle={{fontWeight: 'bold'}}>
            Photos - {photoCount}/10
          </AppText>{' '}
          Choose your listing’s main photo first for Cover Photo. And more
          photos with multiple angles to show any damage or wear.
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
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingVertical: 32,
          borderRadius: 4,
          marginBottom: 16,
        }}>
        <AppText textStyle="subtitle2" customStyle={{marginBottom: 16}}>
          Delivery/Pick up Method
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <AppText textStyle="body2">Pickup</AppText>
          <Switch value={pickupState} onValueChange={togglePickupState} />
        </View>
        <AppInput
          label="Store Location"
          customStyle={{marginBottom: 16}}
          value={storeLocation}
          onChangeText={(text) => setStoreLocation(text)}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText textStyle="body2">Offer Delivery</AppText>
          <Switch value={deliveryState} onValueChange={toggleDeliveryState} />
        </View>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingVertical: 32,
          borderRadius: 4,
          marginBottom: 16,
          paddingBottom: 48,
        }}>
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
            height: 48,
            justifyContent: 'center',
          }}>
          {loadingSubmit ? (
            <ActivityIndicator />
          ) : (
            <AppText textStyle="button2">
              {initialData.post_id ? 'Update' : 'Publish'}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SellPostForm;
