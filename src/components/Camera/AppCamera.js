import React, {useState, useRef, useContext} from 'react';
import {StyleSheet, TouchableOpacity, View, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {normalize, Colors} from '@/globals';
import {AppText} from '@/components';
import {Flash, Flip} from '@/assets/images/icons';
import {Context} from '@/context';
import { PaddingView } from '../AppViewContainer';

const {height, width} = Dimensions.get('window');
const maskRowHeight = Math.round((height - 300) / 20);
const maskColWidth = (width - 300) / 2;

function OverlayMask() {
  return (
    <View style={styles.maskOutter}>
      <View style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]} />
      <View style={[{flex: height / 8}, styles.maskCenter]}>
        <View style={[{width: maskColWidth}, styles.maskFrame]} />
        <View style={styles.maskInner} />
        <View style={[{width: maskColWidth}, styles.maskFrame]} />
      </View>
      <View style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]} />
    </View>
  );
}

export const AppCamera = ({
  message,
  instruction,
  withMask,
  withFlash,
  withFlip,
  setCameraCapture,
  customHeight,
  coverPhotoCamera, // prop for post camera
  idVerificationCamera, // prop for gov't id verification
  idImageUrl,
  selfieWithIdCamera, // prop for selfie with id verification
  selfieImageUrl
}) => {
  const {
    setCameraImage,
    cameraImage,
    setCoverPhoto,
    coverPhoto,
    libImages,
    setImageCount,
    setSingleCameraImage,
  } = useContext(Context);

  const [flash, setFlash] = useState('off');
  const [cameraType, setCameraType] = useState('back');
  const cameraRef = useRef(null);
  const [retakeState, setRetakeState] = useState(false);

  const toggleCameraType = () => {
    if (cameraType === 'front') {
      setCameraType('back');
    } else {
      setCameraType('front');
    }
  };

  const toggleFlash = () => {
    if (flash === 'off') {
      setFlash('on');
    } else if (flash === 'on') {
      setFlash('torch');
    } else {
      setFlash('off');
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        pauseAfterCapture: true,
      });

      const cameraUrl = data.uri;
      
      if(idVerificationCamera) {
        idImageUrl(cameraUrl)
        // console.log(cameraUrl)
        // console.log('cameraUrl')
      }

      if(selfieWithIdCamera) {
        selfieImageUrl(cameraUrl)
        // console.log(cameraUrl)
        // console.log('cameraUrl selfie')
      }

      if(coverPhotoCamera) {
        cameraRef.current.pausePreview();
        setCameraImage((prev) => [...prev, cameraUrl]);
        setSingleCameraImage(cameraUrl);
        setCameraCapture(true);
        setRetakeState(true);
      }
    }
  };

  // for add image from camera on post
  const retake = () => {
    cameraRef.current.resumePreview();

    const newCameraImage = cameraImage;
    const index = newCameraImage.length - 1;
    newCameraImage.splice(index, 1);
    const newCoverPhoto = [...newCameraImage, ...libImages].sort((a, b) =>
      !~coverPhoto.indexOf(b) && ~coverPhoto.indexOf(a)
        ? -1
        : !~coverPhoto.indexOf(a)
        ? 1
        : coverPhoto.indexOf(a) - coverPhoto.indexOf(b),
    );
    setCoverPhoto([...newCoverPhoto]);
    setImageCount(newCameraImage.length);
    setSingleCameraImage(null);

    setCameraCapture(false);
    setRetakeState(false);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          height: customHeight ? customHeight : height / 2,
          // height: height / 1.75,
          overflow: 'hidden',
        }}
        type={'front'}
        captureAudio={false}
        flashMode={flash}
        type={cameraType}
      >
        {withMask && <OverlayMask />}
        <View
          style={{
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 25,
            paddingHorizontal: 25,
          }}>
          { withFlip && 
            <TouchableOpacity onPress={() => toggleCameraType()}>
              <Flip width={normalize(25)} height={normalize(25)} />
            </TouchableOpacity>
          }
          { withFlash && 
            <TouchableOpacity onPress={() => toggleFlash()}>
              <Flash width={normalize(25)} height={normalize(25)} />
            </TouchableOpacity>
          }
        </View>
      </RNCamera>
      <View style={{ width: width, paddingHorizontal: 25, paddingTop: 25 }}>
        <AppText 
          textStyle="body1" 
          customStyle={{display: message ? 'flex' : 'none', marginBottom: 8}}
        >
          {message}
        </AppText>
        <AppText
          textStyle="body2"
          color={Colors.contentPlaceholder}
          customStyle={{display: instruction ? 'flex' : 'none'}}
        >
          {instruction}
        </AppText>
      </View>
      <View
        style={{
          justifyContent: 'center',
          flex: 1, 
          alignItems: 'center'
        }}>
        {coverPhotoCamera && retakeState ? (
          <TouchableOpacity onPress={retake}>
            <AppText textStyle="body1" customStyle={{marginTop: 20}}>
              Retake
            </AppText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => takePicture()}
            style={styles.capture}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  capture: {
    backgroundColor: Colors.primaryYellow,
    borderRadius: 50,
    width: normalize(75),
    height: normalize(75),

    padding: 15,
    paddingHorizontal: 20,
    // alignSelf: 'center',
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
    // backgroundColor: 'red'
  },
  maskInner: {
    width: width - 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderColor: Colors.yellow2,
    borderWidth: 4,
  },
  maskFrame: {
    backgroundColor: 'rgba(0,0,0,.5)',
    // borderRadius: 15
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { 
    flexDirection: 'row',
  }
});
