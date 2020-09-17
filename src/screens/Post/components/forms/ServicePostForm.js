import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import storage from '@react-native-firebase/storage';

import Config from '@/services/Config';
import Modal from 'react-native-modal';
import StoreLocation from '../StoreLocation';
import {PostService} from '@/services';
import {PostImageUpload} from '../PostImageUpload';
import {AppText, AppInput, TransitionIndicator} from '@/components';
import {normalize, Colors} from '@/globals';
import {ArrowRight} from '@/assets/images/icons';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';

const ServicePostForm = ({
  navToPost,
  togglePostModal,
  formState,
  initialData,
}) => {
  const {userInfo, user, setUserInfo} = useContext(UserContext);
  const {
    coverPhoto,
    setNeedsRefresh,
    setCoverPhoto,
    setLibImages,
    setCameraImage,
    setSingleCameraImage,
    setSelected,
    setImageCurrent,
  } = useContext(Context);
  const [stringAddress, setStringAddress] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [map, setMap] = useState(false);
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });
  const {
    title,
    setTitle,
    images,
    price,
    setPrice,
    description,
    setDescription,
    paymentMethod,
    setPaymentMethod,
    pickupState,
    deliveryState,
  } = formState;

  useEffect(() => {
    if (images) {
      setCameraImage(images);
    }

    if (userInfo.address) {
      const {address} = userInfo;
      getStringAddress(address.latitude, address.longitude);
    }
  }, []);

  const toggleMap = () => {
    setMap(!map);
  };

  const prepareAddressUpdate = (fullAddress, addStr) => {
    getStringAddress(fullAddress.latitude, fullAddress.longitude, addStr);
  };

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
        });
      })
      .catch((error) => console.warn(error));
  };

  const checkFormContent = () => {
    if (title && price && paymentMethod) return setButtonEnabled(false);

    return setButtonEnabled(true);
  };

  useEffect(() => {
    checkFormContent();
  }, [title, price, paymentMethod, description]);

  const uploadImageHandler = async (image) => {
    try {
      if (image.includes('firebasestorage.googleapis.com')) return image;

      console.log('IMAGE');
      console.log(image);

      const newFilename =
        Platform.OS === 'ios'
          ? image
          : image.substring(image.lastIndexOf('/') + 1);

      const uploadUri =
        Platform.OS === 'ios' ? image.replace('file://', '') : image;

      // console.log('new file name');
      // console.log(newFilename);

      const task = storage().ref();
      const fileRef = task.child(`${user.uid}/post-photo/${newFilename}`);
      console.log('uploadUri ' + uploadUri);
      await fileRef.putFile(uploadUri);
      const downloadURL = await fileRef.getDownloadURL();
      console.log('downloadURL ' + downloadURL);
      return downloadURL;
    } catch (err) {
      console.log(err);
    }
  };

  const publish = async () => {
    setLoadingSubmit(true);

    const data = {
      uid: user.uid,
      post_type: 'service',
      images: await Promise.all(
        coverPhoto.map(async (image) => await uploadImageHandler(image)),
      ),
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
      const res = await PostService.editPost(initialData.post_id, data);
      clearContextState();
      navToPost({
        ...res,
        viewing: false,
        created: false,
        edited: true,
      });
    } else {
      const res = await PostService.createPost(data);
      setUserInfo({
        ...userInfo,
        post_count: userInfo.post_count + 1,
      });
      clearContextState();
      navToPost({
        ...res,
        viewing: false,
        created: true,
        edited: false,
      });
    }
  };

  const clearContextState = () => {
    togglePostModal();
    setLoadingSubmit(false);
    setNeedsRefresh(true);
    setCoverPhoto([]);
    setLibImages([]);
    setCameraImage([]);
    setSingleCameraImage(null);
    setSelected([]);
    setImageCurrent('');
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
      <PostImageUpload />

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
        onPress={publish}
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

export default ServicePostForm;
