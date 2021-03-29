import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Dimensions,
  RefreshControl,
  Text,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { UserContext } from '@/context/UserContext'

import { normalize, Colors, timePassedShort } from '@/globals'
import { AppText, ScreenHeaderTitle, MarginView } from '@/components'

import PostImage from '@/components/Post/post-image'
import Avatar from '@/components/Avatar/avatar'
import ChatSort from './components/ChatSort'

import { Icons, ChatEmpty, ChatBlue, BlueDot } from '@/assets/images/icons'
import Api from '@/services/Api'

const ChatHouse = () => {
  const navigation = useNavigation()
  const { userInfo } = useContext(UserContext)

  const [sort, setSort] = useState({
    label: 'All Messages',
    value: 'all',
    description: 'These are all your messages',
  })

  const [items, setItems] = useState({})
  const [lastId, setLastId] = useState(null)
  const [sortModal, setSortModal] = useState(false)

  const loadPosts = () => {
    setLastId(null)
    setItems({})

    switch (sort.value) {
      case 'all':
        return loadAllMessages()
      case 'own posts':
        return loadOwnPosts()
      default:
        return loadAllMessages()
    }
  }

  const loadAllMessages = async () => {
    try {
      const params = {}
      if (lastId) params.lastItemId = lastId

      const response = await Api.getAllMessages(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
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

      setLastId(response.data.slice(-1)[0]?.id)

      setItems(items => ({ ...items, ...newItems }))
    } catch (error) {
      console.error(error.message || 'error on getting all messages data')
    }
  }

  const loadOwnPosts = async () => {
    try {
      const params = {}
      if (lastId) params.lastItemId = lastId

      const response = await Api.getOwnPosts(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
          post_id: item.id,
          post: item,
          $isLoading: true,
        }))
        .reduce(
          (_items, item) => ({
            ..._items,
            [item.post_id]: item,
          }),
          {}
        )

      response.data.forEach(item => console.log(item.id))

      console.log(newItems)
      // setLastId(response.data.slice(-1)[0]?.id)

      // setItems(items => ({ ...items, ...newItems }))
    } catch (error) {
      console.error(error.message || 'error on getting own posts chat data')
    }
  }

  const getDeferredData = async item => {
    return await Promise.all([
      Api.getChatCounts({ pid: item.post_id }).then(response => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            chat_counts: response.data,
          },
        }))
      }),
      Api.getPost({ pid: item.post_id }).then(response => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            post: response.data,
          },
        }))
      }),
      Api.getLatestChat({ pid: item.post_id }).then(response => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            latest_chat: response.data,
          },
        }))
      }),
      (() => {
        //   const sellerId = Object.keys(chatRoom.members).filter(
        //     member => member !== userInfo.uid
        //   )[0]
        //   Api.getUser({ uid: sellerId }).then(response => {
        //     setChatRooms(chatRooms => ({
        //       ...chatRooms,
        //       [chatRoom.id]: {
        //         ...chatRooms[chatRoom.id],
        //         seller_info: response.data,
        //       },
        //     }))
        //   })
      })(),
    ])
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

  useEffect(() => {
    Object.values(items)
      .filter(item => !item.$promise)
      .forEach(item => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            $promise: getDeferredData(item),
          },
        }))
      })
  }, [items])

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    loadPosts()
  }, [sort])

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.postWrapper}
        onPress={() => {
          navigation.navigate('NBTScreen', {
            screen: 'PostChat',
            params: { post: item?.post },
          })
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
            <AppText textStyle="body3" customStyle={styles.username}>
              {item?.post?.title}
            </AppText>
            <AppText
              textStyle="captionConstant"
              color={Colors.contentPlaceholder}
              customStyle={styles.timeago}>
              {timePassedShort(
                Date.now() / 1000 - item?.chat_room?.latest_chat_time?._seconds
              )}
            </AppText>
          </View>
          <View style={styles.chatsWrapper}>{renderDetails(item)}</View>
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
            <AppText color={'#3781FC'}>
              {item?.chat_counts?.new_messages} New in{' '}
              {item?.chat_counts?.messages} chats
            </AppText>
          </>
        )
      } else {
        return (
          <>
            <ChatEmpty style={styles.chatIcon} />
            <AppText color={'#515057'}>
              {item?.chat_counts?.messages} chats
            </AppText>
          </>
        )
      }
    } else {
      return (
        <View style={styles.chatInfoWrapper}>
          <Text
            style={{
              color: '#515057',
              fontWeight: !item?.latest_chat?.read ? 'bold' : 'normal',
            }}>
            {item?.latest_chat?.uid === userInfo.uid
              ? 'You'
              : item?.seller_info?.full_name.split(' ')[0]}
            : {item?.latest_chat?.text}
          </Text>
          {!item?.latest_chat?.read && <BlueDot />}
        </View>
      )
    }
  }

  return (
    <SafeAreaView>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="All Chats"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <View style={styles.bodyWrapper}>
        <TouchableOpacity
          style={styles.sortWrapper}
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
          data={Object.values(items)}
          keyExtractor={item => item.post_id}
          renderItem={renderItem}
        />
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
    </SafeAreaView>
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
  bodyWrapper: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(245),
    marginTop: normalize(15),
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  sortText: {
    marginRight: normalize(8),
  },
  postWrapper: {
    flexDirection: 'row',
    marginBottom: normalize(20),
  },
  infoWrapper: {
    width: '75%',
  },
  imageWrapper: {
    marginRight: normalize(10),
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
  chatsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIcon: {
    marginRight: normalize(5),
  },
  chatTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  chatInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
})

export default ChatHouse
