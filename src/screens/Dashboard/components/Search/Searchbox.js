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
import _ from 'lodash'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - (PADDING + normalize(20)) * 2
const SEARCH_SHRINK_WIDTH = width - PADDING - normalize(125)
const FULL_WIDTH = width - PADDING * 2

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const SearchBox = ({
  onSearchFocus,
  onBackPress,
  valueHandler,
  customStyle,
  props,
}) => {
  const {
    searchType,
    setSearchType,
    results,
    setResults,
    page,
    setPage,
    handleSearch,
    handleSearchUser,
  } = useContext(Context)

  const searchbarRef = useRef(null)
  const [value, setValue] = useState()
  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [barPosition] = useState(new Animated.Value(0))
  const [barPositionFull] = useState(new Animated.Value(75))
  const [barOpacity] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const [titleOpacity] = useState(new Animated.Value(0))
  const [titlePosition] = useState(new Animated.Value(45))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: -16,
        duration: 400,
        useNativeDriver: false,
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
    setSearchBarFocused(true)
    onSearchFocus()
  }

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
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
    valueHandler()
    searchbarRef.current.clear()
    searchbarRef.current.blur()
    setSearchType('posts')
    setSearchBarFocused(false)
  }

  const debounceHandler = useCallback(
    debounce(value => {
      valueHandler(value)
    }, 2000),
    []
  )

  const handleValue = value => {
    debounceHandler(value)
  }

  const backToPostSearch = () => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(titlePosition, {
          toValue: 45,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(barOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
      valueHandler()
      searchbarRef.current.clear()
      searchbarRef.current.blur()
      setSearchType('posts')
    }, 500)
  }

  useEffect(() => {
    if (searchType !== 'posts') {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(titlePosition, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start()
      }, 500)
    }
  }, [searchType])

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: searchType === 'posts' ? inputLength : FULL_WIDTH,
          position: 'absolute',
          zIndex: 1,
          left: searchType === 'posts' ? barPosition : 0,
          top: searchType === 'posts' ? 0 : normalize(50),
          opacity: searchType !== 'posts' ? barOpacity : 1,
        }}>
        <Searchbar
          placeholder="Search..."
          onChangeText={value => {
            setValue(value)
            handleValue(value)
            searchType === 'posts'
              ? handleSearch(value)
              : handleSearchUser(value)
          }}
          value={value}
          onIconPress={onFocus}
          fontFamily={'RoundedMplus1c-Regular'}
          theme={{
            colors: {
              primary: AppColor.contentOcean,
            },
            fonts: {
              regular: '',
            },
          }}
          inputStyle={{ paddingLeft: 0, paddingRight: 0 }}
          style={{
            marginTop: normalize(0),
            borderColor: searchBarFocused
              ? Colors.contentOcean
              : Colors.neutralGray,
            elevation: 0,
            borderRadius: 40,
            height: normalize(50),
          }}
          ref={searchbarRef}
          onFocus={onFocus}
          {...props}
        />
      </Animated.View>
      {searchType === 'posts' ? (
        <AnimatedTouchable
          style={[styles.cancelSearch, { left: cancelPosition }]}
          onPress={() => {
            onBlur(), onBackPress()
          }}>
          <Animated.View style={{ opacity: opacity }}>
            <HeaderBackGray width={normalize(25)} height={normalize(25)} />
          </Animated.View>
        </AnimatedTouchable>
      ) : (
        <View style={styles.modalHeader}>
          <AnimatedTouchable
            style={[styles.cancelSearch, { left: cancelPosition }]}
            onPress={() => backToPostSearch()}>
            <Animated.View style={{ opacity: opacity }}>
              <HeaderBackGray width={normalize(25)} height={normalize(25)} />
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
})
