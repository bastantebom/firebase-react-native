import React, { useState, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import CameraRollPicker from 'react-native-camera-roll-picker'
import Modal from 'react-native-modal'

import { AppText } from '@/components'
import { Context } from '@/context'
import { normalize, Colors } from '@/globals'
import { PhotoAlbums } from './PhotoAlbums'
import { CircleTickWhite } from '@/assets/images/icons'

const { height, width } = Dimensions.get('window')

export const Library = ({ cancel, next, data }) => {
  const {
    setImageCurrent,
    imageCurrent,
    selected,
    setLibImages,
    coverPhoto,
  } = useContext(Context)

  const [showFolderList, setShowFolderList] = useState(false)

  const getSelectedImages = async images => {
    const imageUrl = []
    images.forEach(image => imageUrl.push(image.uri ? image.uri : image))
    setLibImages(imageUrl)

    const num = imageUrl.length - 1
    setImageCurrent(num >= 0 ? images[num].uri : '')
  }

  const toggleFolderList = () => {
    setShowFolderList(!showFolderList)
  }

  console.log(coverPhoto?.length)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
          }}>
          <TouchableOpacity
            onPress={cancel}
            style={{ paddingVertical: 5, paddingHorizontal: 25 }}>
            <AppText textStyle="body2">Cancel</AppText>
          </TouchableOpacity>
          <AppText textStyle="body1">All Photos</AppText>
          <TouchableOpacity
            onPress={() => {
              next()
            }}
            style={{ paddingVertical: 5, paddingHorizontal: 25 }}>
            <AppText textStyle="body3" color={Colors.contentOcean}>
              Next
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 15,
              zIndex: 999,
              right: 0,
              left: 0,
              margin: 'auto',
            }}>
            <AppText
              textStyle="eyebrow2"
              customStyle={{ alignItems: 'center', textAlign: 'center' }}
              color={Colors.neutralsWhite}>
              <AppText
                customStyle={{ fontWeight: '700' }}
                color={Colors.neutralsWhite}>
                Photos - {coverPhoto?.length || 0}/10{' '}
              </AppText>{' '}
              Choose your listing’s main photo first for Cover Photo.
            </AppText>
          </View>
          {imageCurrent ? (
            <Image
              source={{ uri: imageCurrent }}
              style={{
                width: '100%',
                height: height / 2.2,
              }}
            />
          ) : null}
          <View
            style={{
              height: imageCurrent
                ? height / 1.8 - normalize(122)
                : height - normalize(117),
              zIndex: -1,
              width: width,
              opacity: coverPhoto?.length === 10 ? 0.5 : 1,
            }}>
            <CameraRollPicker
              groupTypes="All"
              maximum={coverPhoto?.length === 10 ? selected.length : 10}
              scrollRenderAheadDistance={500}
              selected={selected}
              imagesPerRow={3}
              imageMargin={2}
              selectedMarker={
                <View
                  style={{
                    backgroundColor: Colors.primaryYellow,
                    width: normalize(23),
                    height: normalize(23),
                    borderRadius: 50,
                    position: 'absolute',
                    right: 4,
                    top: 6,
                  }}>
                  <CircleTickWhite
                    width={normalize(28)}
                    height={normalize(28)}
                    style={{
                      backgroundColor: 'transparent',
                      marginTop: -3,
                      marginLeft: -3,
                    }}
                  />
                </View>
              }
              callback={() => getSelectedImages(selected)}
              emptyText={<AppText textStyle="body2">No photos</AppText>}
              emptyTextStyle={{
                color: Colors.primaryYellow,
                width: '100%',
                height: '100%',
                paddingVertical: 45,
              }}
            />
          </View>
        </View>
        <Modal
          isVisible={showFolderList}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={500}
          onSwipeComplete={toggleFolderList}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={toggleFolderList}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <PhotoAlbums />
        </Modal>
      </View>
    </SafeAreaView>
  )
}
