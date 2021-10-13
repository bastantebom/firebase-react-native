import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize } from '@/globals/Utils'
import CameraRoll from '@react-native-community/cameraroll'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import StatusBar from '@/components/StatusBar'

const { height } = Dimensions.get('window')

/**
 * @typedef {object} CoverPhotoCameraScreenProps
 * @property {function} onSubmit
 * @property {number} maximum
 * @property {multiple} maximum
 * @property {string[]} images
 */

/**
 * @typedef {object} RootProps
 * @property {CoverPhotoCameraScreenProps} CoverPhotoCameraScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CoverPhotoCameraScreen'>} param0 */
const CoverPhotoCameraScreen = ({ navigation, route }) => {
  const { onSubmit, maximum, images, multiple } = route.params

  const cameraRef = useRef()
  const [cameraType, setCameraType] = useState('back')
  const [flashMode, setFlashMode] = useState('off')
  const [isCapturing, setIsCapturing] = useState(false)
  const [image, setImage] = useState()
  const [cameraReady, setCameraReady] = useState(false)

  const [storageThumbnail, setStorageThumbnail] = useState(null)

  const handleOnCapturePress = () => {
    takePicture()
  }

  const handleOnNextPress = () => {
    onSubmit([...images, image.uri])
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.goBack()
  }

  const showImagePicker = async () => {
    navigation.navigate('image-picker', {
      multiple,
      maximum,
      images,
      onSubmit: images => {
        onSubmit(images)
        navigation.goBack()
        navigation.goBack()
      },
    })
  }

  const handleOnCameraRotatePress = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back')
  }

  const handleOnCameraFlashPress = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off')
  }

  const takePicture = async () => {
    if (!cameraRef || isCapturing) return
    setIsCapturing(true)

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
        pauseAfterCapture: true,
      })

      setImage(result)
    } catch (error) {
      console.log(error)
    }
    setIsCapturing(false)
  }

  const init = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ])

        if (result['android.permission.CAMERA'] === 'granted')
          setCameraReady(true)
      } else if (Platform.OS === 'ios') {
        const [cameraResult] = await Promise.all([
          request(PERMISSIONS.IOS.CAMERA),
          request(PERMISSIONS.IOS.PHOTO_LIBRARY),
        ])

        if (cameraResult === RESULTS.GRANTED) setCameraReady(true)
      }

      const result = await CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
      })
      const { uri } = result.edges[0].node.image
      setStorageThumbnail({ uri })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const backPressHandler = event => {
    if (image && navigation.isFocused()) {
      event.preventDefault()
      setImage(null)
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation, image])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Upload Cover Photo</Text>
          </View>
        </View>
        <View style={styles.cameraView}>
          {image ? (
            <Image style={styles.previewImage} source={image} />
          ) : (
            cameraReady && (
              <RNCamera
                ref={cameraRef}
                captureAudio={false}
                type={cameraType}
                flashMode={flashMode}
                style={styles.camera}>
                <View style={styles.cameraButtons}>
                  <Button onPress={handleOnCameraRotatePress}>
                    {cameraType === 'back' ? (
                      <Icons.CameraRotateOff />
                    ) : (
                      <Icons.CameraRotateOn />
                    )}
                  </Button>

                  <Button onPress={handleOnCameraFlashPress}>
                    {flashMode === 'off' ? (
                      <Icons.CameraFlashOff />
                    ) : (
                      <Icons.CameraFlashOn />
                    )}
                  </Button>
                </View>
              </RNCamera>
            )
          )}
        </View>
        <View style={styles.cameraActionsWrapper}>
          <View>
            <Text style={[typography.body1, { marginBottom: normalize(8) }]}>
              Take a photo
            </Text>
            <Text style={typography.caption}>
              Make sure the image is clear and adheres to our Community
              Guidelines.
            </Text>
          </View>
          {image ? (
            <View style={styles.ctaWrapper}>
              <View style={utilStyles.row}>
                <Button
                  style={[styles.cta, { marginRight: normalize(16) }]}
                  label="Retake"
                  labelStyle={typography.link}
                  onPress={navigation.goBack}
                />
                <Button
                  style={styles.cta}
                  label="Next"
                  type="primary"
                  onPress={handleOnNextPress}
                />
              </View>
            </View>
          ) : (
            <View style={styles.cameraActions}>
              <TouchableOpacity
                style={styles.storagePhotosButton}
                activeOpacity={0.7}
                onPress={showImagePicker}>
                {storageThumbnail ? (
                  <Image
                    style={styles.storageThumbnail}
                    resizeMethod="resize"
                    width="100%"
                    height="100%"
                    source={storageThumbnail}
                  />
                ) : (
                  <Icons.Camera style={{ color: Colors.contentEbony }} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOnCapturePress}>
                <Images.Capture />
              </TouchableOpacity>
              <View style={{ width: normalize(36) }} />
            </View>
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  cameraView: {
    height: normalize(height * 0.57),
  },
  cameraActionsWrapper: {
    flex: 1,
    padding: normalize(24),
  },
  cameraActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storagePhotosButton: {
    width: normalize(56),
    height: normalize(56),
    borderWidth: normalize(4),
    borderColor: '#fff',
    borderRadius: normalize(8),
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  camera: {
    justifyContent: 'flex-end',
    position: 'relative',
    height: '100%',

    overflow: 'hidden',
  },
  storageThumbnail: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: normalize(4),
  },
  previewImage: {
    width: '100%',
    flex: 1,
  },
  ctaWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cta: {
    flex: 1,
  },
  cameraButtons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: normalize(16),
  },
})

export default CoverPhotoCameraScreen
