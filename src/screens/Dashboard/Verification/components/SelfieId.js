import React, { useState, useEffect, useRef } from 'react';
import {  
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Platform, 
  Dimensions, 
  Image,
  ScrollView 
} from 'react-native';
import { normalize, Colors } from '@/globals';
import { AppText, AppButton, PaddingView, ScreenHeaderTitle } from '@/components';
import {
  HeaderBackGray,
  Lock,
  Flash,
  Flip
} from '@/assets/images/icons';
import { IdSelfie } from '@/assets/images';
import { RNCamera } from 'react-native-camera';
import { AppCamera } from '@/components/Camera/AppCamera';

  const { height, width } = Dimensions.get('window');
  const maskRowHeight = Math.round((height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

export const SelfieId = ({ back, confirmPhotoId }) => {

  const cameraRef = useRef(null)

  const [flash, setFlash] = useState('off')
  const [cameraType, setCameraType] = useState('front')
  const [screen, setScreen] = useState('initial')
  const [cameraRatio, setCameraRatio] = useState('')
  const [selfieImageUrl, setSelfieImageUrl] = useState(''); 

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

  const getIdUrl = (cameraUrl) => {
    // console.log(cameraUrl)
    // console.log('gov id img url')
    setSelfieImageUrl(cameraUrl);
    setScreen('selfieConfirm');
  }

  const retakePhoto = () => {
    setSelfieImageUrl('');
    setScreen('selfiePhoto');
  }

  // const confirmVerification = () => {
  //   console.log()
  // }

  return (
    <View style={{ flex: 1 }}>
      {screen === 'initial' ? (
        <>
          <PaddingView paddingSize={3}>
            <ScreenHeaderTitle
              iconSize={16}
              close={back}
            />
          </PaddingView>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <IdSelfie/>
            <PaddingView paddingSize={3}>
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
              <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>- Hold your ID in front of you, showing your personal details  with your face image.</AppText>
              <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>- Every word on the ID must be legible. Make sure your fingers are not covering any text.</AppText>
              <AppText textStyle="body2">- The selfie must be clear and show your face with none of your features blocked off.</AppText>

              <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Lock width={normalize(25)} height={normalize(25)} />
                <AppText textStyle="caption" customStyle={{ marginLeft: 12, maxWidth: '90%' }}>This information won't be shared with other people who use Servbees</AppText>
              </View>
            </PaddingView> 
          </ScrollView>
          <PaddingView paddingSize={3}>
            <AppButton
              text="Take a selfie with ID"
              type="primary"
              onPress={() => setScreen('selfiePhoto')}
            />
          </PaddingView>
        </>
      ) : screen === 'selfiePhoto' ? (
        <>
          <AppCamera
            message={'Take a selfie with ID'}
            instruction={'Hold your ID in front of you, showing your personal details  with your face image.'}
            withFlip
            withFlash
            customHeight={height / 1.85}
            selfieImageUrl={(cameraUrl) => getIdUrl(cameraUrl)}
            selfieWithIdCamera
          />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ height: height * .6, backgroundColor: Colors.buttonDisable, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: selfieImageUrl }} style={{ maxHeight: height / 1.5 , height: height, width: width }} />
          </View>
          <PaddingView paddingSize={3} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <AppText textStyle="body1" customStyle={{ marginBottom: 10 }}>Happy with your photo?</AppText>
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
                onPress={confirmPhotoId}
                // onPress={() => confirmVerification}
              />
            </View>
          </PaddingView>
        </View>
      )}
    </View>
  );
}