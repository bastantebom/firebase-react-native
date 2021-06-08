import React, { useEffect, useState, useContext, useRef } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Text,
  Alert,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { UserContext } from '@/context/UserContext'

import { normalize, Colors, timePassedShort } from '@/globals'
import utilStyles from '@/globals/util-styles'
import { AppText, ScreenHeaderTitle } from '@/components'

import PostImage from '@/components/Post/post-image'
import Avatar from '@/components/Avatar/avatar'
import ChatSort from './components/sort-modal'

import { Icons, ChatEmpty, ChatBlue, BlueDot } from '@/assets/images/icons'
import Api from '@/services/Api'
import typography from '@/globals/typography'
import pluralize from 'pluralize'

const ChatHouse = () => {
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const [sort, setSort] = useState({
    label: 'All Chats',
    value: 'all',
    description:
      'Replies to posts and orders, new messages, and all your chat history in one inbox.',
  })

  const [items, setItems] = useState({})
  const [sortModal, setSortModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastId = useRef(null)

  const loadPosts = async () => {
    if (sort.value === 'all') {
      await loadAllMessages()
    } else if (sort.value === 'own posts') {
      await loadOwnPosts()
    } else if (sort.value === 'orders') {
      await loadOwnOrders()
    }

    setIsRefreshing(false)
  }

  const loadAllMessages = async () => {
    try {
      const params = {}
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getAllMessages(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .sort(
          (a, b) => a.latest_chat_time._seconds - b.latest_chat_time._seconds
        )
        .map(item => ({
          id: item.id,
          post_id: item.post_id,
          chat_room: item,
          $isLoading: true,
        }))
        .reduce(
          (_items, item) => ({
            ..._items,
            [item.post_id]: item,
          }),
          {}
        )

      lastId.current = response.data.slice(-1)[0]?.id
      setItems(items => ({ ...items, ...newItems }))
    } catch (error) {
      console.log(error.message || 'error on getting all messages data')
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadOwnPosts = async () => {
    try {
      const params = {}
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getPostsChat(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
          id: item.id,
          post_id: item.post_id,
          chat_room: item,
          $isLoading: true,
        }))
        .reduce(
          (_items, item) => ({
            ..._items,
            [item.post_id]: item,
          }),
          {}
        )

      lastId.current = response.data.slice(-1)[0]?.id
      setItems(items => ({ ...items, ...newItems }))
    } catch (error) {
      console.log(error.message || 'error on getting own posts chat data')
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadOwnOrders = async () => {
    try {
      const params = {}
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getOrdersChat(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
          id: item.id,
          post_id: item.post_id,
          chat_room: item,
          $isLoading: true,
        }))
        .reduce(
          (_items, item) => ({
            ..._items,
            [item.id]: item,
          }),
          {}
        )

      lastId.current = response.data.slice(-1)[0]?.id
      setItems(items => ({ ...items, ...newItems }))
    } catch (error) {
      console.log(error.message || 'error on getting own posts chat data')
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const getDeferredAllMessagesData = async item => {
    const promises = []

    if (!item.chat_counts)
      promises.push(
        Api.getChatCounts({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              chat_counts: response.data,
            },
          }))
        })
      )

    if (!item.post)
      promises.push(
        Api.getPost({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              post: response.data,
            },
          }))
        })
      )

    if (!item.latest_chat)
      promises.push(
        Api.getLatestPostChat({ chatId: item.id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              latest_chat: response.data,
            },
          }))
        })
      )

    if (!item.seller_info && sort.value !== 'own posts') {
      promises.push(
        Api.getUser({ uid: item.chat_room.seller_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              seller_info: response.data,
            },
          }))
        })
      )
    }

    return await Promise.all(promises)
      .then(() => {
        setItems(items => ({
          ...items,
          [item.post_id]: {
            ...items[item.post_id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setItems(items => ({
          ...items,
          [item.post_id]: {
            ...items[item.post_id],
            $hasErrors: true,
          },
        }))
      })
  }

  const getDeferredOrdersData = async item => {
    const promises = []

    if (!item.chat_counts)
      promises.push(
        Api.getChatCounts({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              chat_counts: response.data,
            },
          }))
        })
      )

    if (!item.post)
      promises.push(
        Api.getPost({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              post: response.data,
            },
          }))
        })
      )

    if (!item.latest_chat)
      promises.push(
        Api.getLatestPostChat({ chatId: item.id }).then(response => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              latest_chat: response.data,
            },
          }))
        })
      )

    if (!item.seller_info && sort.value !== 'own posts') {
      const sellerId = Object.keys(item.chat_room.members).filter(
        member => member !== userInfo.uid
      )[0]

      promises.push(
        Api.getUser({ uid: sellerId }).then(response => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              seller_info: response.data,
            },
          }))
        })
      )
    }

    return await Promise.all(promises)
      .then(() => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            $hasErrors: true,
          },
        }))
      })
  }

  const getDeferredPostData = async item => {
    const promises = []

    if (!item.chat_counts)
      promises.push(
        Api.getChatCounts({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              chat_counts: response.data,
            },
          }))
        })
      )

    if (!item.post)
      promises.push(
        Api.getPost({ pid: item.post_id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              post: response.data,
            },
          }))
        })
      )

    if (!item.latest_chat)
      promises.push(
        Api.getLatestPostChat({ chatId: item.id }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              latest_chat: response.data,
            },
          }))
        })
      )

    if (!item.seller_info && sort.value !== 'own posts') {
      const sellerId = Object.keys(item.chat_room.members).filter(
        member => member !== userInfo.uid
      )[0]

      promises.push(
        Api.getUser({ uid: sellerId }).then(response => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              seller_info: response.data,
            },
          }))
        })
      )
    }

    return await Promise.all(promises)
      .then(() => {
        setItems(items => ({
          ...items,
          [item.post_id]: {
            ...items[item.post_id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setItems(items => ({
          ...items,
          [item.post_id]: {
            ...items[item.post_id],
            $hasErrors: true,
          },
        }))
      })
  }

  useEffect(() => {
    if (sort.value === 'all') {
      Object.values(items)
        .filter(item => !item.$promise)
        .forEach(item => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              $promise: getDeferredAllMessagesData(item),
            },
          }))
        })
    } else if (sort.value === 'orders') {
      Object.values(items)
        .filter(item => !item.$promise)
        .forEach(item => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              $promise: getDeferredOrdersData(item),
            },
          }))
        })
    } else if (sort.value === 'own posts') {
      Object.values(items)
        .filter(item => !item.$promise)
        .forEach(item => {
          setItems(items => ({
            ...items,
            [item.post_id]: {
              ...items[item.post_id],
              $promise: getDeferredPostData(item),
            },
          }))
        })
    }
  }, [items])

  useEffect(() => {
    lastId.current = null
    setItems({})

    loadPosts()
  }, [sort])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setItems({})
    lastId.current = null

    loadPosts()
  }

  const handleLoadMore = () => {
    if (Object.values(items).length >= 10) loadPosts()
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          utilStyles.row,
          utilStyles.justifySpaceBetween,
          styles.postWrapper,
        ]}
        onPress={() => {
          if (item.post.uid === userInfo.uid) {
            navigation.navigate('NBTScreen', {
              screen: 'PostChat',
              params: { post: item.post },
            })
          } else {
            navigation.navigate('Chat', { user, channel: item.chat_room })
          }
        }}>
        <View style={styles.imageWrapper}>
          <View style={styles.postImageContainer}>
            <PostImage
              style={styles.postImage}
              path={item?.post?.cover_photos[0]}
              size="64x64"
              postType={item?.post?.type}
            />
          </View>
          {item?.post?.uid !== userInfo.uid && (
            <View style={styles.avatar}>
              <Avatar
                style={{ height: '100%', width: '100%' }}
                path={item?.seller_info?.profile_photo}
                size="64x64"
              />
            </View>
          )}
        </View>
        <View style={styles.infoWrapper}>
          <View style={styles.chatTitle}>
            <Text style={[typography.body2, styles.username]}>
              {item?.post?.title}
            </Text>
            <AppText
              textStyle="captionConstant"
              color={Colors.contentPlaceholder}
              customStyle={styles.timeago}>
              {timePassedShort(
                Date.now() / 1000 - item?.latest_chat?.created_at?._seconds
              )}
            </AppText>
          </View>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            {renderDetails(item)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderDetails = item => {
    if (item?.post?.uid === userInfo.uid) {
      if (!!item?.chat_counts?.new_messages) {
        return (
          <>
            <ChatBlue style={styles.chatIcon} />
            <Text style={[typography.body2, { color: '#3781FC' }]}>
              {item?.chat_counts?.new_messages} New in{' '}
              {item?.chat_counts?.messages}{' '}
              {pluralize('chat', item?.chat_counts?.messages)}
            </Text>
          </>
        )
      } else {
        return (
          <>
            <ChatEmpty style={styles.chatIcon} />
            <Text style={[typography.caption, { color: '#515057' }]}>
              {`${item?.chat_counts?.messages || 0} `}
              {pluralize('chat', item?.chat_counts?.messages)}
            </Text>
          </>
        )
      }
    } else {
      return (
        <>
          <Text
            numberOfLines={2}
            style={[
              typography.caption,
              styles.recentChat,
              {
                fontWeight:
                  !item?.latest_chat?.read &&
                  item?.latest_chat?.uid !== userInfo.uid
                    ? 'bold'
                    : 'normal',
              },
            ]}>
            {item?.latest_chat?.uid === userInfo.uid
              ? 'You'
              : item?.seller_info?.full_name.split(' ')[0]}
            : {item?.latest_chat?.text}
          </Text>
          {!item?.latest_chat?.read &&
            item?.latest_chat?.uid !== userInfo.uid && (
              <BlueDot style={{ marginLeft: 'auto' }} />
            )}
        </>
      )
    }
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          title="All Chats"
          iconSize={normalize(24)}
          paddingSize={3}
        />
        <View style={styles.bodyWrapper}>
          <TouchableOpacity
            style={[styles.sortWrapper, utilStyles.row, utilStyles.alignCenter]}
            onPress={() => setSortModal(true)}>
            <AppText textStyle="body3" customStyle={styles.sortText}>
              {sort.label}
            </AppText>
            <Icons.ChevronDown
              style={{ color: 'black' }}
              width={normalize(24)}
              height={normalize(24)}
            />
          </TouchableOpacity>

          <FlatList
            data={Object.values(items).sort(
              (a, b) =>
                b.chat_room.latest_chat_time._seconds -
                a.chat_room.latest_chat_time._seconds
            )}
            keyExtractor={item => item.post_id}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                progressViewOffset={20}
                refreshing={isRefreshing}
                titleColor={Colors.primaryMidnightBlue}
                tintColor={Colors.primaryYellow}
                onRefresh={handleRefresh}
              />
            }
          />
        </View>
      </View>

      <Modal
        isVisible={sortModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        swipeDirection="down"
        propagateSwipe
        statusBarTranslucent={true}
        onBackButtonPress={() => setSortModal(false)}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setSortModal(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
        }>
        <ChatSort close={() => setSortModal(false)} choice={setSort} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  bodyWrapper: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(120),
    marginTop: normalize(15),
  },
  sortWrapper: {
    marginBottom: normalize(30),
  },
  sortText: {
    marginRight: normalize(8),
  },
  postWrapper: {
    marginBottom: normalize(20),
  },
  infoWrapper: {
    width: '75%',
  },
  imageWrapper: {
    width: '22%',
    height: normalize(72),
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  postImageContainer: {
    overflow: 'hidden',
  },
  username: {
    fontSize: normalize(14),
  },
  timeago: {
    fontSize: normalize(12),
  },
  chatIcon: {
    marginRight: normalize(5),
  },
  chatTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  avatar: {
    position: 'absolute',
    bottom: normalize(-10),
    right: normalize(-10),

    height: normalize(30),
    width: normalize(30),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,

    borderRadius: normalize(100),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  recentChat: {
    paddingRight: normalize(50),
    color: '#515057',
  },
})

export default ChatHouse
