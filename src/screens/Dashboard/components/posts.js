import { Colors, normalize } from '@/globals'
import PostCard from '@/screens/Post/components/post-card'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

/**
 * @param {object} param0
 * @param {() => void} param0.onPostPress
 * @param {() => void} param0.onUserPress
 * @param {() => void} param0.onLikePress
 * @param {() => void} param0.onEndReached
 * @param {boolean} param0.isLoadingMoreItems
 */
const Posts = ({
  posts,
  onPostPress,
  onUserPress,
  onLikePress,
  onEndReached,
  isLoadingMoreItems,
  currentLocation,
  ...props
}) => {
  const [scrolled, setScrolled] = useState(false)
  const handleOnEndReached = () => {
    if (!scrolled) return
    setScrolled(false)
    onEndReached?.()
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
    !!item.$isLoading ? null : (
      <PostCard
        containerStyle={styles.post}
        post={item}
        onUserPress={onUserPress}
        onPostPress={onPostPress}
        onLikePress={onLikePress}
      />
    )

  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      data={Object.values(posts)}
      renderItem={renderPost}
      keyExtractor={item => item.id}
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.25}
      onMomentumScrollBegin={() => setScrolled(true)}
      initialNumToRender={5}
      ListFooterComponent={renderFooter}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  post: {
    padding: normalize(16),
  },
})

export default Posts
