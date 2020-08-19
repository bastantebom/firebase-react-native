import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import storage from '@react-native-firebase/storage';

// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import {
  AppText,
  AppInput,
  Switch,
  AppButton,
  TabNavigation,
  BottomSheetHeader,
} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {PostImages, CloseLight} from '@/assets/images/icons';
import {Library} from '../Library';
import {PostCamera} from '../Camera';

const {height, width} = Dimensions.get('window');

const SellPostForm = ({navToPost, togglePostModal, formState, initialData}) => {
  const {user} = useContext(UserContext);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [imageSource, setImageSource] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [postImageCount, setPostImageCount] = useState(initialData?.images?.length);
  const [postImages, setPostImages] = useState(initialData?.images);

  const cancelPickerModal = () => {
    setShowPickerModal(!showPickerModal);
    setSelected(selected);
    setPhotoCount(photoCount);
  };

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      includeBase64: true,
    })
      .then((response) => {
        const source = response.path;
        setImageSource([...imageSource, {source}]);
        console.log('imageSource', imageSource);
        setPhotoCount(photoCount + 1);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const togglePickerModal = (selected, photoCount) => {
    setShowPickerModal(!showPickerModal);
    setSelected(selected);
    setPhotoCount(photoCount);
  };

  const handleRemove = (image) => {
    const imageToRemove = image.uri;
    const newImageList = postImages.filter(
      (image) => image.uri !== imageToRemove,
    );
    setPostImages(newImageList);
    setPostImageCount(postImageCount - 1);
  };

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              request(PERMISSIONS.IOS.CAMERA).then((result) => {
                console.log(result);
              });
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              togglePickerModal(selected, photoCount);
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore',
              );
              break;
          }
        })
        .catch((error) => {
          // …
          console.log('NOT ALLOWEDD!!');
        });
    } else
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          // PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can access your camera roll');
          // setShowPickerModal(true);
          togglePickerModal(selected, photoCount);
        } else {
          return null;
        }
      } catch (err) {
        console.log(err);
      }
  };

  const cancelUploadPhoto = () => {
    // setSelected([...selected, {}]);
    // setPhotoCount(photoCount);
    togglePickerModal(selected, photoCount);
  };

  const continueUploadPhoto = (selected, photoCount) => {
    setPostImages([...postImages, ...selected]);
    setPostImageCount(postImageCount + photoCount);
    togglePickerModal(selected, photoCount);
  };

  console.log('postImages', postImages);

  const cancelCamera = () => {
    togglePickerModal(selected, photoCount);
  };

  const continueCamera = (selected, photoCount) => {
    setPostImages([...postImages, selected]);
    setPostImageCount(postImageCount + photoCount);
    togglePickerModal(selected, photoCount);
  };

  // console.log(...selected)
  // console.log(selected)

  const uploadTabs = [
    {
      key: 'camera',
      title: 'Photo',
      renderPage: <PostCamera cancel={cancelCamera} next={continueCamera} />,
    },
    {
      key: 'cameraroll',
      title: 'Library',
      renderPage: (
        <Library cancel={cancelUploadPhoto} next={continueUploadPhoto} />
      ),
    },
  ];

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
        {postImageCount === 0 ? (
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => requestPermission()}>
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
              marginBottom: 8,
              // justifyContent: 'center',
            }}>
            <ScrollView horizontal>
              {postImages.map((image, i) => {
                return (
                  <View key={i}>
                    <TouchableOpacity
                      onPress={() => handleRemove(image)}
                      // onPress={() => console.log(image.uri)}
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        right: 20,
                        top: 5,
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: 'rgba(0,0,0,.6)',
                          width: normalize(28),
                          height: normalize(28),
                          borderRadius: 50,
                        }}
                      />
                      <View
                        style={{left: normalize(3.75), top: normalize(3.5)}}>
                        <CloseLight
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                      </View>
                    </TouchableOpacity>
                    <Image
                      source={{uri: image.uri}}
                      style={{
                        width:
                          postImageCount === 1
                            ? width / 2
                            : postImageCount === 2
                            ? width / 3.333
                            : width / 4,
                        height: normalize(114),
                        marginRight: 8,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View
              style={{
                // flex: 1,
                height: normalize(114),
                borderStyle: 'dashed',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: Colors.neutralGray,
                justifyContent: 'center',
                // marginBottom: 8,
                width: postImageCount <= 1 ? width / 3 : width / 4,
                marginLeft: postImageCount >= 3 ? 8 : 0,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => requestPermission()}>
                <View style={{alignSelf: 'center', alignItems: 'center'}}>
                  <PostImages width={normalize(56)} height={normalize(56)} />
                  <AppText
                    textStyle="body2"
                    color={Colors.contentOcean}
                    customStyle={{paddingHorizontal: 15, textAlign: 'center'}}>
                    Upload Photo
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <AppText textStyle="metadata" customStyle={{marginBottom: 16}}>
          <AppText customStyle={{fontWeight: 'bold'}}>
            Photos - {postImageCount}/10
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
      <Modal
        isVisible={showPickerModal}
        onBackButtonPress={() => togglePickerModal(selected, photoCount)}
        // Comment this out to disable closing on swipe down
        // onSwipeComplete={() => togglePickerModal(selected, photoCount)}
        // swipeDirection="down"
        // Comment this out to disable closing on swipe down
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: '100%',
          }}>
          <TabNavigation routesList={uploadTabs} bottomTab />
        </View>
      </Modal>
    </>
  );
};

export default SellPostForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: width,
    height: '100%',
    // paddingTop: 25,
    // backgroundColor: '#F6AE2D',
    zIndex: -2,
  },
});
