import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useLayoutEffect,
} from 'react'
import { FlatList, View, ActivityIndicator, Animated } from 'react-native'

import Post from '@/components/Post/Post'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { PostService } from '@/services'
import { AppText } from '@/components'
import PostOwnEmpty from '@/screens/Profile/Tabs/Post'
import LoadingScreen from './loading'
import { normalize } from '@/globals'

const Posts = ({ data, type, scrollValue, setRef }) => {
  // const Posts = forwardRef((props, ref) => {
  const { user, userInfo } = useContext(UserContext)
  const {
    setPosts,
    posts,
    locationFilter,
    setLocationFilter,
    setFilters,
    filters,
    isLoading,
    refresh,
    setRefresh,
    setIsLoading,
  } = useContext(Context)

  const renderItem = ({ item }) => (
    <Post data={item} type={type} isLoading={isLoading} />
  )

  const [lastPID, setLastPID] = useState(0)
  const [fetchMore, setFecthMore] = useState(true)
  const limit = 5

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true)

  const initialLocation = userInfo?.address?.city ? userInfo?.address?.city : ''

  useEffect(() => {
    if (locationFilter) {
      setRefresh(true)
      setFilters({
        ...filters,
        city: locationFilter,
      })
    } else {
      setRefresh(true)
      setFilters({
        ...filters,
        city: undefined,
      })
    }
  }, [locationFilter])

  const refreshPosts = async () => {
    setFilters({
      ...filters,
      page: 0,
    })
  }

  const getMorePost = () => {
    if (onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(false)
      setFilters({
        ...filters,
        page: filters.page + 1,
      })
    }
  }

  if (data.length > 0) {
    return (
      <FlatList
        scrollEventThrottle={16}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={refreshPosts}
        refreshing={refresh}
        onEndReached={() => getMorePost()}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(true)}
        initialNumToRender={5}
        ListFooterComponent={
          <View
            style={{
              alignItems: 'center',
              marginTop: 8,
              marginBottom: normalize(150),
            }}>
            {fetchMore ? (
              <ActivityIndicator />
            ) : (
              <AppText textStyle="body2">
                Oops, you’ve run out of posts.
              </AppText>
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
      <View
        style={{
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 24,
          height: '100%',
        }}>
        <AppText textStyle="body2">No posts in your area.</AppText>
      </View>
    )
  }
}

export default Posts
