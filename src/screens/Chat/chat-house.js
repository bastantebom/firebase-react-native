import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Dimensions,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import PostService from '@/services/Post/PostService'
import Modal from 'react-native-modal'
import _ from 'lodash'

import { normalize, Colors, GlobalStyle, timePassedShort } from '@/globals'
import {
  AppText,
  ScreenHeaderTitle,
  CacheableImage,
  TransitionIndicator,
} from '@/components'
import {
  BlueDot,
  ChatBlue,
  ChevronDown,
  Search,
  ChatEmpty,
} from '@/assets/images/icons'

import ChatSort from './components/ChatSort'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

const ChatHouse = () => {
  const navigation = useNavigation()

  const [chatSort, setChatSort] = useState(false)
  const [sortCategory, setSortCategory] = useState({
    label: 'All Messages',
    value: 'all',
    description: 'These are all your messages',
  })

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const { user } = useContext(UserContext)

  const [postChats, setPostChats] = useState([])
  const [messageList, setMessageList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const initOwnOrders = async () => {
    const ownOrdersResponse = await Api.getOwnOrders({ uid: user?.uid })
    if (ownOrdersResponse.success) {
      const ownOrderData = await Promise.all(
        ownOrdersResponse.data.map(async order => {
          const getPostResponse = await Api.getPost({
            pid: order.post_id,
          })
          const getUserReponse = await Api.getUser({
            uid: order?.seller_id || user?.uid,
          })

          if (!getPostResponse.success || !getUserReponse.success) {
            return
          }

          if (getPostResponse.success) {
            const {
              full_name,
              display_name,
              profile_photo,
            } = getUserReponse.data

            return {
              profilePhoto: profile_photo,
              name: display_name ? display_name : full_name,
              cardType: 'own',
              status: order.status,
              time: order.date._seconds,
              orderID: order.id,
              price: order.total_price,
              postData: getPostResponse.data,
            }
          }
        })
      )

      const filtered = ownOrderData.filter(el => el)
      setPostChats(postChats => [...postChats, ...filtered])
      return
    }
  }

  const initSellerOrders = async () => {
    const getOwnPostResponse = await PostService.getUserPosts({
      uid: user?.uid,
    })
    if (getOwnPostResponse.success) {
      const sellerOrderData = await Promise.all(
        getOwnPostResponse.data.map(async post => {
          const roomsSnapshot = await firestore()
            .collection('chat_rooms')
            .where('post_id', '==', post.id)
            .get()

          let chatsList = await Promise.all(
            roomsSnapshot.docs.map(async room => {
              const chatRef = await firestore()
                .collection('chat_rooms')
                .doc(room.id)
                .collection('messages')
                .where('uid', '!=', user?.uid)
                .get()

              return chatRef.docs.map(chatDoc => {
                return chatDoc.data()
              })
            })
          )

          chatsList = _.flatten(chatsList)
          let latestTimeStampOrder = post.date_posted._seconds
          if (chatsList.length)
            latestTimeStampOrder = await getLatest(chatsList)

          return {
            cardType: 'seller',
            time: latestTimeStampOrder,
            cover_photos: post.cover_photos,
            chats: chatsList,
            postData: post,
          }
        })
      )
      const filtered = sellerOrderData.filter(el => el)
      setPostChats(postChats => [...postChats, ...filtered])
      return
    }
  }

  const callAllPosts = async () => {
    await Promise.all([initOwnOrders(), initSellerOrders()])
    setIsLoading(false)
  }

  const getLatest = async chats => {
    const timeStampList = []
    chats.map(chat => {
      timeStampList.push(chat.created_at._seconds)
    })
    return Math.max(...timeStampList)
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setIsLoading(true)
      callAllPosts()
    }
    return () => (isMounted = false)
  }, [])

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 16,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    setIsSearchFocused(true)
  }

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    setIsSearchFocused(false)
  }

  const handleSearchPress = () => {
    if (!isSearchFocused) {
      onFocus()
    } else {
      onBlur()
    }
  }

  const getSortSelected = choice => {
    setSortCategory(choice)
  }

  const CoverPhoto = ({ post }) => {
    return post?.cover_photos?.length > 0 ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{ uri: post?.cover_photos[0] }}
      />
    ) : post?.postData.type === 'service' ? (
      <DefaultService width={normalize(64)} height={normalize(72)} />
    ) : post?.postData.type === 'need' ? (
      <DefaultNeed width={normalize(64)} height={normalize(72)} />
    ) : (
      <DefaultSell width={normalize(64)} height={normalize(72)} />
    )
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  return (
    <SafeAreaView style={styles.parent}>
      <TransitionIndicator loading={isLoading} />
      <ScreenHeaderTitle
        title="All Chats"
        iconSize={normalize(16)}
        paddingSize={3}
        close={() => navigation.goBack()}
        withOptions
        openOptions={() => {}}
      />
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.sort} onPress={() => setChatSort(true)}>
          <AppText
            textStyle="body3"
            customStyle={{ marginRight: normalize(8) }}>
            {sortCategory.label}
          </AppText>
          <ChevronDown width={normalize(20)} height={normalize(20)} />
        </TouchableOpacity>
        <Animated.View style={[styles.search, { width: inputLength }]}>
          <TextInput
            onBlur={onBlur}
            onFocus={onFocus}
            style={{
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(14),
              paddingRight: normalize(25),
            }}
          />
          <TouchableOpacity
            style={[styles.searchIcon]}
            onPress={handleSearchPress}>
            <Search width={normalize(20)} height={normalize(20)} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: normalize(16),
          paddingBottom: normalize(25),
        }}>
        {postChats
          .filter(post =>
            sortCategory.value === 'all'
              ? post
              : post.cardType === sortCategory.value
          )
          .map((post, i) => {
            return (
              <View key={i} style={{ marginBottom: normalize(15) }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('NBTScreen', {
                      screen: 'PostChat',
                      params: { post },
                    })
                  }
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.postImageContainer}>
                    <CoverPhoto post={post} />
                  </View>
                  <View
                    style={{
                      paddingLeft: normalize(8),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '85%',
                      }}>
                      <AppText
                        textStyle="body2medium"
                        customStyle={{
                          paddingRight: 15,
                          width: '90%',
                          marginBottom: normalize(4),
                        }}
                        numberOfLines={1}>
                        {post?.postData?.title}
                      </AppText>
                      <AppText
                        textStyle="metadata"
                        color={Colors.contentPlaceholder}>
                        {timeAgo(Date.now() / 1000 - post.time)}
                      </AppText>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      {post?.chats?.length ? <ChatBlue /> : <ChatEmpty />}
                      <AppText
                        textStyle="caption"
                        customStyle={{ marginLeft: normalize(4) }}
                        color={
                          post?.chats?.length
                            ? Colors.contentOcean
                            : Colors.contentPlaceholder
                        }>
                        {post?.chats?.length
                          ? `${
                              post.chats.filter(chat => !chat.read).length
                            } New in ${post.chats.length} ${
                              post.chats.length > 1 ? `chats` : `chat`
                            }`
                          : `No messages yet`}
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
      </ScrollView>
      <Modal
        isVisible={chatSort}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setChatSort(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChatSort close={() => setChatSort(false)} choice={getSortSelected} />
      </Modal>
    </SafeAreaView>
  )
}

export default ChatHouse

const styles = StyleSheet.create({
  parent: { flex: 1, backgroundColor: 'white' },
  chatHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalize(15),
  },
  icon: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: 8,
    marginRight: normalize(15),
  },
  search: {
    height: normalize(45),
    paddingHorizontal: normalize(16),
    position: 'absolute',
    right: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    backgroundColor: 'white',
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 999,
    top: 13,
    right: 12,
  },
  postImageContainer: {
    width: normalize(64),
    height: normalize(72),
    borderRadius: 8,
    overflow: 'hidden',
  },
})
