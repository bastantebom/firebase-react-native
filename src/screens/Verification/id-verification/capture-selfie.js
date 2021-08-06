import {
  AppButton,
  AppText,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'
import { Colors, normalize } from '@/globals'
import React, { useEffect, useRef, useState } from 'react'
import {
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
import { SafeAreaView } from 'react-native-safe-area-context'

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
        <ScreenHeaderTitle close={navigation.goBack} />
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
    <SafeAreaView style={styles.root}>
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
          <Svg
            height={height / 1.75}
            width={width}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            pointerEvents="none">
            <Defs>
              <Mask id="mask" maskContentUnits="userSpaceOnUse">
                <Rect width={width} height={height / 1.75} fill="white" />
                <G scale={width / 430}>
                  <Path
                    d="M461.39 502.521L441.39 436.851L440.39 433.701C426.67 391.211 407.39 360.391 367.68 353.331L286.79 329.331V293.891C303.26 279.241 312.79 264.141 321.88 237.221C337.49 240.301 353.25 211.951 357.11 190.771C360.97 169.591 355.26 157.221 339.93 153.451V149.721C339.93 89.6105 326.34 22.8105 237.44 22.8105C148.54 22.8105 135.23 89.6105 135.23 149.721V153.451C120.03 157.221 114.33 169.871 118.03 190.771C121.73 211.671 138.03 240.271 153.48 237.271C162.48 264.191 172.1 279.271 188.56 293.941V329.381L104.18 353.281C64.5 360.281 45.25 391.081 31.51 433.781L10.52 507.001"
                    fill="#000"
                  />
                  <Path
                    d="M69.6099 303.19H28.8199C25.6477 303.206 22.6108 304.477 20.3734 306.726C18.1359 308.974 16.8798 312.018 16.8799 315.19V436.93C16.8798 440.102 18.1359 443.145 20.3734 445.394C22.6108 447.643 25.6477 448.914 28.8199 448.93H204.73C207.902 448.914 210.939 447.643 213.176 445.394C215.414 443.145 216.67 440.102 216.67 436.93V315.17C216.67 311.998 215.414 308.954 213.176 306.706C210.939 304.457 207.902 303.186 204.73 303.17H69.6099V303.19Z"
                    fill="#000"
                  />
                </G>
              </Mask>
            </Defs>
            <Path
              opacity="0.5"
              d="M68.264 302H27.835C21.2987 302 16 307.337 16 313.919V354.361M16 394.639V435.081C16 441.663 21.2987 447 27.835 447H68.264M161.736 447H202.165C208.701 447 214 441.663 214 435.081V394.639M214 354.361V313.919C214 307.337 208.701 302 202.165 302H161.736"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              scale={width / 440}
              translateY={10}
              translateX={3}
            />
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
  root: {
    flex: 1,
  },
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
