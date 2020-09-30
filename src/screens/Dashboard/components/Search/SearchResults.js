import React, { useContext, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';
import { debounce } from 'lodash';
import { normalize, Colors } from '@/globals';
import { AppButton, AppText, PaddingView } from '@/components';
import { 
  ChevronRight, 
  CircleTickGray, 
  HeaderBackGray, 
  UserCircle 
} from '@/assets/images/icons';
import Tags from './Tags';
import { Context } from '@/context'

import InfiniteHits from './InfiniteHits';

const { width, height } = Dimensions.get('window');
const SEARCH_FULL_WIDTH = width - normalize(25);

const SearchResults = ({ onValueChange }) => {

  const { searchType, setSearchType } = useContext(Context);

  const [opacity] = useState(new Animated.Value(1))

  const onSearchSelect = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }),
    ]).start();
  }


  useEffect(() => {
    if (searchType === 'posts') {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();
    }
    console.log(searchType)
  }, [searchType])

  return (
    <View style={styles.parent}>
      <Animated.View  
        style={{ 
          borderBottomWidth: 1, 
          borderColor: Colors.neutralGray, 
          elevation: 3,
          display: searchType !== 'posts' ? 'none' : 'flex',
        }}
      />
      { onValueChange === undefined || onValueChange === '' ? (
        <Animated.View 
          style={{
            // opacity: 1,
            opacity: opacity,
            display: searchType !== 'posts' ? 'none' : 'flex'
          }}
        >
          <PaddingView paddingSize={2}>
            <TouchableOpacity onPress={() => {setSearchType('user'), onSearchSelect()}} activeOpacity={.7}>
              <View style={styles.searchContainer} >  
                <View style={{ flexDirection: 'row' }}>
                  <UserCircle width={normalize(25)} height={normalize(25)} />
                  <AppText textStyle="body2" customStyle={{ marginLeft: 11 }}>
                    Search user instead
                  </AppText>
                </View>
                  <ChevronRight width={normalize(25)} height={normalize(25)} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => null} activeOpacity={.7}>
              <View style={styles.searchContainer}>  
                <View style={{ flexDirection: 'row' }}>
                  <CircleTickGray width={normalize(25)} height={normalize(25)} />
                  <AppText textStyle="body2" customStyle={{ marginLeft: 11 }}>
                    Search in following
                  </AppText>
                </View>
                  <ChevronRight width={normalize(25)} height={normalize(25)} />
              </View>
            </TouchableOpacity>
            <Tags/>
          </PaddingView> 
        </Animated.View>
        ) : (
        <PaddingView paddingSize={2}>
          <InfiniteHits value={onValueChange} />
        </PaddingView>
        )
      }
    </View>
  )
};

export default SearchResults;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: width,
    height: height,
    top: normalize(50),
    left: -16,
    backgroundColor: 'white',
    maxHeight: height - normalize(130),
    paddingTop: normalize(15),
    // backgroundColor: 'green'
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutralGray,
    paddingTop: 12,
    paddingBottom: 15
  },
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
})