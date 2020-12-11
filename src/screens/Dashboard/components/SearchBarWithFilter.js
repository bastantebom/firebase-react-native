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
import { useNavigation } from '@react-navigation/native'

const SearchBarWithFilter = ({
  onFiltersPress,
  value,
  onValueChange,
  onFocus,
  onBlur,
  onBackPress,
}) => {
  const navigation = useNavigation()

  const { searchType, setPage } = useContext(Context)

  const [opacity] = useState(new Animated.Value(0))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const handleValueChange = value => {
    onValueChange(value)
  }

  const handleFocus = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 10,
        useNativeDriver: true,
      }),
    ]).start()
    onFocus?.()
    setSearchBarFocused(true)
  }

  const handleBlur = () => {
    onBlur?.()
    setSearchBarFocused(false)
  }

  const handleBackPress = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }),
    ]).start()
    onBackPress()
    Keyboard.dismiss()
    setPage(0)
  }

  return (
    <View style={{ margin: 16, marginBottom: 0 }}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View
          style={{
            flex: 1,
            height: searchType !== 'posts' ? normalize(100) : '100%',
          }}>
          <SearchBox
            onFocus={handleFocus}
            onBlur={handleBlur}
            onBackPress={handleBackPress}
            onValueChange={handleValueChange}
            value={value}
          />
        </View>

        {searchBarFocused ? (
          <View style={{ marginTop: normalize(47.5) }} />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              opacity: searchBarFocused ? 0 : 1,
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={onFiltersPress}>
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
