import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView, Image, StyleSheet, Text, Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-crop-picker';
import NativeImagePicker from 'react-native-image-picker';
import CameraRoll from "@react-native-community/cameraroll";
import CameraRollPicker from 'react-native-camera-roll-picker';
import Modal from 'react-native-modal';

import {AppText, AppInput, AppButton, TabNavigation} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostImages, CloseLight} from '@/assets/images/icons';
import { CameraId } from '@/screens/Dashboard/Verification/components/CameraId';
import { AppCamera } from '@/components/Camera/AppCamera';


function Library({photoCount, selected, getSelectedImages}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.bold}> {photoCount} </Text> images has been selected
        </Text>
      </View>
      <ScrollView horizontal>
      <CameraRollPicker
        groupTypes='All'
        maximum={10}
        selected={selected}
        // assetType='Photos'
        imagesPerRow={3}
        imageMargin={5}
        callback={getSelectedImages} 
      />
      </ScrollView>
    </View>
  )
}

const { height, width } = Dimensions.get('window');

const SellPostForm = ({navToPost, togglePostModal}) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [imageSource, setImageSource] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const cancelPickerModal = () => {
    setShowPickerModal(!showPickerModal);
  };

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      // cropping: true,
      // multiple: true,
      // mediaType: 'photo',
      includeBase64: true,
    })
    .then((response) => {
      const source = response.path;
      // console.log('source:', source);
      setImageSource([...imageSource, { source }]);
      console.log('imageSource', imageSource)
      setPhotoCount(photoCount + 1)
      // const uri = image.path;
      // setImageSource(uri)
      // console.log(image.filename)
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const handleRemove = () => {
    const newImg = imageSource.filter((t) => t);
    setImageSource(newImg);
    console.log('Image removed')
  }

  const getSelectedImages = (images, current) => {
    var num = images.length;

    setPhotoCount(num)
    setSelected(images)

    // console.log(current);
    // console.log(selected);
    console.log(photoCount)
  }

  let uploadTabs = [
    {key: 'camera', title: 'Photo', renderPage: <AppCamera />},
    {key: 'cameraroll', title: 'Library', renderPage: <Library photoCount={photoCount} selected={selected} getSelectedImages={getSelectedImages} />},
  ];

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

  const navigateToPost = () => {
    togglePostModal();
    navToPost({
      title: title,
      price: price,
      description: description,
      paymentMethod: paymentMethod,
      storeLocation: storeLocation,
      deliveryMethod: [pickupState, deliveryState]
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
        {imageSource.length === 0 ? (
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
            <TouchableOpacity 
              activeOpacity={0.7} 
              // onPress={() => handleSelect()}
              // onPress={() => handleCameraRoll()}
              onPress={() => setShowPickerModal(true)}
            >
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
              height: normalize(114),
              width: '100%',
              flexDirection: 'row',
              marginBottom: 25,
              // justifyContent: 'center',
            }}
          >
          <ScrollView horizontal >
            {imageSource.map((image, i) => {
              return (
                <View key={i}>
                  <TouchableOpacity 
                    onPress={() => handleRemove()}
                    style={{ zIndex: 999, position: 'absolute', right: 20, top: 5 }} 
                  >
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,.6)',
                        width: (normalize(28)),
                        height: (normalize(28)),
                        borderRadius: 50,
                      }}
                    />
                    <View style={{ left: normalize(3.75), top: normalize(3.5) }}>
                      <CloseLight width={(normalize(20))} height={(normalize(20))} />
                    </View>
                  </TouchableOpacity>
                  <Image 
                    // source={{uri: image.source}} 
                    source={{uri: image.node.image.uri }} 
                    style={{
                      // width: '100%',
                      width: normalize(84),
                      // height: '100%',
                      height: normalize(114),
                      marginRight: 8,
                      borderRadius: 4
                    }}
                  />
                </View>
              )
            })}
          </ScrollView>
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
            <TouchableOpacity 
              activeOpacity={0.7} 
              // onPress={() => handleSelect()}
              // onPress={() => handleCameraRoll()}
              onPress={() => setShowPickerModal(true)}
            >
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
          <Switch
            value={pickupState}
            onValueChange={togglePickupState}
            disabled={false}
            renderActiveText={false}
            renderInActiveText={false}
            circleSize={16}
            barHeight={24}
            circleBorderWidth={0}
            backgroundActive={Colors.primaryYellow}
            backgroundInactive={Colors.switchDisable}
            switchWidthMultiplier={2.5}
            switchBorderRadius={12}
          />
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
          <Switch
            value={deliveryState}
            onValueChange={toggleDeliveryState}
            disabled={false}
            renderActiveText={false}
            renderInActiveText={false}
            circleSize={16}
            barHeight={24}
            circleBorderWidth={0}
            backgroundActive={Colors.primaryYellow}
            backgroundInactive={Colors.switchDisable}
            switchWidthMultiplier={2.5}
            switchBorderRadius={12}
          />
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
          }}>
          <AppText textStyle="button2">Publish</AppText>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={showPickerModal}
        // animationIn="bounceIn"
        // animationInTiming={450}
        // animationOut="bounceOut"
        // animationOutTiming={450}
        onSwipeComplete={() => setShowPickerModal(false)}
        swipeDirection="down"
        style={{
          // margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            height: height,
            width: width,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* <TabNavigation routesList={uploadTabs} /> */}
          <Library photoCount={photoCount} selected={selected} getSelectedImages={getSelectedImages} />
          {/* <AppCamera/> */}
        </View>
      </Modal>
    </>
  );
};

export default SellPostForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    backgroundColor: '#F6AE2D',
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
})