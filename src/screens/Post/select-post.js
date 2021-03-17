import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  UIManager,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import PostCard from './components/post-card'
import PostCardSkeleton from './components/post-card-skeleton'
import { getStatusBarHeight } from 'react-native-status-bar-height'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} SelectPostScreenProps
 * @property {function} onBackPress
 * @property {function} onSelect
 */

/**
 * @typedef {object} RootProps
 * @property {SelectPostScreenProps} SelectPostScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'SelectPostScreen'>} param0 */
const SelectPostScreen = ({ navigation, route }) => {
  const { onBackPress, onSelect } = route.params
  const { user } = useContext(UserContext)

  const [posts, setPosts] = useState({})
  const [filters, setFilters] = useState({
    limit: 5,
    uid: user.uid,
    page: 0,
  })
  const [totalPages, setTotalPages] = useState(Infinity)
  const [hasMorePost, setHasMorePost] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const backPressHandler = event => {
    if (onBackPress && navigation.isFocused()) {
      event.preventDefault()
      navigation.removeListener('beforeRemove', backPressHandler)
      onBackPress()
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  const loadPosts = async () => {
    try {
      const response = await Api.getUserPosts(filters)
      if (!response.success) throw new Error(response.message)

      const newPosts = {}
      for (const post of response.data) {
        newPosts[post.id] = post
      }

      if (!response.data.length) setHasMorePost(false)
      setTotalPages(response.total_pages)

      setPosts(posts => ({ ...posts, ...newPosts }))
      setIsLoading(false)
      setIsRefreshing(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleOnEndReached = () => {
    if (isLoading || !hasMorePost) return
    setIsLoading(true)

    setFilters(filters => ({
      ...filters,
      page: filters.page >= totalPages ? filters.page : filters.page + 1,
    }))
  }

  const handleOnRefresh = () => {
    setHasMorePost(true)
    setIsRefreshing(true)
    setIsLoading(true)
    setPosts({})
    setFilters(filters => ({
      ...filters,
      page: 0,
    }))
  }

  useEffect(() => {
    loadPosts()
  }, [filters])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Select a post to send</Text>
          </View>
        </View>
        <View style={styles.content}>
          {!Object.values(posts).length && isLoading ? (
            <>
              {[...Array(10).keys()].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </>
          ) : (
            <FlatList
              data={Object.values(posts)}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <PostCard
                  containerStyle={[
                    {
                      padding: normalize(16),
                      borderTopWidth: normalize(1),
                      borderTopColor: Colors.neutralsZirconLight,
                    },
                    !index
                      ? {
                          paddingTop: 0,
                          borderTopWidth: 0,
                        }
                      : {},
                  ]}
                  post={item}
                  onCardPress={() => onSelect(item)}
                />
              )}
              initialNumToRender={5}
              scrollEventThrottle={16}
              onEndReached={handleOnEndReached}
              refreshControl={
                <RefreshControl
                  progressViewOffset={20}
                  refreshing={isRefreshing}
                  titleColor={Colors.secondaryRoyalBlue}
                  tintColor={Colors.secondaryRoyalBlue}
                  title="Reloading"
                  onRefresh={handleOnRefresh}
                />
              }
              ListFooterComponent={
                !hasMorePost ? null : (
                  <View style={{ padding: normalize(16) }}>
                    <ActivityIndicator
                      color={Colors.secondaryRoyalBlue}
                      style={styles.activeIndicator}
                    />
                  </View>
                )
              }
            />
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight()
  },
  header: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  content: {
    flex: 1,
  },
})

export default SelectPostScreen
