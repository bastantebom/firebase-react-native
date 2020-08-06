import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { normalize, Colors } from '@/globals';
import { AppText, AppButton, PaddingView } from '@/components';
// import Permissions from 'react-native-permissions';
import {
  HeaderBackGray,
  ArrowRight,
  Lock,
  FolderAdd,
  HeaderBack
} from '@/assets/images/icons';
// const {width, height} = Dimensions.get('window');
  const { height, width } = Dimensions.get('window');
  const maskRowHeight = Math.round((height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

export const AppCamera = ({ message, instruction, withMask, captureImage }) => {
  
    // const [screen, setScreen] = useState('idPhoto')
    // const [cameraRatio, setCameraRatio] = useState('')
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
        console.log(data.uri);  

        setImageUrl(data.uri);
        // setScreen('idConfirm');
      }
    };

    // const retakePhoto = () => {
    //   // setImageUrl('');
    //   setScreen('idPhoto');
    // }

    // const selfieScreen = () => {
    //   setScreen('selfieInitial');
    //   console.log(imageUrl);
    // }

    useEffect(() => {
      prepareRatio;
      // console.log(cameraRatio)
    }, []);

  function OverlayMask() {
    return (
      <View style={styles.maskOutter}>
        <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
        <View style={[{ flex: height / 10 }, styles.maskCenter]}>
          <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          <View style={styles.maskInner} />
          <View style={[{ width: maskColWidth }, styles.maskFrame]} />
        </View>
        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={'front'}
        captureAudio={false}
        ratio={"1:1"}
      >
        { withMask &&  <OverlayMask/> }
      </RNCamera>
      <View style={{ justifyContent: 'space-between', alignItems: 'center', height: height * .35, paddingVertical: 25 }}>
        <View>
        <AppText textStyle="body1">{message}</AppText>
        <AppText textStyle="body2" color={Colors.contentPlaceholder}>{instruction}</AppText>
        </View>
        <TouchableOpacity onPress={captureImage} style={styles.capture}>
          <View style={styles.captureButton} />
        </TouchableOpacity>
      </View>
    </View>
  )
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
  captureButton: {
    borderRadius: 50,
    backgroundColor: '#fff',
    width: normalize(50),
    height: normalize(50),
    position: 'absolute',
    top: 15,
    left: 15,
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: width - 20,
    backgroundColor: 'transparent',
    // borderColor: 'white',
    borderRadius: 16,
    borderColor: Colors.yellow2,
    borderWidth: 4
    // borderBottomColor: 'white',
  },
  maskFrame: {
    // backgroundColor: 'rgba(0,0,0,4);',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});


