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
import { AppText, AppButton, PaddingView } from '@/components';
import { HeaderBack } from '@/assets/images/icons';
import { SelfieId } from './SelfieId';
import { AppCamera } from '@/components/Camera/AppCamera';

const { height, width } = Dimensions.get('window');
const maskRowHeight = Math.round((height - 300) / 20);
const maskColWidth = (width - 300) / 2;

export const CameraId = ({ back, backToIndex, id }) => {

  const cameraRef = useRef(null)
  const [screen, setScreen] = useState('idPhoto')
  const [cameraRatio, setCameraRatio] = useState('')
  const [imageUrl, setImageUrl] = useState('');

  const DESIRED_RATIO = "16:9";
    
  const prepareRatio = async () => {
    if (Platform.OS === 'android' && cameraRef) {
      const ratios = await cameraRef.getSupportedRatiosAsync();

      const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

      setCameraRatio(ratio)
    }
  }

  const takePicture = async () => {
    if (cameraRef) {
      const options = { 
        quality: 1, 
        base64: true 
      };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);  
      setImageUrl(data.uri);
      setScreen('idConfirm');
    }
  };

  const retakePhoto = () => {
    setScreen('idPhoto');
  }

  const selfieScreen = () => {
    setScreen('selfieInitial');
    console.log(imageUrl);
  }

  useEffect(() => {
    prepareRatio;
    // console.log(cameraRatio)
  }, []);

  return (
    <View style={styles.container}>
      {screen === 'idPhoto' ? (
        <>
          <TouchableOpacity
            onPress={back}
            activeOpacity={0.7}
            style={{position: 'absolute', left: 16, top: 16, zIndex: 999 }}
          >
            <HeaderBack width={normalize(16)} height={normalize(16)} />
            <AppText textStyle="body3">&nbsp;</AppText>
          </TouchableOpacity>
          <AppCamera
            message={'Take a photo of your ' + id}
            instruction={'Make sure that your ID fits within the yellow border'}
            withMask
            customHeight={height / 1.75}
            captureImage={() => takePicture()}
          />
          {/* <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={'back'}
            // flashMode={flash}
            captureAudio={false}
            ratio={"1:1"}
          >
            <View style={styles.maskOutter}>
              <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
              <View style={[{ flex: height / 10 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <View style={styles.maskInner} />
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
              <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
            </View>
          </RNCamera>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', height: height * .35, paddingVertical: 25 }}>
            <View>
              <AppText textStyle="body1">Take a photo of your {id}</AppText>
              <AppText textStyle="body2" color={Colors.contentPlaceholder}>Make sure that your ID fits within the yellow border</AppText>
            </View>
            <TouchableOpacity onPress={takePicture} style={styles.capture}>
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
          </View> */}
        </>
      ) : screen === 'idConfirm' ? (
        <View style={{ flex: 1 }}>
          <View 
           style={{ 
             height: height / 1.75, 
             backgroundColor: Colors.buttonDisable, 
             alignItems: 'center', 
             justifyContent: 'center' 
            }}
          >
            <Image 
              source={{ uri: imageUrl }} 
              style={{ maxHeight: height / 2, height: height, width: width }} 
            />
          </View>
          <PaddingView paddingSize={3} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <AppText textStyle="body1" customStyle={{ marginBottom: 10 }}>Is the photo of your ID clear?</AppText>
              <AppText textStyle="body2">It should clearly show the page of your picture. Nothing blurry, pixelated, cut off, and no glare.</AppText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppButton
                text="Retake"
                size="sm"
                onPress={() => retakePhoto()}
              />
              <AppButton
                text="Continue"
                type="primary"
                size="sm"
                // onPress={toggleSelfieScreen}
                onPress={() => selfieScreen()}
              />
            </View>
          </PaddingView>
        </View>
      ) : screen === 'selfieInitial' ? (
        <SelfieId
          back={() => setScreen('idConfirm')}
          confirmPhotoId={backToIndex}
        />
      ) : (
        null
      )}
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
  },
  capture: {

    flex: 0,
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),
    marginBottom: 15,
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
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});