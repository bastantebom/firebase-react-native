import { Colors, normalize } from '@/globals'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import Post from './post'

/**
 * @param {object} param0
 * @param {import('react').Ref<FlatList>} param0.listRef
 * @param {() => void} param0.onRefresh
 * @param {boolean} param0.refreshing
 * @param {() => void} param0.onPostPress
 * @param {() => void} param0.onUserPress
 * @param {() => void} param0.onLikePress
 * @param {() => void} param0.onEndReached
 * @param {boolean} param0.isLoadingMoreItems
 */
const Posts = ({
  posts,
  listRef,
  onRefresh,
  refreshing,
  onPostPress,
  onUserPress,
  onLikePress,
  onEndReached,
  isLoadingMoreItems,
}) => {
  const [scrolled, setScrolled] = useState(false)
  const handleOnEndReached = () => {
    if (!scrolled) return
    setScrolled(false)
    onEndReached()
  }

  const renderFooter = () => {
    return isLoadingMoreItems ? (
      <View
        style={{
          alignItems: 'center',
          marginVertical: normalize(12),
        }}>
        <ActivityIndicator color={Colors.contentOcean} />
      </View>
    ) : null
  }

  const renderPost = ({ item }) =>
    !item.$hasErrors ? (
      <Post
        data={item}
        isLoading={!!item.$isLoading}
        onPress={onPostPress}
        onUserPress={onUserPress}
        onLikePress={onLikePress}
      />
    ) : null

  return (
    <FlatList
      ref={listRef}
      scrollEventThrottle={16}
      data={Object.values(posts)}
      renderItem={renderPost}
      keyExtractor={item => item.id}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.25}
      onMomentumScrollBegin={() => setScrolled(true)}
      initialNumToRender={5}
      ListFooterComponent={renderFooter}
    />
  )
}

export default Posts
