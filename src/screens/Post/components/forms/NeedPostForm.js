import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

import {AppText, AppInput} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {PostImageUpload} from '../PostImageUpload';
/*Map Essentials*/
import {ArrowRight} from '@/assets/images/icons';
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import Modal from 'react-native-modal';
import StoreLocation from '../StoreLocation';
/*Map Essentials*/
const NeedPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
  const {user, userInfo, setUserInfo} = useContext(UserContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [postImages, setPostImages] = useState([]);

  console.log('post images', postImages);

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

  const getStringAddress = (lat, lng) => {
    Geocoder.init(Config.apiKey);
    Geocoder.from(lat, lng)
      .then((json) => {
        setStringAddress(json.results[1].formatted_address);
        const arrayToExtract =
          json.results.length == 12
            ? 7
            : json.results.length == 11
            ? 6
            : json.results.length == 10
            ? 6
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
        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: lat,
            longitude: lng,
            city: json.results[arrayToExtract].address_components[0].long_name,
            province:
              json.results[arrayToExtract].address_components[1].long_name,
            country: 'Philippines',
          },
          //setChangeMapAddress(addressComponent);
        });
      })
      .catch((error) => console.warn(error));
  };

  const prepareAddressUpdate = (fullAddress) => {
    getStringAddress(fullAddress.latitude, fullAddress.longitude);
  };

  const toggleMap = () => {
    setMap(!map);
  };
  /*MAP Essentials */

  const getImage = (postImages) => {
    setPostImages([...postImages]);
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
    let type = 'Need';
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

    if (initialData.post_id) {
      // console.log('I will edit post with id: ');
      // console.log(initialData.post_id)
      return await PostService.editPost(initialData.post_id, data).then(
        (res) => {
          togglePostModal();
          navToPost({...res, viewing: false, created: false, edited: true});

          console.log('CREATE A POST GOING TO SINGLEPOST');
          console.log({...res, edited: true});
        },
      );
    }

    return await PostService.createPost(data).then((res) => {
      togglePostModal();
      setUserInfo({...userInfo, post_count: userInfo.post_count + 1});
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
        // disabled={buttonEnabled}
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
          changeFromMapHandler={(fullAddress) =>
            prepareAddressUpdate(fullAddress)
          }
        />
      </Modal>
    </View>
  );
};

export default NeedPostForm;
