import React, { useState } from 'react'
import { CacheableImage } from '@/components'
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native'

import { CloseLight } from '@/assets/images/icons'
import { normalize, Colors } from '@/globals'
import SwiperFlatList from 'react-native-swiper-flatlist'
import PropTypes from 'prop-types'
import ImageZoom from 'react-native-image-pan-zoom'
import { ScrollView } from 'react-native-gesture-handler'
import PostImage from '@/components/Post/post-image'

const { width, height } = Dimensions.get('window')

export const ImageModal = ({ close, data, selectedIndex }) => {
  const Pagination = ({
    size,
    paginationIndex,
    scrollToIndex,
    paginationDefaultColor,
    paginationActiveColor,
  }) => {
    return (
      <View style={styles.paginationContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {Array.from({ length: size }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex({ index })}>
              <PostImage
                style={[
                  {
                    height: 40,
                    width: 40,
                    borderRadius: 5,
                    marginHorizontal: 4,
                  },
                  paginationIndex === index
                    ? { borderColor: paginationActiveColor, borderWidth: 3 }
                    : { borderColor: paginationDefaultColor },
                ]}
                size="32x32"
                path={data[index]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  Pagination.propTypes = {
    scrollToIndex: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    paginationIndex: PropTypes.number,
  }

  Pagination.defaultProps = {
    data: [],
    paginationIndex: 0,
  }

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}>
      <TouchableOpacity
        onPress={close}
        style={{ position: 'absolute', right: 15, top: 35, zIndex: 999 }}>
        <CloseLight width={normalize(25)} height={normalize(25)} />
      </TouchableOpacity>
      <View style={styles.container}>
        <SwiperFlatList
          paginationActiveColor={Colors.primaryYellow}
          showPagination
          index={selectedIndex}
          PaginationComponent={Pagination}>
          {data.map((path, i) => {
            return (
              <View key={i} style={styles.child}>
                <ImageZoom
                  cropWidth={width}
                  cropHeight={height}
                  imageWidth={width - 15}
                  imageHeight={450}
                  minScale={1}
                  maxScale={3}
                  useNativeDriver={true}>
                  <PostImage
                    path={path}
                    style={{
                      minHeight: normalize(450),
                      width: '100%',
                    }}
                    resizeMode="contain"
                  />
                </ImageZoom>
              </View>
            )
          })}
        </SwiperFlatList>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  child: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  paginationContainer: {
    paddingHorizontal: 15,
    position: 'absolute',
    width: width,
    bottom: 50,
  },
})
