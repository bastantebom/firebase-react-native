import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react'
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
import { HeaderBackGray, Search } from '@/assets/images/icons'
import { AppText } from '@/components'
import { Context } from '@/context'
import { debounce } from 'lodash'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - (PADDING + normalize(20)) * 2
const SEARCH_SHRINK_WIDTH = width - PADDING - normalize(125)
const FULL_WIDTH = width - PADDING * 2

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
  const [barOpacity] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const [titleOpacity] = useState(new Animated.Value(0))
  const [titlePosition] = useState(new Animated.Value(45))
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
    setValue('')
    onValueChange('')
    setIsFocused(false)
    onBlur(event)

    setSearchType('posts')
  }

  const backToPostSearch = () => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(titlePosition, {
          toValue: 45,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(barOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start()

      onValueChange('')
      setValue('')
      inputRef.current.clear()
      inputRef.current.blur()
      setSearchType('posts')
    }, 250)
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

  useEffect(() => {
    if (searchType !== 'posts') {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(titlePosition, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(inputLength, {
            toValue: FULL_WIDTH,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(barPosition, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
        ]).start()
      }, 250)
    }
  }, [searchType])

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: inputLength,
          position: 'absolute',
          zIndex: 1,
          top: searchType === 'posts' ? 0 : normalize(50),
          opacity: searchType !== 'posts' ? barOpacity : 1,
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

      {searchType === 'posts' ? (
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
      ) : (
        <View style={styles.modalHeader}>
          <AnimatedTouchable
            style={[
              styles.cancelSearch,
              { left: 0, transform: [{ translateX: cancelPosition }] },
            ]}
            onPress={() => backToPostSearch()}>
            <Animated.View style={{ opacity }}>
              <HeaderBackGray width={normalize(24)} height={normalize(24)} />
            </Animated.View>
          </AnimatedTouchable>
          <AnimatedTouchable style={{ left: titlePosition }} disabled>
            <Animated.View style={{ opacity: titleOpacity }}>
              <AppText textStyle="body3">Search User</AppText>
            </Animated.View>
          </AnimatedTouchable>
        </View>
      )}
    </View>
  )
}

export default SearchBox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 5,
  },
  cancelSearch: {
    position: 'absolute',
    marginHorizontal: 16,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalHeader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 13,
    width: '100%',
    top: 0,
  },
  input: {
    paddingHorizontal: 0,
  },
  search: {
    marginTop: normalize(0),
    elevation: 0,
    borderRadius: 40,
    height: normalize(50),
  },
})
