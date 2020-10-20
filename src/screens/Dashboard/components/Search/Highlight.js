import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, CacheableImage } from '@/components';
import { Context } from '@/context';
import { normalize } from '@/globals';
import { Search } from '@/assets/images/icons';

export default Highlight = ({ hit }) => {

  const { searchType } = useContext(Context);

  // useEffect(() => {
  //   console.log('*********************************************')
  //   console.log(hit.images && hit.images[0])
  //   // console.log(hit._highlightResult.title.matchedWords)
  // }, [hit])

  return (
    <View style={styles.highlightWrapper}>
      <View style={{ flexDirection: 'row',  maxWidth: '83%' }}>
        <Search width={normalize(20)} height={normalize(20)} />
        <AppText 
          textStyle={'body2'} 
          numberOfLines={1}
          customStyle={{ marginLeft: 10 }}
        >
          { searchType === 'posts' ? hit.title : hit.display_name || '@' + hit.username }
        </AppText>
      </View>
      { searchType === 'posts' && hit.images && hit.images[0] ?
        <CacheableImage
          source={{ uri: hit.images[0] }}
          style={styles.icon}
        /> 
        : 
        <CacheableImage
          source={{ uri: hit.profile_photo }}
          style={styles.icon}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  highlightWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  icon: {
    height: normalize(25), 
    width: normalize(25),
    borderRadius: 4
  }
})

