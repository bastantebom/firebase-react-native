import { Icons } from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import Modal from 'react-native-modal'
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
  TouchableWithoutFeedback,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Posts from '@/screens/Dashboard/components/posts'
import Api from '@/services/Api'
import PostCard from './components/post-card'
import Button from '@/components/Button'
import utilStyles from '@/globals/util-styles'
import { format } from 'date-fns'
import { Context } from '@/context'
import ConfirmModal from './modals/confirm'
import Drawer from './modals/drawer'
import { Images } from '@/assets/images'

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
  const [confirmModalCallback, setConfirmModalCallback] = useState(() => {})
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [drawerContent, setDrawerContent] = useState(null)

  const loadPosts = async (options = {}) => {
    setIsLoading(true)
    try {
      const params = { uid: user.uid, limit: 5 }
      const { lastId } = options
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
    setHasMorePosts(true)
    await loadPosts()
    setIsRefreshing(false)
  }

  const handleOnEndReached = () => {
    if (isLoading || !hasMorePosts) return
    loadPosts({ lastId })
  }

  const handleOnUnhidePress = item => {
    if (unhidingPosts.includes(item.id)) return
    setConfirmModalCallback(() => async () => {
      setUnhidingPosts(ids => [...ids, item.id])
      setConfirmModalVisible(false)
      try {
        const response = await Api.unhidePost({ pid: item.id })
        if (!response.success) throw new Error(response.message)

        setPosts(posts => {
          delete posts[item.id]
          if (!Object.entries(posts).length) setIsEmpty(true)
          return posts
        })
        setDashboardNeedsRefresh(true)
        setStatusModalVisible(true)
        setDrawerContent(
          <ResponseStatus
            status="success"
            close={() => setStatusModalVisible(false)}
          />
        )
      } catch (error) {
        console.log(error.message)
        setStatusModalVisible(true)
        setDrawerContent(
          <ResponseStatus
            status="error"
            close={() => setStatusModalVisible(false)}
          />
        )
      }
      setUnhidingPosts(ids => {
        ids.splice(ids.indexOf(item.id))
        return ids
      })
    })
    setConfirmModalVisible(true)
  }

  const renderConfirmModal = () => {
    return (
      <Modal
        isVisible={confirmModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.drawer}
        onSwipeComplete={() => setConfirmModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setConfirmModalVisible(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setConfirmModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmModal
          onConfirm={confirmModalCallback}
          close={() => setConfirmModalVisible(false)}
          message="Show this post on your profile and feed again. "
          title="Unhide post?"
        />
      </Modal>
    )
  }

  const renderStatusModal = () => {
    return (
      <Modal
        isVisible={statusModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.drawer}
        onSwipeComplete={() => setStatusModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setStatusModalVisible(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setStatusModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <Drawer>{drawerContent}</Drawer>
      </Modal>
    )
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
        <ActivityIndicator color={Colors.primaryYellow} />
      </View>
    ) : isEmpty ? (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: normalize(24),
        }}>
        <Images.NoPostJar {...iconSize(140)} />
        <Text
          style={[
            typography.subtitle1,
            typography.medium,
            { marginTop: normalize(16) },
          ]}>
          No hidden posts yet
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { color: Colors.contentPlaceholder, marginTop: normalize(8) },
          ]}>
          You can easily view all the posts that you’ve hidden here once
          available.
        </Text>
      </View>
    ) : null
  }

  const renderPost = ({ item, index }) => {
    return (
      <View
        style={[
          styles.postCardWrapper,
          index === Object.keys(posts).length - 1 ? { paddingBottom: 0 } : {},
        ]}>
        <View
          style={[
            utilStyles.row,
            utilStyles.justifySpaceBetween,
            utilStyles.alignCenter,
            styles.postCardHeader,
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
              <ActivityIndicator size="small" color={Colors.primaryYellow} />
            ) : (
              <Text style={[typography.medium, typography.caption]}>
                Unhide
              </Text>
            )}
          </Button>
        </View>
        <PostCard
          containerStyle={[
            styles.post,
            index === Object.keys(posts).length - 1
              ? { borderBottomEndRadius: 0, borderBottomStartRadius: 0 }
              : {},
          ]}
          post={item}
          onUserPress={handleUserPress}
          onPostPress={() => handlePostPress(item)}
        />
      </View>
    )
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
              Hidden Posts
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Posts
            style={{ flex: 1 }}
            posts={posts}
            isLoading={isLoading}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onUserPress={handleUserPress}
            onPostPress={handlePostPress}
            renderFooter={renderFooter}
            onEndReached={handleOnEndReached}
            renderPost={renderPost}
            ListFooterComponentStyle={{
              flex: 1,
              justifyContent: 'center',
              marginBottom: normalize(128),
            }}
          />
        </View>
      </View>
      {renderConfirmModal()}
      {renderStatusModal()}
    </>
  )
}

const ResponseStatus = ({ status, close }) => (
  <View
    style={{
      padding: normalize(24),
      alignItems: 'center',
    }}>
    {status === 'success' ? (
      <Images.Success {...iconSize(80)} />
    ) : (
      <Images.Error {...iconSize(80)} />
    )}
    <Text
      style={[
        typography.display6,
        typography.medium,
        { color: Colors.primaryMidnightBlue, marginTop: normalize(8) },
      ]}>
      {status === 'success' ? 'Success' : 'Uh-oh'}
    </Text>
    <Text
      style={[
        typography.body2,
        typography.textCenter,
        { marginTop: normalize(4) },
      ]}>
      {status === 'success'
        ? 'Post has been unhidden and is now visible to you.'
        : 'An error occurred. Please try again.'}
    </Text>
    <Button
      style={{ width: '100%', marginTop: normalize(16) }}
      label="Okay"
      onPress={close}
      type="primary"
    />
  </View>
)

const styles = StyleSheet.create({
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  wrapper: {
    // backgroundColor: Colors.neutralsZircon,
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
  },
  post: {
    padding: normalize(16),
    backgroundColor: '#fff',
    borderBottomEndRadius: normalize(8),
    borderBottomStartRadius: normalize(8),
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
    paddingBottom: normalize(8),
    backgroundColor: Colors.neutralsZircon,
  },
  drawer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  postCardHeader: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    backgroundColor: '#fff',
    borderTopEndRadius: normalize(8),
    borderTopStartRadius: normalize(8),
  },
})

export default HiddenPostsScreen
