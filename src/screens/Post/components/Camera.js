import React, {useState} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors} from '@/globals';
import {AppCamera} from '@/components/Camera/AppCamera';

export const PostCamera = ({cancel, next}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [photoCount, setPhotoCount] = useState(0);

  const captureImage = (imageUrl) => {
    setImageUrl(imageUrl)
    setPhotoCount(1)
    console.log('appcamera',  imageUrl);
    console.log('appcamera',  photoCount);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignSelf: 'center',
          alignItems: 'center',
          // width: '100%',
          marginTop: 5,
          height: 45,
          // paddingHorizontal: 25,
          // zIndex: 3,
          // backgroundColor: 'red'
        }}>
        <TouchableOpacity
          onPress={cancel}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body2">Cancel</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => showFolders(folderCount)}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body1">Photo</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={next}
          onPress={() => next(imageUrl, photoCount)}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body3" color={Colors.contentOcean}>
            Next
          </AppText>
        </TouchableOpacity>
      </View>
      <AppCamera captureImage={continueUploadPhoto} />
    </SafeAreaView>
  );
};
