import {
  AppButton,
  AppText,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'
import { Colors, normalize } from '@/globals'
import React, { useEffect, useRef, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { Icons } from '@/assets/images/icons'
import { IdSelfie } from '@/assets/images'
import { RNCamera } from 'react-native-camera'
import Svg, { Defs, G, Mask, Path, Rect } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

/**
 * @typedef {Object} SelfieScreenProps
 * @property {(uri: string) => void} onSubmit
 */

/**
 * @typedef {Object} RootProps
 * @property {SelfieScreenProps} SelfieScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'SelfieScreen'>} param0 */
export const CaptureSelfieInfoScreen = ({ navigation, route }) => {
  const { onSubmit } = route.params

  return (
    <>
      <View style={{ padding: normalize(24) }}>
        <ScreenHeaderTitle iconSize={16} close={navigation.goBack} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <IdSelfie />
        <View style={{ padding: normalize(24) }}>
          <AppText textStyle="body1medium" customStyle={{ marginBottom: 8 }}>
            Next, take a selfie with your ID
          </AppText>
          <AppText
            textStyle="body2"
            color={Colors.contentPlaceholder}
            customStyle={{ marginBottom: 35 }}>
            We’ll match your face with the photo in your ID. Read below for some
            quick guidelines.
          </AppText>
          <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>
            - Hold your ID in front of you, showing your personal details with
            your face image.
          </AppText>
          <View
            style={{
              marginLeft: normalize(8),
              marginBottom: 10,
              flexDirection: 'row',
            }}>
            <Text style={{ marginRight: normalize(12) }}>{`\u2022 `}</Text>
            <AppText textStyle="body2">
              Every word on the ID must be legible. Make sure your fingers are
              not covering any text.
            </AppText>
          </View>
          <View style={{ marginLeft: normalize(8), flexDirection: 'row' }}>
            <Text style={{ marginRight: normalize(12) }}>{`\u2022 `}</Text>
            <AppText textStyle="body2">
              The selfie must be clear and show your face with none of your
              features blocked off.
            </AppText>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: normalize(24) }}>
        <AppButton
          text="Take a selfie with ID"
          type="primary"
          onPress={() =>
            navigation.navigate('capture-selfie', {
              onSubmit,
            })
          }
        />
      </View>
    </>
  )
}

/**
 * @typedef {Object} CaptureSelfieProps
 * @property {(uri: string) => void} onSubmit
 */

/**
 * @typedef {Object} RootProps
 * @property {CaptureSelfieProps} CaptureSelfie
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CaptureSelfie'>} param0 */
export const CaptureSelfieScreen = ({ navigation, route }) => {
  const { onSubmit } = route.params
  const cameraRef = useRef(null)
  const [cameraType, setCameraType] = useState('front')
  const [flashMode, setFlashMode] = useState('off')
  const [isCapturing, setIsCapturing] = useState(false)
  const [selfie, setSelfie] = useState(null)

  const toggleCameraType = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back')
  }

  const toggleFlashMode = () => {
    const modes = ['off', 'on', 'torch']
    const index = modes.indexOf(flashMode)

    setFlashMode(modes[index > modes.length ? 0 : index + 1])
  }

  const takePicture = async () => {
    if (!cameraRef || isCapturing) return
    setIsCapturing(true)

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
        pauseAfterCapture: true,
      })

      setSelfie(result)
    } catch (error) {
      console.log(error)
    }
    setIsCapturing(false)
  }

  const backPressHandler = event => {
    if (selfie && navigation.isFocused()) {
      event.preventDefault()
      setSelfie(null)
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation, selfie])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isCapturing} />
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            position: 'absolute',
            top: normalize(16),
            left: normalize(16),
          }}>
          <Icons.Back
            style={{ color: Colors.checkboxBorderDefault }}
            width={normalize(16)}
            height={normalize(16)}></Icons.Back>
        </TouchableOpacity>
        <AppText textStyle="body2medium">Photo</AppText>
      </View>
      {selfie ? (
        <View
          style={{
            height: height / 1.75,
            backgroundColor: '#F6F6F6',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <Image
            source={{ uri: selfie.uri }}
            style={{ height: '100%', width }}
          />
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          captureAudio={false}
          style={[styles.camera, { alignItems: 'center' }]}
          type={cameraType}
          flashMode={flashMode}>
          <Text
            adjustsFontSizeToFit={true}
            style={{
              color: '#fff',
              position: 'absolute',
              top: 16,
              zIndex: 1,
              textAlign: 'center',
            }}>
            Position your face within the outline
          </Text>
          <Svg
            height={height / 1.75}
            width={width}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            pointerEvents="none">
            <Defs>
              <Mask id="mask" maskContentUnits="userSpaceOnUse">
                <Rect width={width} height={height / 1.75} fill="white" />
                <G scale={width / 430} translateX={24} translateY={48}>
                  <Path
                    fill="#000"
                    d="M403 432L401.6 428.398C387.24 384.096 367.101 351.968 325.637 344.656L241.131 319.552V282.597C258.326 267.326 268.306 251.586 277.748 223.528C294.046 226.733 310.488 197.163 314.544 175.084C318.601 153.005 312.606 140.11 296.595 136.184C296.595 134.887 296.595 133.555 296.595 132.294C296.595 69.6588 282.451 0 189.58 0C96.7085 0 82.7796 69.6588 82.7796 132.294C82.7796 133.555 82.7796 134.887 82.7796 136.184C66.9122 140.11 60.9529 153.293 64.83 175.084C68.7071 196.874 85.6874 226.697 101.842 223.528C111.284 251.586 121.263 267.326 138.459 282.597V319.552L50.3268 344.476C8.86325 351.788 -11.2403 383.916 -25.5999 428.398L-27 432"
                  />
                </G>
              </Mask>
            </Defs>
            <Rect
              width={width}
              height={height / 1.75}
              mask="url(#mask)"
              fill="#000"
              opacity="0.5"
            />
          </Svg>

          <View style={styles.cameraActionsWrapper}>
            <TouchableOpacity
              style={{ height: normalize(24), width: normalize(24) }}
              onPress={toggleCameraType}>
              <Icons.Flip
                style={{ color: '#fff' }}
                width={normalize(24)}
                height={normalize(24)}></Icons.Flip>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ height: normalize(24), width: normalize(24) }}
              onPress={toggleFlashMode}>
              <Icons.Flash
                style={{ color: '#fff' }}
                width={normalize(24)}
                height={normalize(24)}></Icons.Flash>
            </TouchableOpacity>
          </View>
        </RNCamera>
      )}
      {selfie ? (
        <ConfirmCapturedSelfieFooter
          onRetake={navigation.goBack}
          onConfirm={() => onSubmit(selfie.uri)}
        />
      ) : (
        <CaptureSelfieCameraFooter onTakePicture={takePicture} />
      )}
    </SafeAreaView>
  )
}

/**
 * @param {Object} props
 * @param {function} props.onTakePicture
 */
const CaptureSelfieCameraFooter = ({ onTakePicture }) => {
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
        Take a selfie with ID
      </AppText>
      <AppText
        textStyle="body2"
        customStyle={{ fontSize: normalize(14), lineHeight: normalize(21) }}
        color={Colors.contentPlaceholder}>
        Hold your ID in front of you, showing your personal details with your
        face image.{' '}
      </AppText>

      <View style={{ flex: 1, alignItems: 'center' }}>
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
const ConfirmCapturedSelfieFooter = ({ onRetake, onConfirm }) => {
  return (
    <View
      style={{
        padding: normalize(24),
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View>
        <AppText textStyle="body1medium" customStyle={{ marginBottom: 10 }}>
          Happy with your photo?
        </AppText>
        <AppText textStyle="body2">
          It should clearly show the page of your picture. Nothing blurry,
          pixelated, cut off, and no glare.
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
        <AppButton text="Submit" type="primary" size="sm" onPress={onConfirm} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  camera: {
    justifyContent: 'center',
    position: 'relative',
    height: height / 1.75,

    overflow: 'hidden',
  },
  cameraActionsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(24),
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
    padding: normalize(16),
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
})
