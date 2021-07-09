import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import Posts from '../Dashboard/components/posts'
import { Colors, normalize } from '@/globals'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import typography from '@/globals/typography'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { Images } from '@/assets/images'

/**
 * @typedef {Object} LikedPostsProps
 */

/**
 * @typedef {Object} RootProps
 * @property {LikedPostsProps} LikedPosts
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'LikedPosts'>} param0 */
const LikedPostsScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext)

  const [posts, setPosts] = useState({})
  const [lastId, setLastId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)

  const loadPosts = async (options = {}) => {
    setIsLoading(true)
    try {
      const params = { uid: user.uid, limit: 5 }
      if (options.lastId) params.lastId = lastId
      const response = await Api.getLikedPosts(params)
      if (!response.success) throw new Error(response.message)

      const newPosts = response.data
        .filter(post => !!post)
        .map(post => ({ ...post, $isLoading: true }))
        .reduce(
          (_posts, post) => ({
            ..._posts,
            [post.id]: post,
          }),
          {}
        )

      setIsEmpty(!lastId && !response.data.length)
      setHasMorePosts(!(lastId && !response.data.length))
      setLastId(response.data.slice(-1)[0]?.id)
      setPosts(posts => ({ ...posts, ...newPosts }))
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
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

  const handleUserPress = _user => {
    if (user?.uid === _user.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile',
          params: { uid: _user.uid },
        },
      })
    }
  }

  const handleRefresh = async () => {
    setLastId(null)
    setIsRefreshing(true)
    setPosts({})
    await loadPosts({ lastId: null })
    setIsRefreshing(false)
  }

  const handleOnEndReached = () => {
    if (isLoading || !hasMorePosts) return
    loadPosts({ lastId })
  }

  const getDeferredData = post => {
    return Api.getUser({ uid: post.uid })
      .then(response => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            likes: [user.uid],
            user: response.data,
          },
        }))
      })
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

  const renderFooter = () => {
    return !hasMorePosts ? (
      <Text
        style={[
          typography.caption,
          typography.textCenter,
          {
            color: Colors.neutralsMischka,
            flex: 1,
            paddingVertical: normalize(16),
          },
        ]}>
        No more posts
      </Text>
    ) : isLoading ? (
      <View
        style={{
          alignItems: 'center',
          marginVertical: normalize(12),
        }}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={Colors.primaryYellow}
        />
      </View>
    ) : isEmpty ? (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: normalize(24),
        }}>
        <Images.NoPosts {...iconSize(140)} />
        <Text
          style={[
            typography.subtitle1,
            typography.medium,
            { marginTop: normalize(16) },
          ]}>
          You have no liked posts yet
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { color: Colors.contentPlaceholder, marginTop: normalize(8) },
          ]}>
          Browse through and discover nearby services and products.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('dashboard')}
          activeOpacity={0.7}>
          <Text
            style={[
              typography.body2,
              typography.medium,
              typography.link,
              { marginTop: normalize(16) },
            ]}>
            Explore Postings
          </Text>
        </TouchableOpacity>
      </View>
    ) : null
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
    loadPosts()
  }, [])

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
            <Text style={[typography.body2, typography.medium]}>
              Liked Posts
            </Text>
          </View>
        </View>
        <Posts
          posts={posts}
          isLoading={isLoading}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onUserPress={handleUserPress}
          onPostPress={handlePostPress}
          renderFooter={renderFooter}
          onEndReached={handleOnEndReached}
          ListFooterComponentStyle={{
            flex: 1,
            justifyContent: 'center',
            marginBottom: normalize(128),
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  titleWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: normalize(16),
    position: 'absolute',
    width: '100%',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default LikedPostsScreen
