import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';
import storage from '@react-native-firebase/storage';

import {AppText, AppInput, TransitionIndicator, AppButton} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {PostImageUpload} from '../PostImageUpload';
import {Context} from '@/context';

/*Map Essentials*/
import {ArrowRight} from '@/assets/images/icons';
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import Modal from 'react-native-modal';
import StoreLocation from '../StoreLocation';
/*Map Essentials*/
const NeedPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
  const {user, userInfo, setUserInfo} = useContext(UserContext);
  const {
    postImage,
    setPostImage,
    setImageCount,
    setImageCurrent,
    setNeedsRefresh,
    coverPhoto,
    setCoverPhoto,
    setCountSelect,
    setSelected
  } = useContext(Context);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  //const [postImages, setPostImages] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // console.log('post images', postImages);

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

  const clearForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setStoreLocation('');
    setPaymentMethod('');
  };

  const checkFormContent = () => {
    if (title && price && paymentMethod) return setButtonEnabled(false);

    return setButtonEnabled(true);
  };

  useEffect(() => {
    // if (images !== undefined) {
    //   setPostImage(images)
    // }
    checkFormContent();
  }, [title, price, storeLocation, paymentMethod, description]);

  // const filteredImage = coverPhoto.filter(image => image.includes('firebasestorage.googleapis.com'));

  // const uploadImageHandler = async (image) => {
  //   console.log('I got the image Need');
  //   console.log(image);

  //   if (image) {
  //     if (!filteredImage.includes(image)) {
  //       const newFilename =
  //         Platform.OS === 'ios'
  //           ? image.substring(0, image.lastIndexOf('.'))
  //           : image.substring(image.lastIndexOf('/') + 1);
  //       const uploadUri =
  //         Platform.OS === 'ios' ? image.replace('file://', '') : image;

  //       const task = storage().ref();
  //       const fileRef = task.child(`${user.uid}/post-photo/${newFilename}`);
  //       await fileRef.putFile(uploadUri);
  //       const downloadURL = await fileRef.getDownloadURL();

  //       return Promise.resolve(downloadURL);
  //     } else {
  //       return Promise.resolve(image);
  //     }
  //   } else {
  //     return Promise.reject('Failed to upload');
  //   }
  // };

  const uploadImageHandler = async (image) => {
    try {
      if (image.includes('firebasestorage.googleapis.com')) return image

      const newFilename =
        Platform.OS === 'ios'
          ? image.substring(0, image.lastIndexOf('.'))
          : image.substring(image.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? image.replace('file://', '') : image;

      const task = storage().ref();
      const fileRef = task.child(`${user.uid}/post-photo/${newFilename}`);
      await fileRef.putFile(uploadUri);
      const downloadURL = await fileRef.getDownloadURL();

      // return Promise.resolve(downloadURL)
      return downloadURL
    } catch(err) {
      console.log(err)
      // return Promise.reject("Failed to upload")
    }
  };

  const navigateToPost = async () => {
    setLoadingSubmit(true);
    setPostImage([]);
    setCoverPhoto([]);
    setCountSelect([]);
    setSelected([]);
    setImageCount(0);
    setImageCurrent('');
    let type = 'Need';
    let data = {
      uid: user.uid,
      post_type: type,
      images: await Promise.all(coverPhoto.map(async image => await uploadImageHandler(image))),
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

    if (initialData.post_id) {
      PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost({...res, viewing: false, created: false, edited: true});
          setLoadingSubmit(false);
        },
      );
    } else {
      PostService.createPost(data).then((res) => {
        setLoadingSubmit(false);
        setUserInfo({...userInfo, post_count: userInfo.post_count + 1});
        togglePostModal();
        setNeedsRefresh(true);
        setTimeout(() => {
          navToPost({...res, viewing: false, created: true, edited: false});
        }, 500);
      });
    } 

    // Upload images
    // const uploadAllImage = () =>
    //   Promise.all(
    //     coverPhoto.map((image) => {
    //       return uploadImageHandler(image)
    //         .then((res) => {
    //           console.log('res', res);
    //           return res;
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //           return err;
    //         });
    //     }),
    //   );

    // await uploadAllImage().then((response) => {
    //   data.images = response;
    // });

    // if (initialData.post_id) {
    //   return await PostService.editPost(initialData.post_id, data).then(
    //     (res) => {
    //       togglePostModal();
    //       navToPost({...res, viewing: false, created: false, edited: true});
    //       setLoadingSubmit(false);
    //     },
    //   );
    // }

    // return await PostService.createPost(data).then((res) => {
    //   togglePostModal();
    //   setUserInfo({...userInfo, post_count: userInfo.post_count + 1});
    //   navToPost({...res, viewing: false, created: true, edited: false});
    //   setLoadingSubmit(false);
    //   setNeedsRefresh(true);
    // });
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

      <PostImageUpload data={images === 0 || images === undefined ? null : images} />

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
        scrollEnabled={false}
      />
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
      <TransitionIndicator loading={loadingSubmit} />
    </View>
  );
};

export default NeedPostForm;
