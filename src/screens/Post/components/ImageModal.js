import React, {useEffect, useState} from 'react';
import {AppText, PaddingView, CacheableImage} from '@/components';
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import {CloseLight} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist';
// import Pagination from './Pagination';
import PropTypes from 'prop-types';

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
    paginationActiveColor: PropTypes.string,
    paginationDefaultColor: PropTypes.string,
  };

  Pagination.defaultProps = {
    data: [],
    paginationIndex: 0,
    paginationActiveColor: 'pink',
    paginationDefaultColor: 'black',
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#000',
        // padding: 8
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
          {data.map((item) => {
            return (
              <View key={item.id} style={styles.child}>
                <CacheableImage
                  style={{minHeight: 450, width: width - 15}}
                  source={{uri: item}}
                />
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
