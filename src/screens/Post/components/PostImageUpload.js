import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import {
  AppText,
  TabNavigation,
  BottomSheetHeader,
  CacheableImage,
} from '@/components';
import {normalize, Colors} from '@/globals';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostImages, CloseLight} from '@/assets/images/icons';
import {PostCamera} from './Camera';
import {Library} from './Library';

const {height, width} = Dimensions.get('window');

export const PostImageUpload = ({ data }) => {
  const {
    setPostImage,
    postImage,
    setImageCount,
    imageCount,
    setImageCurrent,
    imageCurrent,
  } = useContext(Context);

  const [photoCount, setPhotoCount] = useState(0);
  const [selected, setSelected] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [postImageCount, setPostImageCount] = useState(0);
  const [postImages, setPostImages] = useState([]);

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
              togglePickerModal();
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
          togglePickerModal();
        } else {
          return null;
        }
      } catch (err) {
        console.log(err);
      }
  };

  const togglePickerModal = () => {
    setShowPickerModal(!showPickerModal);
    // setSelected(selected);
    // setPhotoCount(photoCount);
  };

  const handleRemove = (image) => {
    const imageToRemove = image.uri;
    const newImageList = postImage.filter(
      (image) => image.uri !== imageToRemove,
    );
    setPostImage(newImageList);
    setImageCount(imageCount - 1);
  };

  const cancelUploadPhoto = () => {
    // setPostImage([...postImage])
    // setPhotoCount(photoCount);
    togglePickerModal();
  };

  // const continueUploadPhoto = (postImage, imageCount) => {
  //   setPostImage(postImage)
  //   setImageCount(imageCount)
  //   // setPostImageCount(imageCount)
  //   togglePickerModal();
  // };

  const continueUploadPhoto = (postImage, imageCount) => {
    setPostImage(postImage);
    setImageCount(imageCount);
    togglePickerModal();
  };

  const cancelCamera = () => {
    togglePickerModal();
  };

  const continueCamera = (selected, photoCount) => {
    setPostImage([...postImage, selected]);
    setImageCount(imageCount + photoCount);
    // setCurrentImage(currentImage)
    togglePickerModal();
  };

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
        <Library
          cancel={cancelUploadPhoto}
          next={continueUploadPhoto}
        />
      ),
    },
  ];

  console.log('postImage', postImage)
  console.log('imageCount', imageCount)
  // console.log('data', data)

  useEffect(() => {
    if (data === null || data.length === 0 ) {
      return console.log('no data');
    } 
    if (data !== null || data.length !== 0) {
      setImageCount(data.length)
      setPostImage(data)
    }
  }, [imageCount, postImage]); 

  return (
    <>
      {imageCount === 0 ? (
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
          {data !== null ? 
            <ScrollView horizontal>
              {data.map((image, i) => {
                return (
                  <View key={i}>
                    <TouchableOpacity
                      onPress={() => handleRemove(image)}
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
                      <View style={{left: normalize(3.75), top: normalize(3.5)}}>
                        <CloseLight
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                      </View>
                    </TouchableOpacity>
                    <CacheableImage
                      source={{uri: image}}
                      style={{
                        width:
                          imageCount === 1
                            ? width / 2
                            : imageCount === 2
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
            :
            <ScrollView horizontal>
              {postImage.map((image, i) => {
                return (
                  <View key={i}>
                    <TouchableOpacity
                      onPress={() => handleRemove(image)}
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
                      <View style={{left: normalize(3.75), top: normalize(3.5)}}>
                        <CloseLight
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                      </View>
                    </TouchableOpacity>
                    <CacheableImage
                      source={{uri: image.uri}}
                      style={{
                        width:
                          imageCount === 1
                            ? width / 2
                            : imageCount === 2
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
           }
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
              width: imageCount <= 1 ? width / 3 : width / 4,
              marginLeft: imageCount >= 3 ? 8 : 0,
            }}>
            <TouchableOpacity
              disabled={imageCount === 10 && true}
              activeOpacity={0.7}
              onPress={() => requestPermission()}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  opacity: imageCount === 10 ? 0.5 : 1,
                }}>
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
          Photos - {imageCount}/10
        </AppText>{' '}
        Choose your listing’s main photo first for Cover Photo. And more photos
        with multiple angles to show any damage or wear.
      </AppText>

      <Modal
        isVisible={showPickerModal}
        onBackButtonPress={() => togglePickerModal()}
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
