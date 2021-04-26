import { DefaultNeed, DefaultSell, DefaultService } from '@/assets/images'
import { isUrl } from '@/globals/Utils'
import ImageApi from '@/services/image-api'
import React, { useEffect, useState } from 'react'
import { PixelRatio, Platform, StyleSheet, View, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import LottieView from 'lottie-react-native'
import sellLoader from '@/assets/animations/sell-loader.json'
import serviceLoader from '@/assets/animations/service-loader.json'
import needLoader from '@/assets/animations/need-loader.json'

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

const PostLoader = ({ type }) => {
  switch (type?.toLowerCase()) {
    case 'service':
      return <LottieView source={serviceLoader} autoPlay />
    case 'need':
      return <LottieView source={needLoader} autoPlay />
    default:
      return <LottieView source={sellLoader} autoPlay />
  }
}

export const DefaultPostImage = ({ type, ...props }) => {
  const defaultImages = {
    need: require('@/assets/images/cover-need.png'),
    sell: require('@/assets/images/cover-sell.png'),
    service: require('@/assets/images/cover-service.png'),
  }

  return (
    <FastImage
      resizeMode="cover"
      source={defaultImages[type]}
      style={{ height: '100%', width: '100%' }}
    />
  )
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
  const [isLoading, setIsLoading] = useState(true)

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
    <>
      {isLoading && (
        <View style={styles.loader}>
          <PostLoader type={postType} />
        </View>
      )}
      {Platform.select({
        android: (
          <FastImage
            resizeMode="cover"
            source={source}
            style={{ ...sizeProps, zIndex: 1 }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            {...props}
          />
        ),
        ios: (
          <Image
            resizeMode="cover"
            source={source}
            style={{ ...sizeProps, zIndex: 1 }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            {...props}
          />
        ),
      })}
    </>
  ) : type === 'thumbnail' ? (
    <DefaultPostThumbnail type={postType} />
  ) : (
    <DefaultPostImage type={postType} />
  )
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PostImage
