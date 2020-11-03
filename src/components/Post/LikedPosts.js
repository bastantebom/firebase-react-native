import React, { useState, useContext, useEffect } from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'

import Post from '@/components/Post/Post'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { PostService } from '@/services'
import { AppText } from '@/components'
import PostOwnEmpty from '@/screens/Profile/components/Account/EmptyLikedPosts'
import LoadingScreen from './loading'

const LikedPosts = ({
  data,
  type,
  isLoading,
  setIsLoading,
  userID,
  toggleLikePost,
  toggleMenu,
}) => {
  const { user } = useContext(UserContext)
  const { setLikedPosts } = useContext(Context)
  const renderItem = ({ item }) => (
    <Post
      data={item}
      type={type}
      isLoading={isLoading}
      toggleLikePost={toggleLikePost}
      toggleMenu={toggleMenu}
    />
  )

  const [refresh, setRefresh] = useState(false)
  const [lastPID, setLastPID] = useState(0)
  const [fetchMore, setFecthMore] = useState(false)
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true)
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      refreshPosts()
    }

    return () => {
      isMounted = false
    }
  }, [])

  const refreshPosts = async () => {
    try {
      setLikedPosts([])
      setRefresh(true)
      setLastPID(0)

      const params = {
        uid: user.uid,
        limit: 5,
        page: 0,
      }

      const res = await PostService.getLikedPosts(params)
      setLastPID(1)
      setIsLoading(false)

      if (res.data.length > 0) {
        setLikedPosts(res.data)
      }

      setRefresh(false)
    } catch (err) {
      console.log(err.message)
    }
  }

  const getMorePost = async () => {
    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true)
      setFecthMore(true)

      if (!thereIsMoreFlag) {
        setFecthMore(false)
        return
      }

      let getPostsParams = {
        uid: user.uid,
        limit: 5,
        page: lastPID,
      }

      try {
        const res = await PostService.getLikedPost(getPostsParams)
        setLastPID(lastPID + 1)
        setLikedPosts(prev => [...prev, ...res.data])
        setFecthMore(false)
      } catch (error) {
        setThereIsMoreFlag(false)
        setFecthMore(false)
      }
    }
  }

  const onMomentumScrollBegin = () => setOnEndReachedCalledDuringMomentum(false)

  if (data.length > 0) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={refreshPosts}
        refreshing={refresh}
        onEndReached={getMorePost}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        ListFooterComponent={
          <View
            style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
            {fetchMore ? (
              <ActivityIndicator />
            ) : (
              <AppText>
                {lastPID === 'none' ? 'No more liked available' : ''}
              </AppText>
            )}
          </View>
        }
      />
    )
  }

  if (type === 'liked' && !data.length) {
    if (refresh) {
      return (
        <View>
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
        </View>
      )
    }
    return <PostOwnEmpty isLoading={isLoading} />
  }

  if (type !== 'liked') {
    if (refresh) {
      return <ActivityIndicator />
    }
    return (
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
        <AppText>No user posts</AppText>
      </View>
    )
  }
}

export default LikedPosts
