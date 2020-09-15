import React, { useState } from 'react';
import {CacheableImage} from '@/components';
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert
} from 'react-native';

import {CloseLight} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import SwiperFlatList from 'react-native-swiper-flatlist';
import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';

const {width, height} = Dimensions.get('window');

export const ImageModal = ({close, data}) => {
  const Pagination = ({
    size,
    paginationIndex,
    scrollToIndex,
    paginationDefaultColor,
    paginationActiveColor,
  }) => {

    return (
      <View style={styles.paginationContainer}>
        {Array.from({length: size}).map((_, index) => (
          <TouchableOpacity key={index} onPress={() => scrollToIndex({index})}>
            <CacheableImage
              // key={item.id}
              style={[
                {height: 40, width: 40, borderRadius: 5, marginHorizontal: 4},
                paginationIndex === index
                  ? {borderColor: paginationActiveColor, borderWidth: 3}
                  : {borderColor: paginationDefaultColor},
              ]}
              source={{uri: data[index]}}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  Pagination.propTypes = {
    scrollToIndex: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    paginationIndex: PropTypes.number,
  };

  Pagination.defaultProps = {
    data: [],
    paginationIndex: 0
  };

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
        style={{position: 'absolute', right: 15, top: 35, zIndex: 999}}>
        <CloseLight width={normalize(25)} height={normalize(25)} />
      </TouchableOpacity>
      <View style={styles.container}>
        <SwiperFlatList
          paginationActiveColor={Colors.primaryYellow}
          showPagination
          PaginationComponent={Pagination}>
          {data.map((item, i) => {
            return (
              <View key={i} style={styles.child}>
                <ImageZoom 
                  cropWidth={width}
                  cropHeight={height}
                  imageWidth={width - 15}
                  imageHeight={450}
                  // maxOverflow={0}
                  minScale={1}
                  maxScale={3}
                  // panToMove={false}
                  // pinchToZoom={true}
                  useNativeDriver={true}
                  // onMove={(positionX, positionY) => console.log(positionX, positionY)}
                  // onMoveShouldSetPanResponder={() => true}
                >
                  <CacheableImage
                    style={{
                      minHeight: 450, width: width - 15
                      // height: 450,
                      // width: 450
                    }}
                    source={{uri: item}}
                  />
                </ImageZoom>
                {/* <PinchGestureHandler
                  onGestureEvent={onPinchEvent}
                  onHandlerStateChange={onPinchStateChange}
                >
                  <Animated.Image
                    style={{minHeight: 450, width: width - 15, transform: [{  scale: scale }]}}
                    source={{uri: item}}
                    // resizeMode='contain'
                  />
                </PinchGestureHandler> */}
              </View>
            );
          })}
        </SwiperFlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
  child: {
    // height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 50,
    left: 0,
    right: 0,
  },
});
