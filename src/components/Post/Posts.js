import React, { useState, useContext, useEffect } from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'

import Post from '@/components/Post/Post'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { PostService } from '@/services'
import { AppText } from '@/components'
import LoadingScreen from './loading'
import { normalize } from '@/globals'

const Posts = ({ data, type, isLoading, setIsLoading, headerComponent }) => {
  const { setPosts, posts, locationFilter, setLocationFilter } = useContext(
    Context
  )
  const renderItem = ({ item }) => (
    <Post data={item} type={type} isLoading={isLoading} />
  )

  const [refresh, setRefresh] = useState(false)
  const [lastPID, setLastPID] = useState(0)
  const [fetchMore, setFecthMore] = useState(true)
  const limit = 5
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true)

  useEffect(() => {
    setLastPID(0)
    refreshPosts()
  }, [locationFilter])

  const refreshPosts = async () => {
    try {
      setRefresh(true)

      if (locationFilter) {
        const params = {
          city: locationFilter,
          limit: limit,
          page: 0,
        }

        const res = await PostService.getPostsLocation(params)

        if (
          res.message ===
          'You have reached the end of the post, no more available posts'
        ) {
          setPosts([])
          setFecthMore(false)
          setRefresh(false)
          setIsLoading(false)
          return
        }

        if (res.data && res.data?.length > 0) {
          setPosts(res.data)
        }

        setLastPID(1)
      } else {
        const params = {
          limit: limit,
          page: 0,
        }

        const res = await PostService.getPosts(params)
        if (res.data && res.data.length > 0) {
          setPosts(res.data)
        }

        setLastPID(1)
      }

      setRefresh(false)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const onMomentumScrollBegin = () => setOnEndReachedCalledDuringMomentum(true)

  const getMorePost = async () => {
    try {
      if (onEndReachedCalledDuringMomentum) {
        setOnEndReachedCalledDuringMomentum(false)

        if (locationFilter) {
          if (lastPID !== 0) {
            const params = {
              city: locationFilter,
              limit: limit,
              page: lastPID,
            }

            const res = await PostService.getPostsLocation(params)
            if (!res.length) {
              setFecthMore(false)
              setIsLoading(false)
              return
            }

            if (res.data && res.data.length > 0) {
              setPosts(prev => [...prev, ...res.data])
            }

            setLastPID(lastPID + 1)
          } else {
            setIsLoading(false)
            setFecthMore(false)
          }
        } else {
          const params = {
            limit: limit,
            page: lastPID,
          }
          const res = await PostService.getPosts(params)
          if (!res.length || type === 'liked' || type === 'archived') {
            setFecthMore(false)
            setIsLoading(false)

            return
          }

          if (res.data && res.data.length > 0) {
            setPosts(prev => [...prev, ...posts])
          }

          setLastPID(lastPID + 1)
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (data.length > 0) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={refreshPosts}
        refreshing={refresh}
        onEndReached={() => getMorePost()}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        ListFooterComponent={
          <View
            style={{
              alignItems: 'center',
              marginTop: 8,
              marginBottom: normalize(160),
            }}>
            {fetchMore ? (
              <ActivityIndicator />
            ) : (
              <AppText>{'Oops, you’ve run out of posts.'}</AppText>
            )}
          </View>
        }
      />
    )
  }

  if (type !== 'own') {
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
    return (
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
        <AppText>No posts in your area.</AppText>
      </View>
    )
  }
}

export default Posts
