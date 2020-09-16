import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors} from '@/globals';
import {AppCamera} from '@/components/Camera/AppCamera';
import {Context} from '@/context';

export const PostCamera = ({ cancel, next }) => {
  const [cameraCapture, setCameraCapture] = useState(false)

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
          onPress={() => next()}
          style={{paddingVertical: 5, paddingHorizontal: 25}}>
          <AppText textStyle="body3" color={ !cameraCapture ? Colors.buttonDisable : Colors.contentOcean}>
            Next
          </AppText>
        </TouchableOpacity>
      </View>
      {/* <AppCamera captureImage={captureImage} retakeImage={retakeImage} /> */}
      <AppCamera setCameraCapture={setCameraCapture} />
    </SafeAreaView>
  );
};
