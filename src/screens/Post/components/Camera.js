import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors} from '@/globals';
import {AppCamera} from '@/components/Camera/AppCamera';
import {Context} from '@/context';
import { PostImageUpload } from './PostImageUpload';

export const PostCamera = ({cancel, next}) => {

  const { setPostCameraImage, postCameraImage } = useContext(Context);

  const [photoCount, setPhotoCount] = useState(0);
  const [selected, setSelected] = useState(false);

  const captureImage = (imageUrl) => {

    const url = [];
    url.push(imageUrl)

    setPostCameraImage(url)
    setPhotoCount(1)
    setSelected(!selected)
  }

  console.log(postCameraImage, 'post camera imggg')
  console.log(postCameraImage.length, 'post camera imhhg')
  // console.log(selected)

  const retakeImage = (selected, imageUrl) => {

    const currentPostCameraImage = postCameraImage
    currentPostCameraImage.splice(-1, 1)
    setPostCameraImage([...currentPostCameraImage])

    setSelected(selected)
    console.log(postCameraImage, 'pop')
  } 

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 45
        }}>
        <TouchableOpacity
          onPress={cancel}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body2">Cancel</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingHorizontal: 25 }}>
          <AppText textStyle="body1">Photo</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          // disabled={ selected && true }
          onPress={() => next(photoCount)}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body3" color={ !selected ? Colors.buttonDisable : Colors.contentOcean}>
            Next
          </AppText>
        </TouchableOpacity>
      </View>
      <AppCamera captureImage={captureImage} retakeImage={retakeImage} />
    </SafeAreaView>
  );
};
