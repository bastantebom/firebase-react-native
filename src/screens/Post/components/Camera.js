import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors} from '@/globals';
import {AppCamera} from '@/components/Camera/AppCamera';
import {Context} from '@/context';

export const PostCamera = ({cancel, next}) => {

  const { setPostCameraImage, postCameraImage } = useContext(Context);

  const [photoCount, setPhotoCount] = useState(0);
  const [selected, setSelected] = useState(true);

  const captureImage = (imageUrl) => {

    // console.log(imageUrl, 'hajdasjgv')

    const url = [];
    url.push(imageUrl)

    // console.log('url!!!', url)

    setPostCameraImage(url)

    // const url = imageUrl.map((image) => image.uri)

    // console.log(url, 'url')

    // setPostCameraImage(prev => [...prev, imageUrl])

    // if (postCameraImage.length > 0) {
    //   const imageArray = [];
    //   imageArray.push(imageUrl)
      
    //   setPostCameraImage(imageArray);
    // } else {
    //   setPostCameraImage(imageUrl)
    // }

    setPhotoCount(1)
    // setSelected(!selected)
  }

  // console.log(selected)

  // console.log(postCameraImage, 'post camera img')
  // console.log(postCameraImage.length, 'post camera img')


  // useEffect(() => {
  //   console.log(postCameraImage)
  // }, [postCameraImage])


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
          <AppText textStyle="body3" color={ selected ? Colors.buttonDisable : Colors.contentOcean}>
            Next
          </AppText>
        </TouchableOpacity>
      </View>
      <AppCamera captureImage={captureImage} />
    </SafeAreaView>
  );
};
