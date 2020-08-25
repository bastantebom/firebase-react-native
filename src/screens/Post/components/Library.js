import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Modal from 'react-native-modal';

import {
  AppText,
} from '@/components';
import {Context} from '@/context';
import {normalize, Colors} from '@/globals';
import {ArrowDown} from '@/assets/images/icons';
import {PhotoAlbums} from './PhotoAlbums';

const {height} = Dimensions.get('window');

export const Library = ({
  cancel,
  next
}) => {

  const {setPostImage, postImage, setImageCount, imageCount, setImageCurrent, imageCurrent} = useContext(Context);

  const [selectedCount, setSelectedCount] = useState([]);
  const [showFolderList, setShowFolderList] = useState(false);
  const [selected, setSelected] = useState([]);
  const [photoCount, setPhotoCount] = useState(0);

  const getSelectedImages = async (images) => {
    var num = images.length;

    // setSelected([images]);
    // setPhotoCount(num);
    setPostImage(images);
    setImageCount(num);

    setImageCurrent(num > 0 ? images[num - 1].uri : '');

    // setSelectedCount(prev => [...prev, 0])
    // getData();
    // console.log('Selected', selected)
    // console.log('PostImage', postImage)
    // console.log('PhotoCount', photoCount)
  };

  const setToContext = (selected, photoCount) => {
    setPostImage(selected);
    setImageCount(photoCount);
  }
  

  // const lastItem = selectedCount.pop();
  // const lastItem = selectedCount;
  
  // const getData = () => {
  //   const arr = selectedCount;

  //   arr.forEach(function(i, idx, array){
  //     if (idx === array.length - 1){ 
  //       setCount(i)
  //     }
  //   });
  // }

  const toggleFolderList = () => {
    setShowFolderList(!showFolderList);
  };

  // console.log('Library', postImage)

  // useEffect(() => {
  //   getData();
  // }, [])

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
          }}
        >
          <TouchableOpacity
            onPress={cancel}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <AppText textStyle="body2">Cancel</AppText>
          </TouchableOpacity>
          <AppText textStyle="body1">All Photos</AppText>
          {/* <TouchableOpacity
            onPress={toggleFolderList}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppText textStyle="body1">All Photos</AppText>
              <ArrowDown height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            disabled={ postImage.length < 1 && true }
            onPress={() => {
              // setToContext(selected, photoCount),
              next(postImage, imageCount, imageCurrent)
            }}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <AppText textStyle="body3" color={ postImage.length < 1 ? Colors.buttonDisable : Colors.contentOcean}>
              Next
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
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
                Photos - {imageCount}/10{' '}
              </AppText>{' '}
              Choose your listing’s main photo first for Cover Photo.
            </AppText>
          </View>
          {imageCurrent ? (
            <Image
              source={{uri: imageCurrent}}
              style={{
                width: '100%',
                height: height / 2.2,
              }}
            />
          ) : null}
          <View style={{height: imageCurrent ? (height / 1.8) - normalize(122) : height - normalize(117), zIndex: -1}}>
            <CameraRollPicker
              groupTypes="All"
              maximum={10}
              scrollRenderAheadDistance={500}
              selected={postImage}
              imagesPerRow={3}
              imageMargin={2}
              selectedMarker={
                <View 
                  style={{ 
                    backgroundColor: Colors.contentOcean, 
                    width: 25, 
                    height: 25, 
                    borderRadius: 50, 
                    position: 'absolute', 
                    right: 4, 
                    top: 6 
                  }}
                >
                  {/* {selectedCount.map((item, index) =>  */}
                  {/* {Array.from({ length: postImage.length }).map((_, index) => ( */}
                    <AppText 
                      textStyle="subtitle1" 
                      color={Colors.neutralsWhite} 
                      customStyle={{ textAlign: 'center' }}
                      // key={index}
                    >
                      {imageCount}
                      {/* {count} */}
                    </AppText>
                   {/* ))}  */}
                  {/* )} */}
                </View>
              }
              callback={() => getSelectedImages(postImage)}
              emptyText={<AppText textStyle="body2">No photos</AppText>}
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
