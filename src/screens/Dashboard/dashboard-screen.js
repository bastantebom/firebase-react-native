import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
} from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { debounce } from 'lodash'

import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import { getCurrentPosition, getLocationData } from '@/globals/Utils'
import NewsFeed from '@/screens/Dashboard/components/Newsfeed/index'
import SkeletonLoader from '@/screens/Dashboard/components/Newsfeed/skeleton-loader'
import EmptyState from './components/empty-state'
import VerifyNotification from './components/verify-account-notification'
import LocationSearch from './components/LocationSearch'
import SearchToolbar from './components/search-toolbar'
import SearchResults from './components/search-results'
import Filters from './components/filters'
import Api from '@/services/Api'
import { Context } from '@/context'
import Toast from '@/components/toast'

const SEARCH_TOOLBAR_HEIGHT = 70
const SEARCH_USER_TOOLBAR_HEIGHT = 120
const FILTER_TOOLBAR_HEIGHT = 65
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Dashboard'>} param0 */
const DashboardScreen = ({ navigation }) => {
  const { user, userInfo, verificationStatus } = useContext(UserContext)
  const { dashboardNeedsRefresh, setDashboardNeedsRefresh } = useContext(
    Context
  )
  const [filters, setFilters] = useState({
    sort: 'recent',
    type: [],
    page: 0,
    limit: 10,
  })
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  })
  const [shouldShowVerifyToast, setShouldShowVerifyToast] = useState(false)
  const [isVerifyToastVisible, setIsVerifyToastVisible] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [posts, setPosts] = useState([])
  const [totalPages, setTotalPages] = useState(Infinity)
  const [isRereshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [noMorePost, setNoMorePost] = useState(false)

  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState('post')
  const [searchResults, setSearchResults] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const loadPosts = async filters => {
    try {
      const params = filters
      const response = await Api.getPosts(params)

      response.data.forEach(post => (post.$likedLoader = true))

      if (!response.success) throw new Error(response.message)
      if (filters.page === 0) setIsInitialLoad(false)
      if (!response.data.length) setNoMorePost(true)

      setTotalPages(response.total_pages)
      setPosts(posts =>
        !filters.page ? response.data : [...posts, ...response.data]
      )
      setIsLoading(false)
      setIsRefreshing(false)
    } catch (error) {
      console.log(error)
      Toast.show({
        label: error.message || 'There was an error getting dashboard posts',
        type: 'error',
        timeout: 5000,
        dismissible: true,
        screenId: 'dashboard',
      })
    }
  }

  const handleOnEndReached = () => {
    if (isLoading || noMorePost) return

    setIsLoading(true)
    setFilters(filters => ({
      ...filters,
      page: filters.page >= totalPages ? filters.page : filters.page + 1,
    }))
  }

  useEffect(() => {
    ;(async () => {
      const newPosts = [...posts.filter(post => post.$likedLoader)]
      if (!!newPosts.length) {
        await Promise.all(
          newPosts.map(async post => {
            const { likes } = await Api.getPostLikes({ pid: post.id })
            post.likes = likes
            post.$likedLoader = false
          })
        )
        setPosts(
          !filters.page ? newPosts : [...new Set([...posts, ...newPosts])]
        )
      }
    })()
  }, [posts])

  useEffect(() => {
    loadPosts(filters)
  }, [filters])

  useEffect(() => {
    AsyncStorage.getItem('hide-verify-notification').then(hidden => {
      setShouldShowVerifyToast(hidden !== 'true')
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
    const { latitude, longitude, radius } = locationData

    if (latitude === null || longitude === null) return
    setIsRefreshing(true)
    setFilters(filters => ({
      ...filters,
      lat: latitude,
      lon: longitude,
      radius,
    }))
  }, [locationData])

  useEffect(() => {
    handleSearch(searchValue, searchType)
  }, [searchValue])

  useEffect(() => {
    setSearchResults([])
    handleSearch(searchValue, searchType)
  }, [searchType])

  useEffect(() => {
    const isVerified = Object.values(verificationStatus).every(status =>
      ['completed', 'submitted'].includes(status)
    )
    setIsVerifyToastVisible(!!user && !isVerified && shouldShowVerifyToast)
  }, [setIsVerifyToastVisible, verificationStatus, shouldShowVerifyToast])

  const handleOnFocus = () => {
    if (dashboardNeedsRefresh) {
      handleOnRefresh()
      setDashboardNeedsRefresh(false)
    }
  }

  useEffect(() => {
    navigation.addListener('focus', handleOnFocus)
    return () => {
      navigation.removeListener('focus', handleOnFocus)
    }
  }, [dashboardNeedsRefresh, navigation])

  const scrollY = new Animated.Value(0)
  const diffClampNode = Animated.diffClamp(scrollY, 0, SEARCH_TOOLBAR_HEIGHT)
  const translateY = Animated.multiply(diffClampNode, -1)

  const getSearchToolbarHeight = () => {
    return searchType === 'user'
      ? SEARCH_USER_TOOLBAR_HEIGHT
      : SEARCH_TOOLBAR_HEIGHT
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

  const handlePostPress = post => {
    navigation.navigate('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'published-post',
        params: {
          id: post.id,
          uid: post.uid,
        },
      },
    })
  }

  const handleUserPress = post => {
    if (user?.uid === post.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile',
          params: { uid: post.uid },
        },
      })
    }
  }

  const handleLikePress = async post => {
    const currentPosts = [...posts]
    let liked = false

    currentPosts.forEach(item => {
      if (item.id === post.id) {
        if (post.likes?.includes(user.uid)) {
          post.likes.splice(user.uid, 1)
          liked = true
        } else post.likes.push(user.uid)
      }
    })

    setPosts(currentPosts)

    try {
      const response = await Api[liked ? 'unlikePost' : 'likePost']({
        pid: post.id,
      })
      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error.message || error)
      setPosts(posts)
    }
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

  const handleApplyFilters = newFilters => {
    setFilters(filters => ({ ...filters, ...newFilters, page: 0 }))
  }

  const handleOnRefresh = () => {
    setNoMorePost(false)
    setIsRefreshing(true)
    setFilters({
      ...filters,
      page: 0,
    })
  }

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'dashboard')}
      />
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.safeArea}>
        {isVerifyToastVisible && (
          <VerifyNotification
            onPress={() => {
              navigation.navigate('NBTScreen', {
                screen: 'Verification',
              })
            }}
            onClose={() => {
              AsyncStorage.setItem('hide-verify-notification', 'true')
              setIsVerifyToastVisible(false)
            }}
          />
        )}

        <AnimatedLinearGradient
          colors={
            searchType === 'post'
              ? ['#ECEFF8', '#F8F9FC']
              : ['#FFFFFF', '#FFFFFF']
          }
          style={{
            position: 'absolute',
            top: isVerifyToastVisible && !searchBarFocused ? 110 : 0,
            left: 0,
            right: 0,
            height: Animated.add(
              translateY,
              getSearchToolbarHeight() +
                (searchBarFocused ? 0 : FILTER_TOOLBAR_HEIGHT)
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
          {!searchBarFocused && (
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
          )}
        </AnimatedLinearGradient>

        {searchBarFocused && (
          <SearchResults
            containerStyle={{
              position: 'absolute',
              top: getSearchToolbarHeight(),
              zIndex: 1000000,
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

        <View
          style={{
            marginTop: normalize([posts.length ? 130 : 0]),
            paddingBottom: normalize(isVerifyToastVisible ? 230 : 0),
          }}>
          <SkeletonLoader isLoading={isInitialLoad || isRereshing} />

          {posts.length && totalPages !== Infinity ? (
            <FlatList
              keyExtractor={item => item.id}
              data={posts}
              onEndReached={handleOnEndReached}
              ListFooterComponent={
                noMorePost ? (
                  <Text style={styles.noMorePost}>No new buzz right now.</Text>
                ) : (
                  <ActivityIndicator
                    animating={true}
                    size="small"
                    color={Colors.primaryYellow}
                  />
                )
              }
              refreshControl={
                <RefreshControl
                  progressViewOffset={20}
                  refreshing={isRereshing}
                  titleColor={Colors.primaryMidnightBlue}
                  tintColor={Colors.primaryYellow}
                  onRefresh={handleOnRefresh}
                />
              }
              renderItem={({ item }) => (
                <NewsFeed
                  props={{
                    Api,
                    item,
                    setPosts,
                    locationData,
                    handleLikePress,
                  }}
                />
              )}
            />
          ) : (
            <ScrollView
              scrollEventThrottle={400}
              refreshControl={
                <RefreshControl
                  progressViewOffset={150}
                  refreshing={isRereshing}
                  titleColor={Colors.primaryMidnightBlue}
                  tintColor={Colors.primaryYellow}
                  onRefresh={() => {
                    setNoMorePost(false)
                    setIsRefreshing(true)
                    setFilters({
                      ...filters,
                      page: 0,
                    })
                  }}
                />
              }>
              <EmptyState />
            </ScrollView>
          )}
        </View>
      </View>

      <Modal
        isVisible={isFiltersVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={250}
        onSwipeComplete={() => setIsFiltersVisible(false)}
        propagateSwipe={true}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setIsFiltersVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
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
  safeArea: {
    marginTop: getStatusBarHeight(),
  },
  noMorePost: {
    paddingVertical: normalize(20),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    textAlign: 'center',
    color: '#A8AAB7',
  },
  activeIndicator: {
    paddingVertical: normalize(20),
  },
})

export default DashboardScreen
