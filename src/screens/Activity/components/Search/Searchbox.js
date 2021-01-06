import React, { useRef, useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { Searchbar } from 'react-native-paper'
import { Colors, normalize } from '@/globals'
import AppColor from '@/globals/Colors'
import { HeaderBackGray } from '@/assets/images/icons'
import { Context } from '@/context'
import { debounce } from 'lodash'

const { width } = Dimensions.get('window')
const PADDING = normalize(16)
const SEARCH_FULL_WIDTH = width - (PADDING + normalize(20)) * 2
const SEARCH_SHRINK_WIDTH = width - PADDING - normalize(70)

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const SearchBox = ({ onFocus, onBlur, onBackPress, onValueChange }) => {
  const {
    searchType,
    setSearchType,
    handleSearch,
    handleSearchUser,
  } = useContext(Context)

  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [barPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = event => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: -16,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(barPosition, {
        toValue: 45,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    setIsFocused(true)
    onFocus(event)
  }

  const handleBlur = event => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(barPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    inputRef.current.clear()
    inputRef.current.blur()
    setValue('')
    onValueChange('')
    setIsFocused(false)
    onBlur(event)
  }

  const debouncedHandler = debounce(value => {
    onValueChange(value)
  }, 1000)

  const handleChange = value => {
    setValue(value)
    debouncedHandler(value)
    searchType === 'posts' ? handleSearch(value) : handleSearchUser(value)
  }

  const searchBarTheme = {
    colors: { primary: AppColor.contentOcean },
    fonts: { regular: '' },
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: inputLength,
          position: 'absolute',
          left: 0,
          transform: [{ translateX: barPosition }],
        }}>
        <Searchbar
          placeholder="Search..."
          onChangeText={handleChange}
          value={value}
          onIconPress={() => inputRef.current.focus()}
          fontFamily={'RoundedMplus1c-Regular'}
          theme={searchBarTheme}
          inputStyle={styles.input}
          style={[
            styles.search,
            {
              borderColor: Colors[isFocused ? 'contentOcean' : 'neutralGray'],
            },
          ]}
          ref={inputRef}
          onFocus={handleFocus}
        />
      </Animated.View>
      <AnimatedTouchable
        style={[
          styles.cancelSearch,
          { left: 0, transform: [{ translateX: cancelPosition }] },
        ]}
        onPress={() => {
          handleBlur(), onBackPress()
        }}>
        <Animated.View style={{ opacity }}>
          <HeaderBackGray width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      </AnimatedTouchable>
    </View>
  )
}

export default SearchBox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 5,
  },
  cancelSearch: {
    position: 'absolute',
    marginHorizontal: 16,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    paddingHorizontal: 0,
  },
  search: {
    marginTop: normalize(0),
    elevation: 0,
    borderRadius: 40,
    height: normalize(50),
    borderWidth: 1,
    borderColor: Colors.neutralsGainsboro,
  },
})
