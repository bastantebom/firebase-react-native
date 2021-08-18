import { FilterDark, Icons, LikeDark, SearchDark } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Searchbar } from 'react-native-paper'

const { width } = Dimensions.get('window')
const SEARCH_FULL_WIDTH = width - normalize(32) * 2
const SEARCH_SHRINK_WIDTH = width - 12 - normalize(143)
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const SearchToolbar = ({
  value,
  onValueChange,
  onFiltersPress,
  onFocus,
  onBackPress,
  setSearchType,
  searchType,
}) => {
  const navigation = useNavigation()
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [backPosition] = useState(new Animated.Value(16))
  const [backOpacity] = useState(
    new Animated.Value(searchType === 'user' ? 1 : 0)
  )
  const [inputWidth] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [inputPosition] = useState(new Animated.Value(34))
  const [buttonsOpacity] = useState(new Animated.Value(1))

  const [titleOpacity] = useState(new Animated.Value(0))
  const [titlePosition] = useState(new Animated.Value(45))

  const theme = {
    colors: { primary: Colors.contentOcean },
    fonts: { regular: '' },
  }

  const handleFocus = () => {
    if (isFocused) return
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(inputPosition, {
        toValue: 42,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backPosition, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start()
    setIsFocused(true)
    onFocus()
  }

  const handleBackPress = () => {
    if (searchType === 'user') {
      setSearchType('post')
      return
    }
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(inputPosition, {
        toValue: 8,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backPosition, {
        toValue: 16,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start()
    setIsFocused(false)
    onBackPress()
    inputRef.current.blur()
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: searchType === 'user' ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(titlePosition, {
        toValue: searchType === 'user' ? 0 : 45,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(inputWidth, {
        toValue:
          searchType === 'user'
            ? width - normalize(30)
            : isFocused
            ? SEARCH_FULL_WIDTH
            : SEARCH_SHRINK_WIDTH,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(inputPosition, {
        toValue: searchType === 'user' ? 8 : isFocused ? 42 : 8,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start()
  }, [searchType])

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: normalize(8),
        height: '100%',
      }}>
      <AnimatedTouchable
        activeOpacity={0.7}
        onPress={handleBackPress}
        style={[
          styles.cancelSearch,
          { transform: [{ translateX: backPosition }] },
        ]}>
        <Animated.View style={{ opacity: backOpacity }}>
          <Icons.Back
            width={normalize(24)}
            height={normalize(24)}
            style={{ color: Colors.icon }}
          />
        </Animated.View>
      </AnimatedTouchable>
      <View style={{ flex: 1 }}>
        {searchType === 'user' && (
          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <Animated.Text
              style={[
                styles.title,
                {
                  transform: [{ translateX: titlePosition }],
                  opacity: titleOpacity,
                },
              ]}>
              Search
            </Animated.Text>
          </Animated.View>
        )}

        <Animated.View
          style={{
            flexDirection: 'row',
            height: '100%',
            paddingVertical: normalize(8),
            transform: [{ translateX: inputPosition }],
            zIndex: isFocused ? 1000 : 2,
          }}>
          <Animated.View style={{ width: inputWidth, height: normalize(52) }}>
            <Searchbar
              ref={inputRef}
              placeholder={
                searchType === 'user'
                  ? 'Search a name or username'
                  : 'Search...'
              }
              onChangeText={onValueChange}
              onFocus={handleFocus}
              value={value}
              onIconPress={() => inputRef.current.focus()}
              fontFamily={'RoundedMplus1c-Regular'}
              theme={theme}
              placeholderTextColor={Colors.contentPlaceholder}
              inputStyle={{
                marginLeft: searchType === 'post' ? 0 : normalize(-30),
              }}
              icon={() =>
                searchType === 'post' ? (
                  <SearchDark width={normalize(20)} height={normalize(20)} />
                ) : null
              }
              style={[
                searchType === 'post' ? styles.search : styles.searchUser,
              ]}
            />
          </Animated.View>
        </Animated.View>

        {searchType === 'post' && (
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              opacity: buttonsOpacity,
              zIndex: 999,
              position: 'absolute',
              right: normalize(8),
              top: normalize(8),
            }}>
            <TouchableOpacity activeOpacity={0.7} onPress={onFiltersPress}>
              <View style={styles.circleButton}>
                <FilterDark width={normalize(20)} height={normalize(20)} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'profile',
                  params: {
                    screen: 'liked-posts',
                    params: { showNavigation: true },
                  },
                })
              }>
              <View style={styles.circleButton}>
                <LikeDark width={normalize(25)} height={normalize(25)} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  search: {
    marginTop: 0,
    elevation: 0,
    borderRadius: normalize(40),
    height: normalize(50),
    flex: 1,
    paddingLeft: normalize(5),
  },
  searchUser: {
    marginTop: 0,
    elevation: 0,
    height: normalize(50),
    flex: 1,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
  },
  circleButton: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: 52 / 2,
    backgroundColor: Colors.neutralsWhite,
    marginLeft: normalize(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelSearch: {
    justifyContent: 'center',
    padding: normalize(8),
    paddingHorizontal: normalize(12),
    marginVertical: normalize(10),
    position: 'absolute',
    top: normalize(4),
    zIndex: 1000,
  },
  title: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    marginTop: normalize(24),
    marginBottom: normalize(4),
  },
})

export default SearchToolbar
