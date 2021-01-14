import React, { useState, useEffect } from 'react'
import ImagePicker from 'react-native-image-crop-picker'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { CoverPhoto, Images } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { AppText } from '@/components'
import { Svg, Rect, Image } from 'react-native-svg'

const CoverPhotoUpload = ({
  size,
  imgSourceHandler,
  imgSrc,
  clear = false,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [imageSource, setImageSource] = useState(null)

  useEffect(() => {
    clear ? setImageSource(null) : imageSource
  }, [])

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: normalize(114),
      height: normalize(114),
      cropping: true,
    })
      .then(response => {
        const source = { uri: response.path }
        setImageSource(source)
        imgSourceHandler(source)
        setIsVisible(false)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const styles = StyleSheet.create({
    coverPhoto: {
      height: normalize(114),
      borderWidth: imgSrc ? 0 : 1,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: Colors.neutralGray,
      borderRadius: normalize(8),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    notEmpty: {
      borderColor: Colors.contentEbony,
      overflow: 'hidden',
      borderWidth: 0,
      borderRadius: normalize(8),
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

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleSelect()}
        style={{ display: isVisible && !imgSrc ? 'flex' : 'none' }}>
        <View style={styles.coverPhoto}>
          <Images.CameraImage width={normalize(56)} height={normalize(56)} />
          <Text style={styles.uploadLabel}>+ Add 10 Photos</Text>
        </View>
      </TouchableOpacity>

      <View style={{ display: !isVisible || imgSrc ? 'flex' : 'none' }}>
        <View style={{ ...styles.coverPhoto, ...styles.notEmpty }}>
          <Svg height="100%" width="100%">
            <Image
              width="100%"
              height={normalize(114)}
              opacity="1"
              href={imageSource || imgSrc}
              onPress={() => handleSelect()}
            />
          </Svg>
        </View>
      </View>
    </View>
  )
}

export default CoverPhotoUpload
