import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native'
import Modal from 'react-native-modal'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'

import { AppText, TabNavigation } from '@/components'
import { normalize, Colors } from '@/globals'
import { Context } from '@/context'
import { PostImages, CloseLight } from '@/assets/images/icons'
import { PostCamera } from './Camera'
import { Library } from './Library'
import { Images } from '@/assets/images'

const { height, width } = Dimensions.get('window')

export const PostImageUpload = ({ data }) => {
  const currentData = data
  const {
    postImage,
    setImageCount,
    imageCount,
    coverPhoto,
    setCoverPhoto,
    setSelected,
    selected,
    postCameraImage,
    setRecentImages,
    libImages,
    setLibImages,
    cameraImage,
    setCameraImage,
    singleCameraImage,
    setSingleCameraImage,
  } = useContext(Context)

  const [showPickerModal, setShowPickerModal] = useState(false)

  const [photoSet, setPhotoSet] = useState(currentData?.cover_photos)

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break
            case RESULTS.DENIED:
              request(PERMISSIONS.IOS.CAMERA)
              break
            case RESULTS.GRANTED:
              togglePickerModal()
              break
            case RESULTS.BLOCKED:
              break
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          togglePickerModal()
        } else {
          return null
        }
      } catch (err) {
        console.log(err)
      }
  }

  const togglePickerModal = () => {
    setShowPickerModal(!showPickerModal)
  }

  const handleRemove = async image => {
    if (photoSet) {
      const newCoverPhoto = coverPhoto.filter(item => item !== image)
      setPhotoSet(newCoverPhoto)
      setCoverPhoto(newCoverPhoto)

      const newLibImage = libImages.filter(item => item !== image)
      setLibImages(newLibImage)
    }

    const newCoverPhoto = coverPhoto.filter(item => item !== image)
    setCoverPhoto(newCoverPhoto)

    if (!photoSet) {
      const newCameraImage = cameraImage.filter(item => item !== image)
      setCameraImage(newCameraImage)

      const newSelected = selected.filter(item => item.uri !== image)
      setSelected(newSelected)

      const newLibImage = libImages.filter(item => item !== image)
      setLibImages(newLibImage)
    }
  }

  const cancelUploadPhoto = () => {
    togglePickerModal()
  }

  const continueUploadPhoto = () => {
    togglePickerModal()
  }

  const cancelCamera = () => {
    if (singleCameraImage !== null) {
      const newCameraImage = cameraImage
      const index = newCameraImage.length - 1
      newCameraImage.splice(index, 1)
      const newCoverPhoto = [...newCameraImage, ...libImages].sort((a, b) =>
        !~coverPhoto.indexOf(b) && ~coverPhoto.indexOf(a)
          ? -1
          : !~coverPhoto.indexOf(a)
          ? 1
          : coverPhoto.indexOf(a) - coverPhoto.indexOf(b)
      )
      setCoverPhoto([...newCoverPhoto])
      setImageCount(newCameraImage.length)
      setSingleCameraImage(null)
    }
    togglePickerModal()
  }

  const continueCamera = () => {
    setSingleCameraImage(null)
    togglePickerModal()
  }

  const uploadTabs = [
    {
      key: 'camera',
      title: 'Photo',
      renderPage: (
        <PostCamera
          cancel={cancelCamera}
          next={continueCamera}
          data={photoSet}
        />
      ),
    },
    {
      key: 'cameraroll',
      title: 'Library',
      renderPage: (
        <Library
          cancel={cancelUploadPhoto}
          next={continueUploadPhoto}
          data={photoSet}
        />
      ),
    },
  ]

  return (
    <>
      {imageCount === 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.uploadDropBox}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => requestPermission()}>
              <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                <Images.CameraImage
                  width={normalize(56)}
                  height={normalize(56)}
                />
                <Text style={styles.uploadLabel}>+ Add 10 Photos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            height: normalize(114),
            width: '100%',
            flexDirection: 'row',
            marginBottom: 8,
          }}>
          <ScrollView horizontal>
            {coverPhoto.map((image, i) => {
              return (
                <View key={i}>
                  <TouchableOpacity
                    onPress={() => handleRemove(image)}
                    style={{
                      zIndex: 999,
                      position: 'absolute',
                      right: 20,
                      top: 5,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,.6)',
                        width: normalize(28),
                        height: normalize(28),
                        borderRadius: 50,
                      }}
                    />
                    <View
                      style={{ left: normalize(3.75), top: normalize(3.5) }}>
                      <CloseLight
                        width={normalize(20)}
                        height={normalize(20)}
                      />
                    </View>
                  </TouchableOpacity>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width:
                        imageCount === 1
                          ? width / 2
                          : imageCount === 2
                          ? width / 3.333
                          : width / 4,
                      height: normalize(114),
                      marginRight: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
              )
            })}
          </ScrollView>
          <View
            style={{
              height: normalize(114),
              borderStyle: 'dashed',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.neutralGray,
              justifyContent: 'center',
              width: imageCount <= 1 ? width / 3 : width / 4,
              marginLeft: imageCount >= 3 ? 8 : 0,
            }}>
            <TouchableOpacity
              disabled={imageCount === 10 && true}
              activeOpacity={0.7}
              onPress={() => requestPermission()}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  opacity: imageCount === 10 ? 0.5 : 1,
                }}>
                <PostImages width={normalize(56)} height={normalize(56)} />
                <AppText
                  textStyle="body2"
                  color={Colors.contentOcean}
                  customStyle={{ paddingHorizontal: 15, textAlign: 'center' }}>
                  Upload Photo
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AppText textStyle="metadata" customStyle={{ marginBottom: 16 }}>
        <AppText customStyle={{ fontWeight: 'bold' }}>
          Photos - {imageCount}/10
        </AppText>{' '}
        Choose up to 10 photos for your listing. The first photo you upload is
        automatically your cover photo.
      </AppText>

      <Modal
        isVisible={showPickerModal}
        onBackButtonPress={() => togglePickerModal()}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: '100%',
          }}>
          <TabNavigation routesList={uploadTabs} bottomTab />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  uploadDropBox: {
    borderStyle: 'dashed',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    justifyContent: 'center',
    marginBottom: normalize(17),
    paddingHorizontal: normalize(28),
    paddingVertical: normalize(14),
  },
  uploadLabel: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    color: Colors.contentOcean,
    letterSpacing: 0.4,
    lineHeight: normalize(18),
    width: normalize(60),
    textAlign: 'center',
  },
})
