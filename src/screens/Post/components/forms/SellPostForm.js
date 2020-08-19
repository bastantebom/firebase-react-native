import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import storage from '@react-native-firebase/storage';

// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

import {
  AppText,
  AppInput,
  Switch,
} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import { PostImageUpload } from '../PostImageUpload';

const SellPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
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

  // console.log("POST IMAGES")
  // console.log(postImages)

  const uploadImageHandler = async (image) => {
    console.log('I got the image');
    console.log(image);

    if (image) {
      const {uri, filename} = image;
      // const filename = uri.substring(uri.lastIndexOf('/') + 1);

      const newFilename = filename.substring(0, filename.lastIndexOf('.'));
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      const task = storage().ref();
      const fileRef = task.child(`${user.uid}/post-photo/${newFilename}`);
      await fileRef.putFile(uploadUri);
      const downloadURL = await fileRef.getDownloadURL();

      return Promise.resolve(downloadURL);
    } else {
      return Promise.reject('Failed to upload');
    }
  };

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
      delivery_method: {
        pickup: pickupState,
        delivery: deliveryState,
      },
    };

    // compare if images are the same with initial data --- when editing
    // Upload images
    const uploadAllImage = () =>
      Promise.all(
        postImages.map((image) => {
          return uploadImageHandler(image)
            .then((res) => {
              console.log(res);
              return res;
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        }),
      );

    await uploadAllImage().then((response) => {
      data.images = response;
    });

    if (initialData.post_id) {
      return await PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost({...res, viewing: false, created: false, edited: true});
        },
      );
    }

    return await PostService.createPost(data).then((res) => {
      setLoadingSubmit(false);
      togglePostModal();
      setTimeout(() => {
        navToPost({...res, viewing: false, created: true, edited: false});
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