import React, {useState, useEffect, useContext, useReducer} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {Switch} from 'react-native-switch';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-crop-picker';
import NativeImagePicker from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

import {
  AppText,
  AppInput,
  Switch,
  AppButton,
  TabNavigation,
  BottomSheetHeader,
  AppRadio,
  PaddingView,
} from '@/components';
import {normalize, Colors} from '@/globals';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import {PostImages, CloseLight, ArrowDown} from '@/assets/images/icons';
import {CameraId} from '@/screens/Dashboard/Verification/components/CameraId';
import {AppCamera} from '@/components/Camera/AppCamera';
import {PhotoAlbums} from './PhotoAlbums';

const {height, width} = Dimensions.get('window');

export const Library = ({
  // count,
  // isSelected,
  // callback,
  // current,
  cancel,
  next,
  // showFolders,
}) => {
  const [photoCount, setPhotoCount] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [selected, setSelected] = useState([]);
  const [folderCount, setFolderCount] = useState(0);
  const [showFolderList, setShowFolderList] = useState(false);

  const getSelectedImages = async (images) => {
    var num = images.length;
    setSelected(images);
    setPhotoCount(num);
    // console.log('photoCount', photoCount)
    setCurrentImage(num > 0 ? images[num - 1].uri : '');
  };

  const toggleFolderList = () => {
    setShowFolderList(!showFolderList);
  };

  // useEffect(() => {
  //   console.log('photoCount inside Library', photoCount);
  //   console.log('selected images inside Library', selected);
  //   // console.log('current', currentImage);
  // }, [photoCount, selected]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
          }}>
          <TouchableOpacity
            onPress={cancel}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <AppText textStyle="body2">Cancel</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFolderList}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <View style={{flexDirection: 'row'}}>
              <AppText textStyle="body1">All Photos</AppText>
              <ArrowDown height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={next}
            onPress={() => next(selected, photoCount)}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <AppText textStyle="body3" color={Colors.contentOcean}>
              Next
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View
            style={{
              position: 'absolute',
              top: 15,
              zIndex: 999,
              right: 0,
              left: 0,
              margin: 'auto',
            }}>
            <AppText
              textStyle="eyebrow2"
              customStyle={{alignItems: 'center', textAlign: 'center'}}
              color={Colors.neutralsWhite}>
              <AppText
                customStyle={{fontWeight: '700'}}
                color={Colors.neutralsWhite}>
                Photos - {photoCount}/10{' '}
              </AppText>{' '}
              Choose your listing’s main photo first for Cover Photo.
            </AppText>
          </View>
          {currentImage ? (
            <Image
              source={{uri: currentImage}}
              style={{
                width: '100%',
                height: height / 2,
              }}
            />
          ) : null}
          <View style={{height: '100%'}}>
            <CameraRollPicker
              groupTypes="All"
              maximum={10}
              scrollRenderAheadDistance={500}
              selected={selected}
              imagesPerRow={3}
              imageMargin={2}
              callback={() => getSelectedImages(selected)}
              emptyText={<AppText textStyle="body2">No photos</AppText>}
              // assetType="Videos"
              emptyTextStyle={{
                color: Colors.primaryYellow,
                width: '100%',
                height: '100%',
                paddingVertical: 45,
              }}
            />
          </View>
        </View>
        <Modal
          isVisible={showFolderList}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={500}
          onSwipeComplete={toggleFolderList}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={toggleFolderList}>
              <View style={{flex: 1, backgroundColor: 'black'}} />
            </TouchableWithoutFeedback>
          }>
          <PhotoAlbums />
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
