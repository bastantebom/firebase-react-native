import React, { useState, useContext, useEffect, useRef } from 'react'
import Modal from 'react-native-modal'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'

import { AppText, WhiteOpacity } from '@/components'
import { Notification } from '@/components/Notification'
import Filters from './components/filters'

import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import { UserContext } from '@/context/UserContext'

import SearchBarWithFilter from './components/SearchBarWithFilter'

import AsyncStorage from '@react-native-community/async-storage'
import Api from '@/services/Api'
import Posts from './components/posts'
import Geolocation from '@react-native-community/geolocation'
import { cloneDeep } from 'lodash'

/**
 * @param {object} param0
 * @param {() => void} param0.onPress
 * @param {() => void} param0.onClose
 */
const VerifyNotifictaion = ({ onPress, onClose }) => {
  return (
    <Notification
      icon={<Icons.VerifiedWhite />}
      onClose={onClose}
      type="primary"
      animationOptions={{ height: 110, delay: 2000 }}>
      <View
        style={{
          zIndex: 999,
          position: 'relative',
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-evenly',
            marginLeft: 15,
          }}>
          <TouchableOpacity onPress={onPress}>
            <AppText
              textStyle="body2"
              color={Colors.neutralsWhite}
              customStyle={{ marginBottom: 10 }}>
              Safeguard your account and boost your credibility within the
              community.
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" color={Colors.neutralsWhite}>
                Get bee-rified
              </AppText>
              <Icons.ChevronRight
                style={{ color: '#fff', marginLeft: normalize(4) }}
                width={normalize(24)}
                height={normalize(24)}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Notification>
  )
}

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Dashboard'>} param0 */
const DashboardScreen = ({ navigation }) => {
  const { user, userStatus } = useContext(UserContext)
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

  const [totalPages, setTotalPages] = useState(Infinity)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(false)
  const [posts, setPosts] = useState({})
  const listRef = useRef(null)

  const getCurrentPosition = async () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(({ coords }) => resolve(coords), reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      })
    })

  const loadPosts = async filters => {
    setIsRefreshing(true)
    try {
      // if (!!Object.keys(posts).length && !page && listRef?.current)
      //   listRef.current.scrollToIndex({ animated: false, index: 0 })

      const { sort } = filters

      const params = filters

      if (sort === 'nearest' && !params.lat && !params.lon) {
        const { latitude: lat, longitude: lon } = await getCurrentPosition()
        params.lat = lat
        params.lon = lon
      }

      console.log(params)
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
      navigation.navigate('Post', {
        screen: 'SinglePostView',
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
      navigation.navigate('Profile', {
        screen: 'Profile',
      })
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

  const handleLocationChange = ({ latitude, longitude, radius }) => {
    setFilters(filters => ({
      ...filters,
      lat: latitude,
      lon: longitude,
      radius,
    }))
  }

  const handleButtonFiltersChange = newFilters => {
    setFilters(filters => ({
      ...filters,
      ...newFilters,
    }))
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
    console.log({ filters })
    loadPosts(filters)
  }, [filters])

  useEffect(() => {
    AsyncStorage.getItem('hide-verify-notification').then(hidden => {
      setShouldShowVerifyNotification(hidden !== 'true')
    })
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

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {isVerifyNotificationVisible && (
          <VerifyNotifictaion
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
          <SearchBarWithFilter
            show={() => setIsFiltersVisible(true)}
            onLocationChange={handleLocationChange}
            filters={filters}
            onFiltersChange={handleButtonFiltersChange}
          />
          <Posts
            posts={posts}
            listRef={listRef}
            onPostPress={handlePostPress}
            onUserPress={handleUserPress}
            onLikePress={handleLikePress}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            onEndReached={handleOnEndReached}
            isLoadingMoreItems={isLoadingMoreItems}
          />
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
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
})

export default DashboardScreen
