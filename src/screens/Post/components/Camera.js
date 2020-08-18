import React, {useState} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors} from '@/globals';
import {AppCamera} from '@/components/Camera/AppCamera';

export const PostCamera = ({cancel, next}) => {
  const [cameraImage, setCameraImage] = useState('');
  const [photoCount, setPhotoCount] = useState(0);

  const captureImage = (imageUrl) => {
    setCameraImage(imageUrl)
    // setPhotoCount(1)
    console.log('appcamera', imageUrl);
    // console.log('appcamera', photoCount);
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
          onPress={() => next(cameraImage, photoCount)}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body3" color={Colors.contentOcean}>
            Next
          </AppText>
        </TouchableOpacity>
      </View>
      <AppCamera captureImage={captureImage} />
    </SafeAreaView>
  );
};
