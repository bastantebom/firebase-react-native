import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Highlight from './Highlight'
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { normalize } from '@/globals';

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: 'bold',
  },
});

const InfiniteHits = ({ hits, hasMore, refine }) => (
  <View 
    style={{ 
      // paddingBottom: normalize(150), 
      // marginTop: normalize(25),
      // flex: 1,
      // position: 'absolute', 
      // zIndex: 999999,
      // left: 0,
      // right: 0,
      // top: 0,
      // bottom: 0,
      // backgroundColor: 'red', 
      // width: '100%',
      // height: '100%',
      // maxHeight: '90%'
    }}
  >
    <FlatList
      data={hits}
      keyExtractor={item => item.objectID}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasMore && refine()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity onPress={() => null}>
            <Highlight attribute="name" hit={item} />
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);