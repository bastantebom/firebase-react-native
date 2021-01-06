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
import { Context } from '@/context'
import { NoSearch } from '@/assets/images'
import SearchItem from './SearchItem'

const { width, height } = Dimensions.get('window')

const SearchResults = ({ searchValue, containerStyle }) => {
  const { searchType, setSearchType } = useContext(Context)

  const [opacity] = useState(new Animated.Value(1))

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
  }, [searchType, searchValue])

  return (
    <View style={[styles.parent, containerStyle]}>
      {!searchValue?.length ? (
        <PaddingView
          paddingSize={2}
          style={{ alignItems: 'center', paddingTop: normalize(50) }}>
          <NoSearch />
          <AppText
            textStyle="body1medium"
            customStyle={{ textAlign: 'center', marginTop: normalize(35) }}>
            Looking for something?
          </AppText>
        </PaddingView>
      ) : (
        <View style={{ flex: 1, padding: normalize(16) }}>
          <SearchItem value={searchValue} />
        </View>
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
    zIndex: 9999,
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
