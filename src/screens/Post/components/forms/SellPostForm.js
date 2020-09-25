import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import storage from '@react-native-firebase/storage';
// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';

/*Map Essentials*/
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import Modal from 'react-native-modal';
import StoreLocation from '../StoreLocation';
/*Map Essentials*/

import {
  ArrowRight,
  Public,
  ArrowDown,
  MenuInfo,
  PostInfo,
  PostAdd,
} from '@/assets/images/icons';
import {
  AppText,
  AppInput,
  Switch,
  AppButton,
  CacheableImage,
  TransitionIndicator,
  AppRadio,
  AppCheckbox,
} from '@/components';
import {normalize, Colors, GlobalStyle} from '@/globals';
import {PostService, ImageUpload, MapService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostImageUpload} from '../PostImageUpload';

const SellPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
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
  const [listAsSingle, setListAsSingle] = useState(false);
  const [listAsMultiple, setListAsMultiple] = useState(false);
  const [freeCheckbox, setFreeCheckbox] = useState(false);

  useEffect(() => {
    if (images) {
      setCameraImage(images);
    }
    if (initialData.post_id) {
      console.log('edit post');
      const {store_location} = initialData;
      MapService.getStringAddress(
        store_location.latitude,
        store_location.longitude,
        '',
        setStringAddress,
        setAddressComponents,
        addressComponents,
      );
    } else {
      if (userInfo.address) {
        const {address} = userInfo;
        MapService.getStringAddress(
          address.latitude,
          address.longitude,
          '',
          setStringAddress,
          setAddressComponents,
          addressComponents,
        );
      }
    }
  }, [address]);

  const prepareAddressUpdate = (fullAddress, addStr) => {
    MapService.getStringAddress(
      fullAddress.latitude,
      fullAddress.longitude,
      addStr,
      setStringAddress,
      setAddressComponents,
      addressComponents,
    );
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

  const togglePickupState = () => {
    setPickupState(!pickupState);
  };

  const toggleDeliveryState = () => {
    setDeliveryState(!deliveryState);
  };

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

  const publish = async () => {
    setLoadingSubmit(true);

    const data = {
      uid: user.uid,
      post_type: 'sell',
      images: await Promise.all(
        coverPhoto.map(
          async (image) => await ImageUpload.upload(image, user.uid),
        ),
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
      navToPost({
        ...res,
        viewing: false,
        created: true,
        edited: false,
      });
    }

    togglePostModal();
    setLoadingSubmit(false);
    setNeedsRefresh(true);
    setCoverPhoto([]);
    setLibImages([]);
    setCameraImage([]);
    setSingleCameraImage([]);
    setSelected([]);
    setImageCurrent('');
  };

  const RadioStateHandler = (val) => {
    if (val === 'single') {
      setListAsMultiple(false);
      setListAsSingle(true);
      showSingle();
      hideMultiple();
    }
    if (val === 'multiple') {
      setListAsMultiple(true);
      setListAsSingle(false);
      hideSingle();
      showMultiple();
    }
  };

  /**FOR ANIMATION */
  const [singleActiveHeight] = useState(new Animated.Value(0));
  const [singleActiveOpacity] = useState(new Animated.Value(0));
  const [multipleActiveHeight] = useState(new Animated.Value(0));
  const [multipleActiveOpacity] = useState(new Animated.Value(0));

  let multipleActiveStyle = {
    height: multipleActiveHeight,
    opacity: multipleActiveOpacity,
  };

  let singleActiveStyle = {
    height: singleActiveHeight,
    opacity: singleActiveOpacity,
  };

  const showSingle = async () => {
    Animated.sequence([
      Animated.timing(singleActiveHeight, {
        toValue: 110,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(singleActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideSingle = async () => {
    Animated.sequence([
      Animated.timing(singleActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(singleActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const showMultiple = async () => {
    Animated.sequence([
      Animated.timing(multipleActiveHeight, {
        toValue: 54,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(multipleActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideMultiple = async () => {
    Animated.sequence([
      Animated.timing(multipleActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(multipleActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  /**FOR ANIMATION */

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
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: 'red',
            alignItems: 'center',
            marginBottom: 12,
            justifyContent: 'space-between',
          }}>
          <AppText textStyle="caption" customStyle={{fontSize: 16}}>
            Who can see your post?*
          </AppText>
          <TouchableOpacity activeOpacity={0.7}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.checkboxBorderDefault,
                borderRadius: 4,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}>
              <Public />
              <AppText
                customStyle={{paddingLeft: 4}}
                color={Colors.checkboxBorderDefault}
                textStyle="caption">
                Public
              </AppText>
              <View style={{paddingLeft: 12}}>
                <ArrowDown />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <PostImageUpload />

        <AppInput
          customStyle={{marginBottom: 16}}
          label="Title"
          placeholder="Eg. Iphone, Macbook"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        {/* <AppInput
          customStyle={{marginBottom: 16}}
          label="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
        /> */}

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
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingVertical: 32,
          borderRadius: 4,
          marginBottom: 8,
        }}>
        <AppRadio
          label="List as Single Item"
          value={listAsSingle}
          style={{paddingLeft: 0}}
          valueChangeHandler={() => RadioStateHandler('single')}
        />

        <Animated.View style={[singleActiveStyle]}>
          <AppInput
            customStyle={{marginBottom: 16}}
            label="Price"
            value={price}
            onChangeText={(text) => setPrice(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setFreeCheckbox(!freeCheckbox)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PostInfo />
                <AppText
                  customStyle={{paddingLeft: 4}}
                  textStyle="caption"
                  color={Colors.contentPlaceholder}>
                  I'm offering this item for{' '}
                  <AppText
                    customStyle={{fontWeight: 'bold'}}
                    color={Colors.contentPlaceholder}>
                    FREE.
                  </AppText>
                </AppText>
              </View>
            </TouchableOpacity>

            <AppCheckbox
              value={freeCheckbox}
              valueChangeHandler={() => setFreeCheckbox(!freeCheckbox)}
            />
          </View>
        </Animated.View>

        <Divider style={[GlobalStyle.dividerStyle, {marginVertical: 16}]} />

        <AppRadio
          label="List as Multiple Items"
          value={listAsMultiple}
          style={{paddingLeft: 0}}
          valueChangeHandler={() => RadioStateHandler('multiple')}
        />
        <AppText textStyle="caption" color={Colors.contentPlaceholder}>
          You can add more products and categories.
        </AppText>

        {/* IF statement here where we show the added items */}

        <Animated.View style={[multipleActiveStyle]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 24}}>
            <PostAdd width={normalize(24)} height={normalize(24)} />
            <AppText customStyle={{paddingLeft: 8}} textStyle="body2">
              Add an Item
            </AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingVertical: 32,
          borderRadius: 4,
          marginBottom: 8,
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
          onPress={publish}
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
            address={
              initialData.post_id
                ? initialData.store_location
                : userInfo.address
            }
            back={() => setMap(false)}
            changeFromMapHandler={(fullAddress, addStr) =>
              prepareAddressUpdate(fullAddress, addStr)
            }
          />
        </Modal>
        <TransitionIndicator loading={loadingSubmit} />
      </View>
    </>
  );
};

export default SellPostForm;
