import React, { useState, useContext, useEffect, useCallback } from 'react'
import Modal from 'react-native-modal'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
} from 'react-native'

import { WhiteOpacity } from '@/components'
import Filters from './components/filters'

import { normalize } from '@/globals'
import { UserContext } from '@/context/UserContext'

import LocationSearch from './components/LocationSearch'

import AsyncStorage from '@react-native-community/async-storage'
import Api from '@/services/Api'
import Posts from './components/posts'

import { cloneDeep, debounce } from 'lodash'
import { getCurrentPosition, getLocationData } from '@/globals/Utils'
import VerifyNotification from './components/verify-account-notification'

import LinearGradient from 'react-native-linear-gradient'
import SearchToolbar from './components/search-toolbar'
import SearchResults from './components/search-results'

const SEARCH_TOOLBAR_HEIGHT = 70
const SEARCH_USER_TOOLBAR_HEIGHT = 120
const FILTER_TOOLBAR_HEIGHT = 65

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Dashboard'>} param0 */
const DashboardScreen = ({ navigation }) => {
  const { user, userInfo, userStatus } = useContext(UserContext)
  const [searchValue, setSearchValue] = useState('')
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [
    shouldShowVerifyNotification,
    setShouldShowVerifyNotification,
  ] = useState(false)
  const [
    isVerifyNotificationVisible,
    setIsVerifyNotificationVisible,
  ] = useState(false)

  const [filters, setFilters] = useState({
    sort: 'recent',
    type: [],
    page: 0,
    limit: 5,
  })

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  })

  const [searchBarFocused, setSearchBarFocused] = useState(false)
  const [totalPages, setTotalPages] = useState(Infinity)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(false)
  const [posts, setPosts] = useState({})

  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [searchType, setSearchType] = useState('post')

  const loadPosts = async filters => {
    setIsRefreshing(true)
    try {
      const params = filters

      const response = await Api.getPosts(params)
      if (!response.success) throw new Error(response.message)

      const newPosts = response.data
        .map(post => ({ ...post, $isLoading: true }))
        .reduce(
          (_posts, post) => ({
            ..._posts,
            [post.id]: post,
          }),
          {}
        )

      setTotalPages(response.total_pages)
      setPosts(posts => (!filters.page ? newPosts : { ...posts, ...newPosts }))
    } catch (error) {
      console.log(error)
    }

    setIsLoadingMoreItems(false)
    setIsRefreshing(false)
  }

  const handlePostPress = post => {
    const params = {
      data: post,
      viewing: true,
      created: false,
      edited: false,
    }
    if (user?.uid === post.uid)
      navigation.navigate('NBTScreen', {
        screen: 'OthersPost',
        params,
      })
    else
      navigation.navigate('NBTScreen', {
        screen: 'OthersPost',
        params: { ...params, othersView: true },
      })
  }

  const handleUserPress = _user => {
    if (user?.uid === _user.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: _user.uid },
      })
    }
  }

  const handleLikePress = async post => {
    const oldLikes = cloneDeep(post.likes)
    const newLikes = cloneDeep(post.likes)

    const liked = post.likes?.includes(user.uid)
    if (liked) newLikes.splice(newLikes.indexOf(user.uid), 1)
    else newLikes.push(user.uid)

    setPosts(posts => ({
      ...posts,
      [post.id]: {
        ...posts[post.id],
        likes: newLikes,
      },
    }))

    try {
      const response = await Api[liked ? 'unlikePost' : 'likePost']({
        pid: post.id,
      })

      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error.message || error)

      setPosts(posts => ({
        ...posts,
        [post.id]: {
          ...posts[post.id],
          likes: oldLikes,
        },
      }))
    }
  }

  const handleApplyFilters = newFilters =>
    setFilters(filters => ({ ...filters, ...newFilters, page: 0 }))

  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setFilters(filters => ({
      ...filters,
      page: 0,
    }))
  }

  const handleOnEndReached = () => {
    if (isLoadingMoreItems || isRefreshing) return

    setIsLoadingMoreItems(true)
    setFilters(filters => ({
      ...filters,
      page: filters.page >= totalPages ? filters.page : filters.page + 1,
    }))
  }

  const handleLocationChange = async ({ latitude, longitude, radius }) => {
    try {
      const addressData = await getLocationData({ latitude, longitude })
      const defaultAddressData = await getLocationData({
        longitude: 120.983207,
        latitude: 14.585322,
      })
      setLocationData(
        !radius
          ? { ...defaultAddressData, radius: 0 }
          : {
              ...addressData,
              radius,
            }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleLocationSearchPress = () => {
    const defaultAddress = userInfo.addresses?.find?.(
      address => address.default
    )

    const address = (() => {
      if (locationData?.latitude && locationData?.longitude)
        return {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          radius: locationData.radius,
        }
      else if (defaultAddress?.latitude && defaultAddress?.longitude)
        return {
          latitude: defaultAddress.latitude,
          longitude: defaultAddress.longitude,
        }
      return { longitude: 120.983207, latitude: 14.585322 }
    })()

    navigation.navigate('location-search-map', {
      address,
      onValueChange: handleLocationChange,
    })
  }

  const handleTypeFilterPress = type => {
    const newFilters = filters
    const index = filters.type.indexOf(type)
    if (~index) newFilters.type.splice(index, 1)
    else newFilters.type.push(type)

    setFilters(filters => ({ ...filters, ...newFilters, page: 0 }))
  }

  const handleSortFilterPress = sort => {
    setFilters(filters => ({ ...filters, sort, page: 0 }))
  }

  const getDeferredData = post => {
    return Promise.all([
      Api.getUser({ uid: post.uid }).then(response => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            user: response.data,
          },
        }))
      }),
      Api.getPostLikes({ pid: post.id }).then(response => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            likes: response.likes,
          },
        }))
      }),
    ])
      .then(() => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $hasErrors: true,
          },
        }))
      })
  }

  useEffect(() => {
    Object.values(posts)
      .filter(post => !post.$promise)
      .forEach(post => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $promise: getDeferredData(post),
          },
        }))
      })
  }, [posts])

  useEffect(() => {
    loadPosts(filters)
  }, [filters])

  useEffect(() => {
    const { latitude, longitude, radius } = locationData

    if (latitude === null || longitude === null || !radius) return
    setIsRefreshing(true)
    setFilters(filters => ({
      ...filters,
      lat: latitude,
      lon: longitude,
      radius,
    }))
  }, [locationData])

  useEffect(() => {
    AsyncStorage.getItem('hide-verify-notification').then(hidden => {
      setShouldShowVerifyNotification(hidden !== 'true')
    })
    ;(async () => {
      if (!locationData?.latitude || !locationData?.longitude) {
        const { latitude, longitude } = await getCurrentPosition()
        const addressData = await getLocationData({ latitude, longitude })
        setLocationData({
          ...addressData,
        })
      }
    })()
  }, [])

  useEffect(() => {
    if (!userStatus?.verified) return
    const isVerified = Object.values(userStatus?.verified).every(
      status => status === 'completed'
    )
    setIsVerifyNotificationVisible(
      !!user && !isVerified && shouldShowVerifyNotification
    )
  }, [userStatus, shouldShowVerifyNotification])

  const scrollY = new Animated.Value(0)

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )

  const diffClampNode = Animated.diffClamp(scrollY, 0, SEARCH_TOOLBAR_HEIGHT)
  const translateY = Animated.multiply(diffClampNode, -1)

  const getSearchToolbarHeight = () => {
    return searchType === 'user'
      ? SEARCH_USER_TOOLBAR_HEIGHT
      : SEARCH_TOOLBAR_HEIGHT
  }

  const handleSearch = useCallback(
    debounce(async (search, searchType) => {
      setNoResults(false)
      if (!search.length) return setSearchResults([])

      setIsSearching(true)
      try {
        const response = await Api[
          searchType === 'post' ? 'getPosts' : 'getUsers'
        ]({
          limit: 20,
          page: 0,
          search,
          sort: 'recent',
        })

        console.log(response.data)
        if (!response.success) throw new Error(response.message)
        if (!response.data.length) setNoResults(true)
        setSearchResults(response.data)
      } catch (error) {
        console.log(error)
      }
      setIsSearching(false)
    }, 200),
    []
  )

  const handleSearchResultPress = async data => {
    if (searchType === 'post') {
      const [user, likes] = await Promise.all([
        Api.getUser({ uid: data.uid }),
        Api.getPostLikes({ pid: data.id }),
      ])
      handlePostPress({ ...data, user: user.data, likes: likes.data })
    } else {
      handleUserPress(data)
    }
  }

  useEffect(() => {
    handleSearch(searchValue, searchType)
  }, [searchValue])

  useEffect(() => {
    setSearchResults([])
    handleSearch(searchValue, searchType)
  }, [searchType])

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {isVerifyNotificationVisible && (
          <VerifyNotification
            onPress={() => {
              navigation.navigate('NBTScreen', {
                screen: 'Verification',
              })
            }}
            onClose={() => {
              AsyncStorage.setItem('hide-verify-notification', 'true')
              setIsVerifyNotificationVisible(false)
            }}
          />
        )}

        <View style={styles.container}>
          <AnimatedLinearGradient
            colors={['#ECEFF8', '#F8F9FC']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: Animated.add(
                translateY,
                getSearchToolbarHeight() + FILTER_TOOLBAR_HEIGHT
              ),
              zIndex: 4,
            }}>
            <Animated.View
              style={{
                height: getSearchToolbarHeight(),
                transform: [{ translateY }],
                zIndex: 5,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <SearchToolbar
                value={searchValue}
                onValueChange={setSearchValue}
                onFocus={() => setSearchBarFocused(true)}
                onFiltersPress={() => setIsFiltersVisible(true)}
                onBackPress={() => setSearchBarFocused(false)}
                searchType={searchType}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setSearchType={setSearchType}
                setSearchResults={setSearchResults}
              />
            </Animated.View>
            <Animated.View
              style={{
                height: FILTER_TOOLBAR_HEIGHT,
                transform: [{ translateY }],
                paddingTop: 8,
              }}>
              <LocationSearch
                onValueChange={handleLocationChange}
                onTypeFilterPress={handleTypeFilterPress}
                onSortFilterPress={handleSortFilterPress}
                filters={filters}
                location={locationData}
                onLocationSearchPress={handleLocationSearchPress}
              />
            </Animated.View>
          </AnimatedLinearGradient>

          <View style={{ position: 'relative' }}>
            {searchBarFocused && (
              <SearchResults
                containerStyle={{
                  position: 'absolute',
                  top: getSearchToolbarHeight(),
                }}
                isLoading={isSearching}
                data={searchResults}
                noResults={noResults}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onResultPress={handleSearchResultPress}
                setSearchType={setSearchType}
                searchType={searchType}
                setSearchResults={setSearchResults}
              />
            )}

            <Posts
              currentLocation={locationData}
              posts={posts}
              onPostPress={handlePostPress}
              onUserPress={handleUserPress}
              onLikePress={handleLikePress}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              onEndReached={handleOnEndReached}
              isLoadingMoreItems={isLoadingMoreItems}
              contentContainerStyle={{
                paddingTop: getSearchToolbarHeight() + FILTER_TOOLBAR_HEIGHT,
              }}
              progressViewOffset={
                getSearchToolbarHeight() + FILTER_TOOLBAR_HEIGHT
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <WhiteOpacity />
      </SafeAreaView>
      <Modal
        isVisible={isFiltersVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={250}
        onSwipeComplete={() => setIsFiltersVisible(false)}
        swipeDirection="right"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setIsFiltersVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }
        onDrag>
        <Filters
          close={() => setIsFiltersVisible(false)}
          onApply={handleApplyFilters}
          filters={filters}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
})

export default DashboardScreen
