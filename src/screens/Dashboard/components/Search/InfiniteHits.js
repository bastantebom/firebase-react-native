import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Highlight from './Highlight'
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { Colors, normalize } from '@/globals';
import { AppButton, AppText } from '@/components';
import Tags from './Tags';

const InfiniteHits = ({ hits, hasMore, refine, value }) => {

  useEffect(() => {
    console.log(hits)
    console.log('hits')
  }, [hits])

  return (
    <View>
      { hits.length !== 0 ? (
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
        /> ) : (
          <View>
            <AppText textStyle="subtitle1">Your search “{value}” did not match any post. </AppText>
            <AppText textStyle="subtitle1">Try another search?</AppText>
            <View style={{ marginVertical: 15 }}>
              <AppText textStyle="caption">
                - Check if the spelling is  correct
              </AppText>
              <AppText textStyle="caption">
                - Use different keywords
              </AppText>
            </View>
            <AppButton
              text="Change your location or distance"
              type="primary"
              height="sm"
              customStyle={{ paddingVertical: 5, height: normalize(40) }}
            />
            <Tags/>
          </View>
        )
      }
    </View> 
  )
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: Colors.neutralGray,
  },
  item: {
    flex: 1,
    // flexDirection: 'row',
    paddingVertical: 10,
    flexDirection: 'column',
  }
});