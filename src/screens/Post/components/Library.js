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

import {AppText, CacheableImage} from '@/components';
import {Context} from '@/context';
import {normalize, Colors} from '@/globals';
import {ArrowDown} from '@/assets/images/icons';
import {PhotoAlbums} from './PhotoAlbums';

const {height, width} = Dimensions.get('window');

export const Library = ({cancel, next, data}) => {

  const {
    setPostImage,
    postImage,
    setImageCount,
    imageCount,
    setImageCurrent,
    imageCurrent,
    selected,
    setSelected
  } = useContext(Context);

  const [showFolderList, setShowFolderList] = useState(false);
  const [countSelect, setCountSelect] = useState(0);
  const [count, setCount] = useState([]);

  const checkIndex = (arr) => {
    const index = count.indexOf(arr);
    return index;
  };

  const getSelectedImages = async (images) => {
    var num = images.length;
    setImageCurrent(num > 0 ? images[num - 1].uri : '');

    setSelected(images);

    setCountSelect(num)
    
    const imageUrl = [];
    images.forEach(image => imageUrl.push(image.uri ? image.uri : image))
    
    setPostImage(imageUrl);

    const currentCount = count;
    const index = checkIndex(imageUrl);
    if (index === -1) {
      currentCount.push(imageUrl);
      setCount(currentCount);
    }
  };

  // console.log(count, 'count')

  const sum = imageCount + count.length

  // console.log(sum, 'sum')
  // console.log(num, 'num outside')

  // console.log('countSelect number of items/images selected on lib', countSelect)
  // console.log('count (data.length from postimageupload)', count)
  // console.log('imageCount', imageCount)

  useEffect(() => {
    if (data === null) {
      return console.log('no data');
    } 
    if (data !== null) {
      console.log('with data')
    }
  }, [data, countSelect])

  useEffect(() => {
  }, [imageCount])
  
  const toggleFolderList = () => {
    setShowFolderList(!showFolderList);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
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
            disabled={postImage.length < 1 && true}
            onPress={() => {next(countSelect === 0 ? imageCount : sum)}}
            style={{paddingVertical: 5, paddingHorizontal: 25}}>
            <AppText
              textStyle="body3"
              color={
                postImage.length < 1
                  ? Colors.buttonDisable
                  : Colors.contentOcean
              }>
              Next
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
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
                Photos - {countSelect === 0 ? imageCount : sum}/10{' '}
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
          <View
            // pointerEvents={imageCount === 10 ? 'none' : 'auto'}
            style={{
              height: imageCurrent
                ? height / 1.8 - normalize(122)
                : height - normalize(117),
              zIndex: -1,
              width: width,
              opacity: sum >= 10 ? .5 : 1
            }}>
            <CameraRollPicker
              groupTypes="All"
              maximum={sum >= 10 ? countSelect : 10}
              scrollRenderAheadDistance={500}
              selected={selected}
              imagesPerRow={3}
              imageMargin={2}
              // selectedMarker={
              //   <View
              //     style={{
              //       backgroundColor: Colors.contentOcean,
              //       width: 25,
              //       height: 25,
              //       borderRadius: 50,
              //       position: 'absolute',
              //       right: 4,
              //       top: 6,
              //     }}>
              //     <AppText
              //       textStyle="subtitle1"
              //       color={Colors.neutralsWhite}
              //       customStyle={{textAlign: 'center'}}>
              //       {imageCount}
              //     </AppText>
              //   </View>
              // }
              callback={() => getSelectedImages(selected)}
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
