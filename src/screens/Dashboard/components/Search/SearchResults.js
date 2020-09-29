import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';
import Modal from 'react-native-modal';
import { normalize, Colors } from '@/globals';
import {  AppButton, AppText, PaddingView } from '@/components';
import { ChevronRight, CircleTickGray, HeaderBackGray, UserCircle } from '@/assets/images/icons';
import Tags from './Tags';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectSearchBox } from 'react-instantsearch-native';
import SearchBox from './Searchbox';
import InfiniteHits from './InfiniteHits';
import RefinementList from './RefinementList';

const { width, height } = Dimensions.get('window');
// const PADDING = 16;
const SEARCH_FULL_WIDTH = width - normalize(25);

const SearchResults = ({ onValueChange }) => {

  const [ userSearch, setUserSearch ] = useState(false)
  const [ followingSearch, setFollowingSearch ] = useState(false)

  // useEffect(() => {
  //   console.log(onValueChange)
  //   console.log('this is search results')
  // })

  return (
    <View style={styles.parent}>
      <View 
        style={{ 
          borderBottomWidth: 1, 
          borderColor: Colors.neutralGray, 
          elevation: 3
        }}
      />
      { onValueChange === undefined || onValueChange === '' ? (
          <PaddingView paddingSize={2}>
            <TouchableOpacity onPress={() => setUserSearch(!userSearch)} activeOpacity={.7}>
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
        ) : (
        <PaddingView paddingSize={2}>
          <InfiniteHits value={onValueChange} />
        </PaddingView>
        )
      }
      <Modal
        isVisible={userSearch}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onBackButtonPress={() => setUserSearch(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          // height: height,
          flexGrow: 1,
        }}
      >
        <UserSearch onValueChange={onValueChange} />
      </Modal>
    </View>
  )
};

const UserSearch = ({ onValueChange }) => {

  const [opacity] = useState(new Animated.Value(1))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const [searchValue, setSearchValue] = useState()

  const onFocus = () => {
    // Animated.parallel([
    //   Animated.timing(opacity, {
    //     toValue: 1,
    //     duration: 100,
    //     useNativeDriver: true
    //   })
    // ]).start();
    setSearchBarFocused(true);
  }

  const onBackPress = () => {
    // Animated.parallel([
    //   Animated.timing(opacity, {
    //     toValue: 0,
    //     duration: 100,
    //     useNativeDriver: true
    //   })
    // ]).start();
    setSearchBarFocused(false);
    Keyboard.dismiss();
  }

  const searchClient = algoliasearch(
    "B1G2GM9NG0",
    "aadef574be1f9252bb48d4ea09b5cfe5"
  );

  return (
    <View style={{ width: width, height: height, flexGrow: 1, flex: 1 }}>
      <PaddingView paddingSize={2}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            // onPress={back}
            activeOpacity={0.7}
            style={{position: 'absolute', left: 0}}
          >
            <HeaderBackGray width={normalize(25)} height={normalize(25)} />
          </TouchableOpacity>
          <AppText textStyle="body3">Search User</AppText>
        </View>
        <View style={{ 
          height: height, 
          width: width, 
          flex: 1,
          position: 'absolute', 
          top: 0, 
          // backgroundColor: 'red', 
          // justifyContent: 'flex-start',
          // alignContent: 'flex-start',
          // alignItems: 'flex-start'
          }}>
          <InstantSearch searchClient={searchClient} indexName="demo_ecommerce">
            <SearchBox 
              onSearchFocus={onFocus} 
              onBackPress={onBackPress}
              valueHandler={onValueChange}
              customStyle={{ width: SEARCH_FULL_WIDTH }}
              label="jkasjkajskj"
            />
            <Animated.View 
              style={{ 
                opacity: opacity, 
                display: searchBarFocused ? 'flex' : 'none',
                zIndex: searchBarFocused ? 1 : 0,
                flex: 1,
              }}
            >
              <SearchResults onValueChange={searchValue} />
            </Animated.View>
          </InstantSearch>
        </View>
      </PaddingView>
    </View>
  )
}

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
    paddingTop: normalize(15)
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