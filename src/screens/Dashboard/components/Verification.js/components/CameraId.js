import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { normalize, Colors } from '@/globals';
import { AppText } from '@/components';
// import Permissions from 'react-native-permissions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CameraId = () => {
    const [flash, setFlash] = useState('off')
    const [zoom, setZoom] = useState(0)
    const [autoFocus, setAutoFocus] = useState('on')
    const [depth, setDepth] = useState(0)
    const [type, setType] = useState('back')
    const [permission, setPermission] = useState('undetermined')
    const [cameraRatio, setCameraRatio] = useState('')
    const cameraRef = useRef(null)

    const DESIRED_RATIO = "16:9";
    
    const prepareRatio = async () => {
      if (Platform.OS === 'android' && cameraRef) {
        const ratios = await cameraRef.getSupportedRatiosAsync();

        // See if the current device has your desired ratio, otherwise get the maximum supported one
        // Usually the last element of "ratios" is the maximum supported ratio
        const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
        
        setCameraRatio(ratio)
    }
  }
    // useEffect(() => {
    //     // Permissions.check('photo').then(response => {
    //     // // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    //     // setPermission(response);
    //     // });
    // }, []);

    // toggleFlash() {
    //     setFlash(flashModeOrder[flash]);
    // }
    // zoomOut() {
    //     setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
    // }
    // zoomIn() {    
    //     setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);
    // }
    const takePicture = async() => {
        if (cameraRef) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log(data.uri);  
        }
    };
    
    return (
      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={type}
          flashMode={flash}
          captureAudio={false}
          // cameraViewDimensions={1,1}
          // ratio={cameraRatio}
          // onCameraReady={prepareRatio}
        />
        <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center' }}>
          <AppText textStyle="body1">Take a photo of your driver's license</AppText>
          <AppText textStyle="body2">Make sure that your ID fits within the yellow border</AppText>
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
    flexDirection: 'column',
    // backgroundColor: 'pink',
  },
  preview: {
    flex: 1,
    opacity: .5,
    position: 'relative',
    zIndex: -2
    // height: 500,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  capture: {
    position: 'relative',
    zIndex: 2,
    flex: 0,
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),
    // padding: 15,
    // paddingHorizontal: 20,
    // alignSelf: 'center',
    // margin: 20,
  },
});