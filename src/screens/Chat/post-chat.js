import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { UserContext } from '@/context/UserContext'
import { ScreenHeaderTitle } from '@/components'
import { normalize, Colors, timePassedShort } from '@/globals'
import utilStyles from '@/globals/util-styles'
import { BlueDot, Icons } from '@/assets/images/icons'

import Avatar from '@/components/Avatar/avatar'
import Api from '@/services/Api'
import typography from '@/globals/typography'

const PostChat = ({ route }) => {
  const post = route?.params?.post
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const [items, setItems] = useState({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastId = useRef(null)

  const getPostChats = async () => {
    try {
      const params = { pid: post.id }
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getPostChats(params)

      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
          id: item.id,
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
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }

    setIsRefreshing(false)
  }

  const getDeferredData = async item => {
    return await Promise.all([
      (() => {
        const buyerId = Object.keys(item.chat_room.members).filter(
          member => member !== userInfo.uid
        )[0]
        Api.getUser({ uid: buyerId }).then(response => {
          setItems(items => ({
            ...items,
            [item.id]: {
              ...items[item.id],
              buyer_info: response.data,
            },
          }))
        })
      })(),
      Api.getLatestPostChat({ chatId: item.id }).then(response => {
        setItems(items => ({
          ...items,
          [item.id]: {
            ...items[item.id],
            latest_chat: response.data,
          },
        }))
      }),
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
    lastId.current = null
    setItems({})

    getPostChats()
  }, [])

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

  const handleRefresh = () => {
    setIsRefreshing(true)
    setItems({})
    lastId.current = null

    getPostChats()
  }

  const handleLoadMore = () => {
    if (Object.values(items).length >= 10) getPostChats()
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chat', { user, channel: item.chat_room })
        }
        style={[
          styles.item,
          utilStyles.row,
          utilStyles.justifySpaceBetween,
          styles.itemWrapper,
        ]}>
        <View style={styles.avatar}>
          <Avatar
            path={item?.buyer_info?.profile_photo}
            size="64x64"
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.info}>
          <View style={[utilStyles.row, styles.name]}>
            <Text style={[typography.body2, styles.nameText]}>
              {item?.buyer_info?.full_name}
            </Text>
            <Text style={[typography.caption, styles.timeAgo]}>
              {timePassedShort(
                Date.now() / 1000 - item?.latest_chat?.created_at?._seconds
              )}
            </Text>
          </View>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Text
              style={[
                typography.caption,
                styles.latestChat,
                {
                  color: !item?.latest_chat?.read
                    ? Colors.contentEbony
                    : Colors.contentPlaceholder,
                  fontWeight:
                    !item?.latest_chat?.read &&
                    item?.latest_chat?.uid !== userInfo.uid
                      ? 'bold'
                      : 'normal',
                },
              ]}>
              {item?.latest_chat?.text}
            </Text>
            {!item?.latest_chat?.read && <BlueDot style={styles.blueDot} />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle
          title="Post Chats"
          paddingSize={3}
          close={() => navigation.goBack()}
        />

        <View style={[utilStyles.row, styles.postTitleWrapper]}>
          <Icons.PostChat style={styles.postTitleIcon} />
          <Text style={[typography.body2, styles.postTitle]}>{post.title}</Text>
        </View>

        <View style={styles.contentWrapper}>
          <FlatList
            data={Object.values(items)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
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
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  postTitleWrapper: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  postTitleIcon: {
    marginRight: normalize(10),
  },
  postTitle: {
    fontSize: normalize(14),
  },
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  itemWrapper: {
    marginBottom: normalize(20),
  },
  item: {
    height: normalize(58),
  },
  avatar: {
    width: '18%',
    borderRadius: normalize(100),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(100),
  },
  info: {
    paddingLeft: normalize(10),
    width: '82%',
  },
  timeAgo: {
    marginLeft: 'auto',
  },
  name: {
    marginBottom: normalize(3),
  },
  nameText: {
    paddingRight: normalize(40),
    color: Colors.contentEbony,
  },
  blueDot: {
    marginLeft: 'auto',
  },
  latestChat: {
    paddingRight: normalize(40),
  },
})

export default PostChat
