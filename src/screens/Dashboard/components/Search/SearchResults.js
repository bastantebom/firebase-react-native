import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { normalize, Colors } from '@/globals'
import { AppText, PaddingView } from '@/components'
import { ChevronRight, UserCircle } from '@/assets/images/icons'
import Tags from './Tags'
import { Context } from '@/context'

import InfiniteHits from './InfiniteHits'

const { width, height } = Dimensions.get('window')
const SEARCH_FULL_WIDTH = width - normalize(25)

const SearchResults = ({ onValueChange }) => {
  const { searchType, setSearchType } = useContext(Context)

  const [opacity] = useState(new Animated.Value(1))

  const onSearchSelect = () => {
    setSearchType('user')
  }

  useEffect(() => {
    if (searchType === 'posts') {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [searchType, onValueChange])

  return (
    <View
      style={[
        styles.parent,
        {
          zIndex: 9999,
          paddingBottom: searchType === 'posts' ? normalize(15) : normalize(70),
          top: searchType === 'posts' ? normalize(60) : normalize(120),
        },
      ]}>
      {onValueChange === undefined || onValueChange === '' ? (
        <Animated.View
          style={{
            opacity: opacity,
            display: searchType !== 'posts' ? 'none' : 'flex',
          }}>
          <PaddingView paddingSize={2}>
            <TouchableOpacity
              onPress={() => onSearchSelect()}
              activeOpacity={0.7}>
              <View style={styles.searchContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <UserCircle width={normalize(25)} height={normalize(25)} />
                  <AppText textStyle="body2" customStyle={{ marginLeft: 11 }}>
                    Search user instead
                  </AppText>
                </View>
                <ChevronRight width={normalize(25)} height={normalize(25)} />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => null} activeOpacity={.7}>
              <View style={styles.searchContainer}>  
                <View style={{ flexDirection: 'row' }}>
                  <CircleTickGray width={normalize(25)} height={normalize(25)} />
                  <AppText textStyle="body2" customStyle={{ marginLeft: 11 }}>
                    Search in following
                  </AppText>
                </View>
                  <ChevronRight width={normalize(25)} height={normalize(25)} />
              </View>
            </TouchableOpacity> */}
            <Tags />
          </PaddingView>
        </Animated.View>
      ) : (
        <PaddingView paddingSize={2}>
          <InfiniteHits value={onValueChange} />
        </PaddingView>
      )}
    </View>
  )
}

export default SearchResults

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: width,
    height: height,
    maxHeight: height - normalize(130),
    left: -16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutralGray,
    paddingTop: 8,
    paddingBottom: 15,
  },
})
