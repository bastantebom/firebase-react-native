import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Platform, 
  Dimensions, 
  Image 
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { normalize, Colors } from '@/globals';
import { AppText } from '@/components';
import {
  Flash,
  Flip
} from '@/assets/images/icons';

const { height, width } = Dimensions.get('window');
const maskRowHeight = Math.round((height - 300) / 20);
const maskColWidth = (width - 300) / 2;

const DESIRED_RATIO = "1:1";

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

export const AppCamera = ({ 
  message, 
  instruction, 
  withMask, 
  captureImage,
  retakeImage
}) => {
  
  const [cameraRatio, setCameraRatio] = useState('')
  const [flash, setFlash] = useState('off')
  const [cameraType, setCameraType] = useState('back')
  const [imageUrl, setImageUrl] = useState('')
  const cameraRef = useRef(null)

  const [selected] = useState(false)
  
  const prepareRatio = async () => {
    if (Platform.OS === 'android' && cameraRef) {
      const ratios = await cameraRef.getSupportedRatiosAsync();

      // const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

      // setCameraRatio(ratio)
      console.log(ratios)
    }
  }

  const toggleCameraType = () => {
    if(cameraType === 'front') {
      setCameraType('back')
    } else {
      setCameraType('front')
    }
  }

  const toggleFlash = () => {
    if(flash === 'off') {
      setFlash('on')
    } else if (flash === 'on') {
      setFlash('torch')
    } else {
      setFlash('off')
    }
  }

  const takePicture = async () => {
    if (cameraRef) {
      const options = { 
        quality: 1, 
        pauseAfterCapture: true,
      };

      const data = await cameraRef.current.takePictureAsync(options);

      cameraRef.current.pausePreview()

      const cameraUrl = data.uri

      setImageUrl(cameraUrl)

      captureImage(cameraUrl)

      // const url = [];
      // data.uri.forEach(image => url.push(image.uri))
      
      // setImageUrl(url);

      // console.log(cameraUrl)
    }
  };

  // console.log(imageUrl)
  
  const retake = () => {
    cameraRef.current.resumePreview();
    retakeImage(selected, imageUrl)
    setImageUrl('');
    // retakeImage(cameraUrl)
  }

  // useEffect(() => {
  //   prepareRatio;
  //   captureImage(imageUrl)
  // }, [imageUrl]);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={{ 
          flexDirection: 'column',
          alignItems: 'center',
          height: height / 2,
          overflow: 'hidden'
         }}
        type={'front'}
        captureAudio={false}
        flashMode={flash}
        type={cameraType}
        // ratio={cameraRatio}
        // onCameraReady={prepareRatio}
      >
        { withMask &&  <OverlayMask/> }
        <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row',  position: 'absolute', bottom: 25, paddingHorizontal: 25}}>
          <TouchableOpacity
            onPress={() => toggleCameraType()}
          >
            <Flip width={normalize(25)} height={normalize(25)}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFlash()}
          >
            <Flash width={normalize(25)} height={normalize(25)} />
          </TouchableOpacity>
        </View>
      </RNCamera>
      <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25 }}>
        <View style={{ width: width }}>
        <AppText 
          textStyle="body1" 
          customStyle={{ display: message && 'none' }}
        >
          {message}
        </AppText>
        <AppText 
          textStyle="body2" 
          color={Colors.contentPlaceholder}
          customStyle={{ display: instruction && 'none' }}
        >
          {instruction}
        </AppText>
        </View>
        <TouchableOpacity onPress={() => takePicture()} 
          style={styles.capture}
        >
          <View style={styles.captureButton} />
        </TouchableOpacity>
        { imageUrl !== '' ?
          <TouchableOpacity onPress={retake}>
            <AppText textStyle="body1" customStyle={{ marginTop: 20 }}>Retake</AppText>
          </TouchableOpacity> : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 500
    // flexDirection: 'column',
    // backgroundColor: 'pink',
  },
  preview: {
    flex: 1,
    // opacity: .5,
    // position: 'relative',
    // zIndex: -2
    // height: height/5,
    // paddingTop: 150
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  capture: {
    // position: 'relative',
    // zIndex: 2,
    // flex: 0,
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),

    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 15,
  },
  captureButton: {
    borderRadius: 50,
    backgroundColor: '#fff',
    width: normalize(50),
    height: normalize(50),
    position: 'absolute',
    top: normalize(12.5),
    left: normalize(12.5),
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


