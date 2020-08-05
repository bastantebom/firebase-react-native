import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions, Image,
  ScrollView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { normalize, Colors } from '@/globals';
import { AppText, AppButton, PaddingView } from '@/components';
// import Permissions from 'react-native-permissions';
import {
  HeaderBackGray,
  ArrowRight,
  Lock,
  FolderAdd,
  HeaderBack,
  Id,
  Flash,
  Flip
} from '@/assets/images/icons';
import {
  IdSelfie,
  SelfieMask
} from '@/assets/images';

// const {width, height} = Dimensions.get('window');
  const { height, width } = Dimensions.get('window');
  const maskRowHeight = Math.round((height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

export const SelfieId = ({ back }) => {
    const [flash, setFlash] = useState('off')
    // const [zoom, setZoom] = useState(0)
    // const [autoFocus, setAutoFocus] = useState('on')
    // const [depth, setDepth] = useState(0)
    const [cameraType, setCameraType] = useState('front')
    // const [permission, setPermission] = useState('undetermined')
    const [screen, setScreen] = useState('initial')
    const [cameraRatio, setCameraRatio] = useState('')
    const [selfieImageUrl, setSelfieImageUrl] = useState(''); 
    const cameraRef = useRef(null)

    const DESIRED_RATIO = "16:9";
    
    const prepareRatio = async () => {
      if (Platform.OS === 'android' && cameraRef) {
        const ratios = await cameraRef.getSupportedRatiosAsync();

        const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

        setCameraRatio(ratio)
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

    const takePicture = async() => {
      if (cameraRef) {
        const options = { 
          quality: 1, 
          base64: true 
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri);  
        setSelfieImageUrl(data.uri);
        setScreen('selfieConfirm');
      }
    };

    const retakePhoto = () => {
      setSelfieImageUrl('');
      setScreen('selfiePhoto');
    }

    useEffect(() => {
      prepareRatio;
      // console.log(cameraRatio)
    }, []);

    return (
      <View style={styles.container}>
        {screen === 'initial' ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <PaddingView paddingSize={3}>
              <View style={{ justifyContent: 'space-between' }}
              >
                <View>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      onPress={screen === 'idAdd' ? back : () => setScreen('idAdd')}
                      activeOpacity={0.7}
                      style={{position: 'absolute', left: 0 }}
                    >
                      <HeaderBackGray width={normalize(16)} height={normalize(16)} />
                    </TouchableOpacity>
                    <AppText textStyle="body3">&nbsp;</AppText>
                  </View>
                  <IdSelfie/>
                  <AppText 
                    textStyle="body1"
                    customStyle={{ marginBottom: 8 }}
                  >
                    Next, take a selfie with your ID
                  </AppText>
                  <AppText 
                    textStyle="body2" 
                    color={Colors.contentPlaceholder}
                    customStyle={{ marginBottom: 35 }}
                  >
                    We’ll match your face with the photo in your ID. Read below for some quick guidelines.
                  </AppText>
                  <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>Hold your ID in front of you, showing your personal details  with your face image.</AppText>
                  <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>Every word on the ID must be legible. Make sure your fingers are not covering any text.</AppText>
                  <AppText textStyle="body2">The selfie must be clear.</AppText>
                  <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 30 }}>
                    <Lock width={normalize(25)} height={normalize(25)} />
                    <AppText textStyle="caption" customStyle={{ marginLeft: 12 }}>This information won't be shared with other people who use Servbees</AppText>
                  </View>
                </View>
                <AppButton
                  text="Take a selfie with ID"
                  type="primary"
                  onPress={() => setScreen('selfiePhoto')}
                />
              </View>
            </PaddingView> 
          </ScrollView>
        ) : screen === 'selfiePhoto' ? (
          <>
            <RNCamera
              ref={cameraRef}
              style={styles.preview}
              // type={type}
              flashMode={flash}
              // flashMode={RNCamera.Constants.FlashMode.on}
              captureAudio={false}
              // cameraViewDimensions={1,1}
              // ratio={cameraRatio}
              // ratio={"1:1"}
              type={cameraType}
              // onCameraReady={prepareRatio}
            >
              <View style={styles.maskOutter}>
                {/* <SelfieMask width={normalize(width)} /> */}
                {/* <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
                <View style={[{ flex: height / 10 }, styles.maskCenter]}>
                  <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                  <View style={styles.maskInner} />
                  <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                </View>
                <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} /> */}
              </View>
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
            <View style={{ justifyContent: 'space-between', alignItems: 'center', height: height / 2, flex: .5 }}>
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
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ height: height * .6, backgroundColor: Colors.buttonDisable, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: selfieImageUrl }} style={{ maxHeight: height / 2, height: height, width: width }} />
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
                  onPress={() => setScreen('selfieInitial')}
                />
              </View>
            </PaddingView>
          </View>
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
    flex: .5,
    maxHeight: height / 2,
    opacity: .5,
    // position: 'relative',
    // zIndex: -2
    // height: 500,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  capture: {
    // position: 'relative',
    // zIndex: 2,
    // flex: 0,
    // height: height / 2,
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),
    // padding: 15,
    // paddingHorizontal: 20,
    // alignSelf: 'center',
    marginBottom: 15,
  },
  maskOutter: {
    position: 'absolute',
    // top: 0,
    // left: 0,
    width: '100%',
    // height: '100%',
    // alignItems: 'center',
    // justifyContent: 'space-around',
  },
  maskInner: {
    width: width - 17,
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
  modalHeader: {
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
});