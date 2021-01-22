import React, { useContext, useEffect, useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { ScreenHeaderTitle } from '@/components'
import Posts from './components/posts'
import { normalize } from '@/globals'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import EmptyLikePost from '@/screens/Profile/components/Account/EmptyLikedPosts'
import _ from 'lodash'

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
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadPosts = async () => {
    const response = await Api.getLikedPosts({ uid: user.uid })
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
    setPosts(newPosts)
  }

  const init = async () => {
    try {
      await loadPosts()
    } catch (error) {
      console.log(error)
    }

    setIsLoadingMoreItems(false)
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
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: _user.uid },
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadPosts()
    setIsRefreshing(false)
  }

  const getDeferredData = post => {
    return Promise.all([
      Api.getUser({ uid: post.uid }).then(response => {
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            likes: [user.uid],
            user: response.data,
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
    init()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: normalize(24) }}>
        <ScreenHeaderTitle title="Liked Posts" close={navigation.goBack} />
      </View>
      {!isLoadingMoreItems && _.isEmpty(posts) && <EmptyLikePost />}
      <Posts
        posts={posts}
        isLoadingMoreItems={isLoadingMoreItems}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onUserPress={handleUserPress}
        onPostPress={handlePostPress}
      />
    </SafeAreaView>
  )
}

export default LikedPostsScreen
