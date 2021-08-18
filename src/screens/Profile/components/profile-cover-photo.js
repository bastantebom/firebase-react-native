import React, { useEffect, useState, useRef } from 'react'
import { Platform, Image } from 'react-native'
import FastImage from 'react-native-fast-image'

import ImageApi from '@/services/image-api'
import { isUrl, normalize } from '@/globals/Utils'
import { ProfileHeaderDefault } from '@/assets/images'

const sizeProps = {
  width: '100%',
  height: '100%',
}

/**
 * @param {string} path image firebase path
 * @param {string} width image width
 * @param {string} height image height
 */
const ProfileCoverPhoto = ({ path, width, height }) => {
  const [source, setSource] = useState(null)
  const mounted = useRef(true)

  const handleOnPathChange = async path => {
    if (isUrl(path)) setSource(path)
    else if (path) {
      const uri =
        (await ImageApi.getUrl({ path, size: width + 'x' + height })) ||
        (await ImageApi.getUrl({ path }))

      if (!mounted.current) return
      setSource({ uri })
    }
  }

  useEffect(() => {
    handleOnPathChange(path)
  }, [path])

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  return isUrl(source?.uri) ? (
    <>
      {Platform.select({
        android: (
          <FastImage
            resizeMode="cover"
            source={source}
            style={{ ...sizeProps, zIndex: 1 }}
          />
        ),
        ios: (
          <Image
            resizeMode="cover"
            source={source}
            style={{ ...sizeProps, zIndex: 1 }}
          />
        ),
      })}
    </>
  ) : (
    <ProfileHeaderDefault width={width} height={height} />
  )
}

export default ProfileCoverPhoto
