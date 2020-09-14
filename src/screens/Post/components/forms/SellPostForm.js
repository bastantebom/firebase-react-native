import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import storage from '@react-native-firebase/storage';
/*Map Essentials*/
import {ArrowRight} from '@/assets/images/icons';
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import Modal from 'react-native-modal';
import StoreLocation from '../StoreLocation';
/*Map Essentials*/

// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

import {
  AppText,
  AppInput,
  Switch,
  AppButton,
  CacheableImage,
} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostImageUpload} from '../PostImageUpload';

const SellPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
  const {
    postImage,
    setPostImage,
    setImageCount,
    setImageCurrent,
    setNeedsRefresh,
  } = useContext(Context);
  const {user, userInfo, setUserInfo} = useContext(UserContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  /*MAP Essentials */
  const [map, setMap] = useState(false);
  const {address} = userInfo;
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });
  const [showLocation, setShowLocation] = useState(false);
  const [stringAddress, setStringAddress] = useState('');

  useEffect(() => {
    // Notification for Verifying the profile
    // openNotification();
    if (address) {
      getStringAddress(address.latitude, address.longitude);
    }
  }, [address]);

  const getStringAddress = (lat, lng, addStr) => {
    Geocoder.init(Config.apiKey);
    Geocoder.from(lat, lng)
      .then((json) => {
        setStringAddress(addStr ? addStr : json.results[1].formatted_address);
        const arrayToExtract =
          json.results.length == 14
            ? 9
            : json.results.length == 13
            ? 8
            : json.results.length == 12
            ? 7
            : json.results.length == 11
            ? 6
            : json.results.length == 10
            ? 5
            : json.results.length == 9
            ? 4
            : json.results.length == 8
            ? 3
            : json.results.length < 8
            ? 2
            : 2;
        /*setCityName(
          json.results[arrayToExtract].address_components[0].long_name,
        );*/
        const splitAddress = json.results[
          arrayToExtract
        ].formatted_address.split(',');

        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: lat,
            longitude: lng,
            city: splitAddress[0],
            province: splitAddress[1],
            country: splitAddress[2],
          },
          //setChangeMapAddress(addressComponent);
        });
      })
      .catch((error) => console.warn(error));
  };

  const prepareAddressUpdate = (fullAddress, addStr) => {
    getStringAddress(fullAddress.latitude, fullAddress.longitude, addStr);
  };

  const toggleMap = () => {
    setMap(!map);
  };
  /*MAP Essentials */

  // console.log('SellPostForm', postImage);

  const {
    title,
    setTitle,
    images,
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
    if (title && price && (pickupState || deliveryState) && paymentMethod)
      return setButtonEnabled(false);

    return setButtonEnabled(true);
  };

  useEffect(() => {
    if (images !== undefined) {
      setPostImage(images);
    }
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
  // console.log(postImage)

  const uploadImageHandler = async (image) => {
    console.log('I got the image');
    console.log('image', image);

    if (image) {
      const {uri, filename} = image;
      // const filename = uri.substring(uri.lastIndexOf('/') + 1);

      if (uri || filename) {
        const newFilename =
          Platform.OS === 'ios'
            ? filename.substring(0, filename.lastIndexOf('.'))
            : uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        const task = storage().ref();
        const fileRef = task.child(`${user.uid}/post-photo/${newFilename}`);
        await fileRef.putFile(uploadUri);
        const downloadURL = await fileRef.getDownloadURL();

        return Promise.resolve(downloadURL);

        // return Promise.resolve('image');
      } else {
        return Promise.resolve(image);
      }
    } else {
      return Promise.reject('Failed to upload');
    }
  };

  const navigateToPost = async () => {
    //console.log(postImage);
    setLoadingSubmit(true);
    setPostImage([]);
    setImageCount(0);
    setImageCurrent('');
    let type = 'Sell';
    let data = {
      uid: user.uid,
      post_type: type,
      images: [],
      title: title,
      price: price,
      description: description,
      payment_method: paymentMethod,
      store_location: addressComponents,
      delivery_method: {
        pickup: pickupState,
        delivery: deliveryState,
      },
    };

    // compare if images are the same with initial data --- when editing
    // Upload images

    const uploadAllImage = () =>
      Promise.all(
        postImage.map((image) => {
          return uploadImageHandler(image)
            .then((res) => {
              console.log('res', res);
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

    // Upload Image

    if (initialData.post_id) {
      return await PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost({...res, viewing: false, created: false, edited: true});
          setLoadingSubmit(false);
        },
      );
    }

    return await PostService.createPost(data).then((res) => {
      setLoadingSubmit(false);
      setUserInfo({...userInfo, post_count: userInfo.post_count + 1});
      togglePostModal();
      setNeedsRefresh(true);
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
        <PostImageUpload
          data={images === undefined || images.length == 0 ? null : images}
        />

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

        <TextInput
          value={description}
          multiline={true}
          placeholder="Description"
          placeholderTextColor={Colors.neutralGray}
          numberOfLines={Platform.OS === 'ios' ? null : 6}
          minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
          style={{
            color: Colors.contentEbony,
            fontFamily: 'RoundedMplus1c-Regular',
            fontSize: normalize(16),
            letterSpacing: 0.5,
            borderColor: Colors.neutralGray,
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 16,
            textAlign: 'left',
          }}
          onChangeText={(text) => setDescription(text)}
          underlineColorAndroid={'transparent'}
          textAlignVertical="top"
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
        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => toggleMap()}>
            <AppInput
              label="Location Address"
              customStyle={{marginBottom: 16}}
              value={stringAddress}
              //onChangeText={(text) => setStoreLocation(text)}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                right: 12,
              }}>
              <ArrowRight height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>
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
          disabled={buttonEnabled || loadingSubmit}
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
        <Modal
          isVisible={map}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onBackButtonPress={() => setMap(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <StoreLocation
            address={userInfo.address}
            back={() => setMap(false)}
            changeFromMapHandler={(fullAddress, addStr) =>
              prepareAddressUpdate(fullAddress, addStr)
            }
          />
        </Modal>
      </View>
    </>
  );
};

export default SellPostForm;
