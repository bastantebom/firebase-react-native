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
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'

import { normalize, Colors, timePassedShort } from '@/globals'
import { AppText, ScreenHeaderTitle, MarginView } from '@/components'

import PostImage from '@/components/Post/post-image'
import Avatar from '@/components/Avatar/avatar'

import { Icons, ChatEmpty, ChatBlue, BlueDot } from '@/assets/images/icons'
import Api from '@/services/Api'

const ChatHouse = () => {
  const navigation = useNavigation()
  const { userInfo } = useContext(UserContext)

  const [chatRooms, setChatRooms] = useState({})
  const [lastId, setLastId] = useState(null)

  const loadPosts = async () => {
    try {
      const params = {}
      if (lastId) params.lastItemId = lastId

      const response = await Api.getAllMessages(params)

      if (!response.success) throw new Error(response.message)

      const newChatRooms = response.data
        .filter(chatRoom => !!chatRoom)
        .map(chatRoom => ({ ...chatRoom, $isLoading: true }))
        .reduce(
          (_chatRooms, chatRoom) => ({
            ..._chatRooms,
            [chatRoom.id]: chatRoom,
          }),
          {}
        )

      setLastId(response.data.slice(-1)[0]?.id)

      setChatRooms(chatRooms => ({ ...chatRooms, ...newChatRooms }))
    } catch (error) {
      console.error(error.message)
    }
  }

  const getDeferredData = async chatRoom => {
    await Promise.all([
      Api.getChatCounts({ pid: chatRoom.post_id }).then(response => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            chat_counts: response.data,
          },
        }))
      }),
      Api.getPost({ pid: chatRoom.post_id }).then(response => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            post: response.data,
          },
        }))
      }),
      Api.getLatestChat({ pid: chatRoom.post_id }).then(response => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            latest_chat: response.data,
          },
        }))
      }),
      (() => {
        const sellerId = Object.getOwnPropertyNames(chatRoom.members).filter(
          member => member !== userInfo.uid
        )[0]

        Api.getUser({ uid: sellerId }).then(response => {
          setChatRooms(chatRooms => ({
            ...chatRooms,
            [chatRoom.id]: {
              ...chatRooms[chatRoom.id],
              seller_info: response.data,
            },
          }))
        })
      })(),
    ])
      .then(() => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            $hasErrors: true,
          },
        }))
      })
  }

  useEffect(() => {
    Object.values(chatRooms)
      .filter(chatRoom => !chatRoom.$promise)
      .forEach(chatRoom => {
        setChatRooms(chatRooms => ({
          ...chatRooms,
          [chatRoom.id]: {
            ...chatRooms[chatRoom.id],
            $promise: getDeferredData(chatRoom),
          },
        }))
      })
  }, [chatRooms])

  useEffect(() => {
    loadPosts()
  }, [])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.postWrapper}>
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
                Date.now() / 1000 - item.latest_chat_time._seconds
              )}
            </AppText>
          </View>
          <View style={styles.chatsWrapper}>{renderDetails(item)}</View>
        </View>
      </View>
    )
  }

  const renderDetails = item => {
    if (item?.post?.uid === userInfo.uid)
      return (
        <>
          <ChatBlue style={styles.chatIcon} />
          <AppText color={'#3781FC'}>
            4 New in {item?.chat_counts?.messages} chats
          </AppText>
        </>
      )
    else
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

  return (
    <View>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="All Chats"
        paddingSize={3}
      />
      <View style={styles.bodyWrapper}>
        <TouchableOpacity style={styles.sortWrapper}>
          <AppText textStyle="body3" customStyle={styles.sortText}>
            All Messages
          </AppText>
          <Icons.ChevronDown
            style={{ color: 'black' }}
            width={normalize(24)}
            height={normalize(24)}
          />
        </TouchableOpacity>

        <FlatList
          data={Object.values(chatRooms)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
