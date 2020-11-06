import React from 'react'
import FastImage from 'react-native-fast-image'

const CacheableImage = props => {
  return (
    <FastImage
      resizeMode={FastImage.resizeMode.cover}
      {...props}
      source={{
        uri: props?.source?.uri,
        priority: FastImage.priority.normal,
      }}
    />
  )
}

export default CacheableImage
