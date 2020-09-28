import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Highlight from './Highlight'
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { normalize } from '@/globals';
import { AppText } from '@/components';
import InfiniteHits from './InfiniteHits';

const { width, height } = Dimensions.get('window');

const SearchResults = ({ children }) => {
  return (
    <View style={styles.parent}>
      <View style={styles.fullScreen}/>
      {/* <View style={styles.floatView}/> */}
        {/* <AppText textStyle="body2">
          Search user instead
        </AppText> */}
      <InfiniteHits/>
    </View>
  )
};

export default SearchResults;

const styles = StyleSheet.create({
  fullScreen: {
    // flex: 1,
    position: 'relative',
    // zIndex: 9999,
    width: width,
    height: height,
    top: 5,
    left: -16,
    // backgroundColor: 'red',
},
floatView: {
    // position: 'absolute',
    // width: width,
    // height: height,
    // top: 0,
    // left: -16,
    // backgroundColor: 'green',
},
parent: {
    flex: 1,
}
})