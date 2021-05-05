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
 * @param {object} props
 * @param {() => void} props.onPostPress
 * @param {() => void} props.onUserPress
 * @param {() => void} props.onLikePress
 * @param {() => void} props.onEndReached
 * @param {() => React.Component} props.renderFooter
 * @param {boolean} props.isLoading
 */
const Posts = ({
  posts,
  onPostPress,
  onUserPress,
  onLikePress,
  onEndReached,
  isLoading,
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
    return props.renderFooter ? (
      props.renderFooter()
    ) : isLoading ? (
      <View
        style={{
          alignItems: 'center',
          marginVertical: normalize(12),
        }}>
        <ActivityIndicator color={Colors.primaryYellow} />
      </View>
    ) : null
  }

  const renderPost = ({ item, index }) =>
    item.$isLoading ? null : props.renderPost ? (
      props.renderPost({ item, index })
    ) : (
      <PostCard
        containerStyle={styles.post}
        post={item}
        onUserPress={onUserPress}
        onPostPress={() => onPostPress(item)}
        onLikePress={onLikePress}
      />
    )

  return (
    <AnimatedFlatList
      contentContainerStyle={{ flexGrow: 1 }}
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
