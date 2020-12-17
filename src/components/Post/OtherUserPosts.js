import React, { useState, useEffect, useContext } from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'

import Post from '@/components/Post/Post'
import { Context } from '@/context'
import { PostService } from '@/services'
import { AppText } from '@/components'
import PostOwnEmpty from '@/screens/Profile/Tabs/Post'
import LoadingScreen from './loading'

const UserPosts = ({
  data,
  type,
  isLoading,
  setIsLoading,
  userID,
  isFetching,
  userInfo,
}) => {
  const { setOtherUserPosts } = useContext(Context)
  const renderItem = ({ item }) => (
    <Post data={item} type={type} isLoading={isLoading} />
  )

  const [refresh, setRefresh] = useState(false)
  const [lastPID, setLastPID] = useState(0)

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
      setOtherUserPosts([])
      setRefresh(true)
      setLastPID(0)

      const params = {
        uid: userID,
        limit: 5,
        page: 0,
      }

      const res = await PostService.getUserPosts(params)
      setLastPID(1)
      setIsLoading(false)

      if (res.data.length > 0) {
        setOtherUserPosts(res.data)
      }

      setRefresh(false)
    } catch (err) {
      console.log(err)
    }
  }

  const onMomentumScrollBegin = () => setOnEndReachedCalledDuringMomentum(false)

  if (data.length > 0) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.post_id}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
        ListFooterComponent={
          <View
            style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
            {isFetching ? <ActivityIndicator /> : <AppText></AppText>}
          </View>
        }
      />
    )
  }

  if (type === 'own' && data.length == 0) {
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
    return <PostOwnEmpty isLoading={isLoading} userInfo={userInfo} />
  }

  if (type !== 'own') {
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

export default UserPosts
