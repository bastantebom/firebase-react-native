import React, { useState, useContext, useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native'

import { FilterDark, Like } from '@/assets/images/icons'

import { Colors, normalize } from '@/globals'
import { Context } from '@/context'

import SearchBox from './Search/Searchbox'
import SearchResults from './Search/SearchResults'
import { useNavigation } from '@react-navigation/native'

const SearchBarWithFilter = ({ show }) => {
  const scrollY = useRef(new Animated.Value(0))
  const navigation = useNavigation()

  const { searchType, setPage } = useContext(Context)

  const [opacity] = useState(new Animated.Value(0))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const [searchValue, setSearchValue] = useState()

  const onValueChange = value => {
    setSearchValue(value)
  }

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 10,
        useNativeDriver: true,
      }),
    ]).start()
    setSearchBarFocused(true)
  }

  const onBackPress = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }),
    ]).start()
    setSearchBarFocused(false)
    Keyboard.dismiss()
    setPage(0)
  }

  const barOpacity = scrollY.current.interpolate({
    inputRange: [0, 1, 5],
    outputRange: [5, 1, 0],
  })

  const H_MAX_HEIGHT = normalize(55)
  const H_MIN_HEIGHT = normalize(40)
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT

  const headerScrollHeight = scrollY.current.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  return (
    <View style={{ margin: 16, marginBottom: 0 }}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View
          style={{
            flex: 1,
            height: searchType !== 'posts' ? normalize(100) : '100%',
          }}>
          <SearchBox
            onSearchFocus={onFocus}
            onBackPress={onBackPress}
            valueHandler={onValueChange}
          />
        </View>
        <Animated.View
          style={{
            opacity: opacity,
            display: searchBarFocused ? 'flex' : 'none',
            zIndex: searchBarFocused ? 1 : 0,
            flex: 1,
            position: 'absolute',
          }}>
          <SearchResults onValueChange={searchValue} />
        </Animated.View>

        {searchBarFocused ? (
          <View style={{ marginTop: normalize(47.5) }} />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              opacity: searchBarFocused ? 0 : 1,
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={show}>
              <View style={styles.circleButton}>
                <FilterDark width={normalize(18)} height={normalize(18)} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('liked-posts')}>
              <View style={styles.circleButton}>
                <Like width={normalize(20)} height={normalize(20)} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  circleButton: {
    width: normalize(47),
    height: normalize(47),
    borderRadius: 52 / 2,
    backgroundColor: Colors.neutralsWhite,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SearchBarWithFilter
