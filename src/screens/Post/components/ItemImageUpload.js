import React, { useState, useEffect } from 'react'
import ImagePicker from 'react-native-image-crop-picker'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { CoverPhoto } from '@/assets/images'
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
  })

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleSelect()}
        style={{ display: isVisible && !imgSrc ? 'flex' : 'none' }}>
        <View style={styles.coverPhoto}>
          <CoverPhoto width={normalize(48)} height={normalize(42)} />
          <AppText
            textStyle="body2"
            color={Colors.contentOcean}
            customStyle={{ marginTop: normalize(8), maxWidth: 67 }}>
            Add a photo
          </AppText>
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
