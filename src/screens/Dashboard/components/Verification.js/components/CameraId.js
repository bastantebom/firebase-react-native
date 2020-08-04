import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { normalize, Colors } from '@/globals';
import { AppText } from '@/components';
// import Permissions from 'react-native-permissions';
import {
  HeaderBackGray,
  ArrowRight,
  Lock,
  FolderAdd,
  HeaderBack
} from '@/assets/images/icons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CameraId = ({ back }) => {
    // const [flash, setFlash] = useState('off')
    // const [zoom, setZoom] = useState(0)
    // const [autoFocus, setAutoFocus] = useState('on')
    // const [depth, setDepth] = useState(0)
    // const [type, setType] = useState('back')
    // const [permission, setPermission] = useState('undetermined')
    const [cameraRatio, setCameraRatio] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const cameraRef = useRef(null)

    const DESIRED_RATIO = "16:9";
    
    const prepareRatio = async () => {
      if (Platform.OS === 'android' && cameraRef) {
        const ratios = await cameraRef.getSupportedRatiosAsync();

        const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

        setCameraRatio(ratio)
      }
    }

    const takePicture = async() => {
      if (cameraRef) {
        const options = { 
          quality: 1, 
          base64: true 
        };
        const data = await cameraRef.current.takePictureAsync(options);
        // console.log(data.uri);  
        setImageUrl(data.uri)
        // setScreen()
      }
    };

    useEffect(() => {
      prepareRatio;
      // console.log(cameraRatio)
    }, []);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={back}
          activeOpacity={0.7}
          style={{position: 'absolute', left: 16, top: 16, zIndex: 999 }}
        >
          <HeaderBack width={normalize(16)} height={normalize(16)} />
        </TouchableOpacity>
        <AppText textStyle="body3">&nbsp;</AppText>
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          // type={type}
          // flashMode={flash}
          captureAudio={false}
          // cameraViewDimensions={1,1}
          // ratio={cameraRatio}
          ratio={"1:1"}
          // onCameraReady={prepareRatio}
        />
        <View style={{ justifyContent: 'space-between', alignItems: 'center', height: height * .35, paddingVertical: 25 }}>
          <View>
            <AppText textStyle="body1">Take a photo of your driver's license</AppText>
            <AppText textStyle="body2" color={Colors.contentPlaceholder}>Make sure that your ID fits within the yellow border</AppText>
          </View>
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
            <View
              style={{
                borderRadius: 50,
                backgroundColor: '#fff',
                width: normalize(50),
                height: normalize(50),
                position: 'absolute',
                top: 15,
                left: 15,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // backgroundColor: 'pink',
  },
  preview: {
    flex: 1,
    // opacity: .5,
    // position: 'relative',
    // zIndex: -2
    // height: 500,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  capture: {
    // position: 'relative',
    // zIndex: 2,
    flex: 0,
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),
    // padding: 15,
    // paddingHorizontal: 20,
    // alignSelf: 'center',
    marginBottom: 15,
  },
});