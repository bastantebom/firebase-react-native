import { Icons } from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React, { useContext, useEffect, useState } from 'react'
import {
  Platform,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import EmptyLikePost from '@/screens/Profile/components/Account/EmptyLikedPosts'
import Posts from '@/screens/Dashboard/components/posts'
import Api from '@/services/Api'
import PostCard from './components/post-card'
import Button from '@/components/Button'
import utilStyles from '@/globals/util-styles'
import { format } from 'date-fns'
import { Context } from '@/context'

/**
 * @typedef {Object} HiddenPostsScreenProps
 */

/**
 * @typedef {Object} RootProps
 * @property {HiddenPostsScreenProps} HiddenPostsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'HiddenPostsScreen'>} param0 */
const HiddenPostsScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext)
  const { setDashboardNeedsRefresh } = useContext(Context)

  const [posts, setPosts] = useState({})
  const [lastId, setLastId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [unhidingPosts, setUnhidingPosts] = useState([])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const params = { uid: user.uid, limit: 5 }
      if (lastId) params.lastId = lastId
      const response = await Api.getHiddenPosts(params)
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
        params: { id: post.id },
      },
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

  const handleRefresh = async () => {
    setLastId(null)
    setIsRefreshing(true)
    setPosts({})
    await loadPosts()
    setIsRefreshing(false)
  }

  const handleOnEndReached = () => {
    if (isLoading || !hasMorePosts) return
    loadPosts()
  }

  const handleOnUnhidePress = async item => {
    if (unhidingPosts.includes(item.id)) return
    setUnhidingPosts(ids => [...ids, item.id])

    try {
      const response = await Api.unhidePost({ pid: item.id })
      if (!response.success) throw new Error(response.message)

      setPosts(posts => {
        delete posts[item.id]
        if (!Object.entries(posts).length) setIsEmpty(true)
        return posts
      })
      setDashboardNeedsRefresh(true)
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setUnhidingPosts(ids => {
      ids.splice(ids.indexOf(item.id))
      return ids
    })
  }

  const getDeferredData = post => {
    return Api.getUser({ uid: post.uid })
      .then(response => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
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
      .catch(error => {
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
        No new buzz right now
      </Text>
    ) : isLoading ? (
      <View
        style={{
          alignItems: 'center',
          marginVertical: normalize(12),
        }}>
        <ActivityIndicator color={Colors.contentOcean} />
      </View>
    ) : isEmpty ? (
      <EmptyLikePost />
    ) : null
  }

  const renderPost = ({ item }) => (
    <View style={styles.postCardWrapper}>
      <View
        style={[
          utilStyles.row,
          utilStyles.justifySpaceBetween,
          utilStyles.alignCenter,
          { paddingHorizontal: normalize(16), paddingVertical: normalize(8) },
        ]}>
        <Text
          style={[
            typography.caption,
            { color: Colors.contentPlaceholder, flex: 1 },
          ]}>
          {!!item.date_posted && (
            <>
              {'Posted on '}
              {format(
                new Date(item.date_posted._seconds * 1000),
                'MMMM dd, yyyy'
              )}
            </>
          )}
        </Text>
        <Button
          onPress={() => handleOnUnhidePress(item)}
          size="small"
          style={styles.unhideButton}>
          {unhidingPosts.includes(item.id) ? (
            <ActivityIndicator size="small" color={Colors.contentEbony} />
          ) : (
            <Text style={[typography.medium, typography.caption]}>Unhide</Text>
          )}
        </Button>
      </View>
      <PostCard
        containerStyle={styles.post}
        post={item}
        onUserPress={handleUserPress}
        onPostPress={() => handlePostPress(item)}
      />
    </View>
  )

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
              Hidden Posts
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Posts
            posts={posts}
            isLoading={isLoading}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onUserPress={handleUserPress}
            onPostPress={handlePostPress}
            renderFooter={renderFooter}
            onEndReached={handleOnEndReached}
            renderPost={renderPost}
          />
        </View>
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
    backgroundColor: Colors.neutralsZircon,
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
  },
  post: {
    padding: normalize(16),
  },
  unhideButton: {
    borderWidth: normalize(1),
    borderRadius: normalize(4),
    borderColor: Colors.contentEbony,
    width: normalize(105),
    height: normalize(32),
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCardWrapper: {
    marginBottom: normalize(8),
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    paddingBottom: normalize(8),
  },
})

export default HiddenPostsScreen
