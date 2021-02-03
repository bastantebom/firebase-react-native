import { ProfileImageDefault } from '@/assets/images/icons'
import { isUrl } from '@/globals/Utils'
import ImageApi from '@/services/image-api'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'

/**
 * @param {object} param0
 * @param {string} param0.path firebase image path
 * @param {string} param0.size image dimensions
 */
const Avatar = ({ path, size, ...props }) => {
  const [source, setSource] = useState(null)
  const sizeProps = { width: '100%', height: '100%' }

  const handlePathChange = async path => {
    if (isUrl(path)) setSource({ uri: path })
    else if (path) {
      const uri =
        (await ImageApi.getUrl({ path, size })) ||
        (await ImageApi.getUrl({ path }))
      setSource({ uri })
    }
  }

  useEffect(() => {
    handlePathChange(path)
  }, [path])

  return isUrl(source?.uri) ? (
    <FastImage
      resizeMode={FastImage.resizeMode.cover}
      source={source}
      {...props}
    />
  ) : (
    <ProfileImageDefault {...sizeProps} {...props} />
  )
}

export default Avatar
