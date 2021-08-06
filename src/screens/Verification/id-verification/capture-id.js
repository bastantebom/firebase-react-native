import { Icons } from '@/assets/images/icons'
import { AppButton, AppText, TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native'
import ImageEditor from '@react-native-community/image-editor'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RNCamera } from 'react-native-camera'

const { width } = Dimensions.get('screen')
const height = Dimensions.get('window').height - StatusBar.currentHeight
/**
 * @typedef {Object} CaptureIdProps
 * @property {string} type
 * @property {(uri: string)} onSubmit
 */

/**
 * @typedef {Object} RootProps
 * @property {CaptureIdProps} CaptureId
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CaptureId'>} param0 */
const CaptureIdScreen = ({ navigation, route }) => {
  const { type, onSubmit } = route.params
  const cameraRef = useRef(null)

  const [croppedImage, setCroppedImage] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const backPressHandler = event => {
    if (croppedImage && navigation.isFocused()) {
      event.preventDefault()
      setCroppedImage(null)
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation, croppedImage])

  const takePicture = async () => {
    if (!cameraRef || isCapturing) return
    setIsCapturing(true)

    try {
      const result = await cameraRef.current.takePictureAsync({
        pauseAfterCapture: true,
        forceUpOrientation: true,
        orientation: 'portrait',
      })
      setCroppedImage({ uri: result.uri })
    } catch (error) {
      console.log(error)
    }

    setIsCapturing(false)
  }

  return (
    <SafeAreaView style={styles.root}>
      <TransitionIndicator loading={isCapturing} />
      {croppedImage ? (
        <View
          style={{
            height: height / 1.75,
            width,
            backgroundColor: '#F6F6F6',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingVertical: height / 8.75,
          }}>
          <Image
            source={{ uri: croppedImage.uri }}
            style={{ height: '100%', width }}
          />
        </View>
      ) : (
        <RNCamera ref={cameraRef} captureAudio={false} style={styles.camera}>
          <View style={[styles.header]}>
            <TouchableOpacity
              style={{ height: normalize(24), width: normalize(24) }}
              onPress={navigation.goBack}>
              <Icons.Back
                style={{ color: '#fff' }}
                width={normalize(24)}
                height={normalize(24)}></Icons.Back>
            </TouchableOpacity>
          </View>
          <CameraOverlay />
        </RNCamera>
      )}

      {croppedImage ? (
        <ConfirmCapturedIdFooter
          onRetake={navigation.goBack}
          onConfirm={() => onSubmit(croppedImage.uri)}
        />
      ) : (
        <CaptureIdCameraFooter idType={type} onTakePicture={takePicture} />
      )}
    </SafeAreaView>
  )
}

/**
 * @param {Object} props
 * @param {string} props.idType
 * @param {function} props.onTakePicture
 */
const CaptureIdCameraFooter = ({ idType, onTakePicture }) => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 25,
        position: 'relative',
      }}>
      <AppText
        textStyle="body2medium"
        customStyle={{
          marginBottom: 8,
          fontSize: normalize(16),
          lineHeight: normalize(24),
        }}>
        Take a photo of your {idType}
      </AppText>
      <AppText
        textStyle="body2"
        customStyle={{ fontSize: normalize(14), lineHeight: normalize(21) }}
        color={Colors.contentPlaceholder}>
        Make sure that your ID fits within the yellow border.
      </AppText>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={onTakePicture} style={styles.capture} />
      </View>
    </View>
  )
}

/**
 * @param {Object} props
 * @param {string} props.onRetake
 * @param {function} props.onConfirm
 */
const ConfirmCapturedIdFooter = ({ onRetake, onConfirm }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 24, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <AppText textStyle="body1medium" customStyle={{ marginBottom: 10 }}>
            Is your ID photo clear?
          </AppText>
          <AppText textStyle="body2">
            It should clearly show all the ID details, including your picture.
            Please retake it if it’s blurry, pixelated, cropped, or if there any
            kind of glare appears.
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 56,
              width: Dimensions.get('window').width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
              textAlignVertical: 'center',
            }}
            onPress={onRetake}>
            <AppText
              customStyle={{
                color: Colors.contentOcean,
              }}
              textStyle="button2">
              Retake
            </AppText>
          </TouchableOpacity>
          <AppButton
            text="Continue"
            type="primary"
            size="sm"
            onPress={onConfirm}
          />
        </View>
      </View>
    </View>
  )
}

const CameraOverlay = () => {
  const maskRowHeight = height / 1.75 / 5
  return (
    <View style={styles.maskOutter}>
      <View
        style={[{ height: maskRowHeight }, styles.maskRow, styles.maskFrame]}
      />
      <View style={[{ flex: height / 8 }, styles.maskCenter]}>
        <View style={[{ width: 10 }, styles.maskFrame]} />
        <View style={styles.maskInner}>
          <View style={[styles.maskBorder, styles.overlayBorderTopLeft]}></View>
          <View
            style={[styles.maskBorder, styles.overlayBorderTopRight]}></View>
          <View
            style={[styles.maskBorder, styles.overlayBorderBottomLeft]}></View>
          <View
            style={[styles.maskBorder, styles.overlayBorderBottomRight]}></View>
        </View>
        <View style={[{ width: 10 }, styles.maskFrame]} />
      </View>
      <View
        style={[{ height: maskRowHeight }, styles.maskRow, styles.maskFrame]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlayBorderTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  overlayBorderTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  overlayBorderBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  overlayBorderBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  camera: {
    justifyContent: 'center',
    position: 'relative',
    height: height / 1.75,
    overflow: 'hidden',
  },
  capture: {
    borderColor: Colors.primaryYellow,
    borderRadius: 50,
    borderWidth: normalize(12),
    width: normalize(75),
    height: normalize(75),
    position: 'absolute',
    bottom: normalize(25),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: normalize(16),
    zIndex: 1,
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
    position: 'relative',
    width: width - 20,
  },
  maskBorder: {
    position: 'absolute',
    height: 24,
    width: 24,
    borderWidth: 4,
    borderColor: Colors.primaryYellow,
  },
  maskFrame: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {
    flexDirection: 'row',
  },
})

export default CaptureIdScreen
