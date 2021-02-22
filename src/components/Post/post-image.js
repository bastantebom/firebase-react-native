import { DefaultNeed, DefaultSell, DefaultService } from '@/assets/images'
import { GlobalStyle } from '@/globals'
import { isUrl } from '@/globals/Utils'
import ImageApi from '@/services/image-api'
import React, { useEffect, useState } from 'react'
import { Image, PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'

const sizeProps = {
  width: '100%',
  height: '100%',
}

const pow2ceil = n => {
  let p = 2
  while ((n >>= 1)) p <<= 1
  return p
}

const DefaultPostThumbnail = ({ type }) => {
  switch (type?.toLowerCase()) {
    case 'service':
      return <DefaultService {...sizeProps} />
    case 'need':
      return <DefaultNeed {...sizeProps} />
    default:
      return <DefaultSell {...sizeProps} />
  }
}

const DefaultPostImage = ({ type }) => {
  const defaultImages = {
    need: require('@/assets/images/cover-need.png'),
    sell: require('@/assets/images/cover-sell.png'),
    service: require('@/assets/images/cover-service.png'),
  }

  return <Image style={GlobalStyle.image} source={defaultImages[type]} />
}

/**
 * @param {object} param0
 * @param {string} param0.path image firebase path
 * @param {string} param0.size image dimensions
 * @param {string} param0.postType post type
 */
const PostImage = ({ path, size, postType, type = 'thumbnail', ...props }) => {
  const [source, setSource] = useState({
    uri:
      !isUrl(path) && path
        ? ImageApi.pathUrls.find(pathUrl => pathUrl.path === path)?.url
        : null,
  })

  const handlePathChange = async path => {
    if (isUrl(path)) setSource({ uri: path })
    else if (path) {
      const _size = size
        ? size
            .split('x')
            .map(PixelRatio.getPixelSizeForLayoutSize)
            .map(pow2ceil)
            .join('x')
        : null

      const uri =
        ImageApi.pathUrls.find(
          pathUrl =>
            pathUrl.path === ImageApi.getThumbnailPath({ path, size: _size })
        )?.url ||
        ImageApi.pathUrls.find(
          pathUrl => pathUrl.path === ImageApi.getThumbnailPath({ path, size })
        )?.url ||
        (await ImageApi.getUrl({ path, size: _size })) ||
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
      style={sizeProps}
      {...props}
    />
  ) : type === 'thumbnail' ? (
    <DefaultPostThumbnail type={postType} />
  ) : (
    <DefaultPostImage type={postType} />
  )
}

export default PostImage
