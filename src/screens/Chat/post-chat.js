import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Modal from 'react-native-modal'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { normalize, Colors, GlobalStyle } from '@/globals'
import {
  AppCheckbox,
  AppText,
  ScreenHeaderTitle,
  TransitionIndicator,
  CacheableImage,
} from '@/components'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'
import {
  BlueDot,
  PostParcelBlue,
  Search,
  TrashWhite,
  HorizontalWhiteEllipsis,
  ProfileImageDefault,
} from '@/assets/images/icons'
import ChatOptions from './components/ChatOptions'
import MultiChatOptions from './components/MultiChatOptions'
import _ from 'lodash'
import Api from '@/services/Api'
import { HiddenPost } from '../Profile/components'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

const PostChat = ({ route }) => {
  const post = route?.params?.post
  const navigation = useNavigation()
  const [roomsChats, setRoomsChats] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(UserContext)
  const messages = [
    {
      id: 0,
      user_name: 'Trizh',
      icon: require('@/assets/images/default-profile.png'),
      message:
        'Would like to follow up an order. I ordered 20 minutes ago. I’m hungry!',
      read: false,
    },
    {
      id: 1,
      user_name: 'Gail',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Okay po',
      read: false,
    },
    {
      id: 2,
      user_name: 'Pia',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Do you have Keto-friendly set?',
      read: false,
    },
    {
      id: 3,
      user_name: 'Grae',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Hello! I’d like to make amendments to my order please :)',
      read: true,
    },
    {
      id: 4,
      user_name: 'Jayson',
      icon: require('@/assets/images/default-profile.png'),
      message:
        'Have you received my payment? I can try GCash if my BPI QR doesn’t work Have you received my payment? I can try GCash if my BPI QR doesn’t work',
      read: true,
    },
    {
      id: 5,
      user_name: 'Rey',
      icon: require('@/assets/images/default-profile.png'),
      message: 'sent you an attachment',
      read: true,
    },
  ]

  const getAllRooms = async () => {
    firestore()
      .collection('chat_rooms')
      .where('post_id', '==', post.postData.id)
      .onSnapshot(async snap => {
        if (!snap) return
        snap.docs.map(async (room, index) => {
          const roomId = room.id
          let roomChats = []
          firestore()
            .collection('chat_rooms')
            .doc(room.id)
            .collection('messages')
            .where('uid', '!=', user?.uid)
            .onSnapshot(async chatRef => {
              let chats = chatRef.docs.map(chatDoc => {
                if (chatDoc.data()) {
                  return chatDoc.data()
                }
              })

              chats.sort((a, b) => b.createdAt - a.createdAt)
              if (chats[0]?.uid) {
                const userData =
                  (await Api.getUser({ uid: chats[0].uid })).data || {}
                const { full_name, profile_photo } = userData
                const currentChats = {
                  chats,
                  full_name,
                  profile_photo,
                  roomId,
                }

                const foundIndex = roomChats.findIndex(
                  rmChats => rmChats.roomId == currentChats.roomId
                )

                if (~foundIndex) {
                  roomChats[foundIndex] = currentChats
                  setRoomsChats([...roomChats])
                } else {
                  roomChats.push(currentChats)
                  setRoomsChats(roomsChats => [...roomsChats, ...roomChats])
                }
                setIsLoading(false)
              }
            })
        })
      })
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setIsLoading(true)
      getAllRooms()
    }
    return () => (isMounted = false)
  }, [post])

  const [filters, setFilters] = useState({
    type: [],
  })

  const [multipleSelect, setMultipleSelect] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showChatOptions, setShowChatOptions] = useState(false)
  const [showMultiChatOptions, setShowMultiChatOptions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))

  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal)
  }

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

  const CoverPhoto = ({ post }) => {
    return post?.cover_photos?.length > 0 ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{ uri: post?.cover_photos[0] }}
      />
    ) : post?.postData.type === 'service' ? (
      <DefaultService width={normalize(24)} height={normalize(24)} />
    ) : post?.postData.type === 'need' ? (
      <DefaultNeed width={normalize(24)} height={normalize(24)} />
    ) : (
      <DefaultSell width={normalize(24)} height={normalize(24)} />
    )
  }

  const ProfilePhoto = ({ size, photo }) => {
    return photo ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const handleSearchPress = () => {
    if (!isSearchFocused) {
      onFocus()
    } else {
      onBlur()
    }
  }

  const handleChatPress = async (otherUID, postId) => {
    let channel
    try {
      if (!user?.uid) return
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [user?.uid]: true,
          [otherUID]: true,
        })
        .where('post_id', '==', postId)
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')
        const { id } = await ref.add({
          members: {
            [user.uid]: true,
            [otherUID]: true,
          },
          post_id: postId,
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }

      navigation.navigate('NBTScreen', {
        screen: 'Chat',
        params: {
          user,
          channel,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const renderRightActions = dragX => {
    const trans = dragX.interpolate({
      inputRange: [0, 1, 1, 1],
      outputRange: [100, 1, -1, 0],
    })
    return (
      <Animated.View
        style={[
          styles.swipeout,
          {
            transform: [{ translateX: trans }],
          },
        ]}>
        <RectButton
          style={[
            styles.swipeOption,
            { backgroundColor: Colors.primaryMidnightBlue },
          ]}
          onPress={() => setShowChatOptions(true)}>
          <HorizontalWhiteEllipsis />
        </RectButton>

        <RectButton
          onPress={cancelModalToggle}
          style={[
            styles.swipeOption,
            { backgroundColor: Colors.secondaryBrinkPink },
          ]}>
          <View>
            <TrashWhite />
          </View>
        </RectButton>
      </Animated.View>
    )
  }

  const getOption = option => {
    setMultipleSelect(option)
  }

  return (
    <SafeAreaView style={styles.parent}>
      <TransitionIndicator loading={isLoading} />
      <ScreenHeaderTitle
        title="Post Chats"
        iconSize={multipleSelect ? 0 : normalize(16)}
        paddingSize={3}
        close={() => navigation.goBack()}
        withOptions
        openOptions={() => setShowMultiChatOptions(true)}
      />
      {multipleSelect && (
        <View
          style={{
            position: 'absolute',
            top: normalize(25),
            left: normalize(16),
          }}>
          <TouchableOpacity onPress={() => setMultipleSelect(false)}>
            <AppText textStyle="button3" color={Colors.red}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.postChatHeader}>
        <View style={{ flexDirection: 'row', paddingTop: normalize(15) }}>
          <View style={styles.postImageContainer}>
            <CoverPhoto post={post} />
          </View>
          <AppText textStyle="body2" customStyle={{ marginLeft: normalize(8) }}>
            {post.postData.title}
          </AppText>
        </View>
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
      <ScrollView contentContainerStyle={{ paddingBottom: normalize(25) }}>
        {roomsChats.map((chat, i) => {
          return (
            <Swipeable renderRightActions={renderRightActions} key={i}>
              <AppCheckbox
                style={{
                  flexDirection: 'row-reverse',
                  paddingRight: normalize(16),
                  paddingLeft: normalize(8),
                  display: multipleSelect ? 'flex' : 'none',
                }}
                containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                checkboxStyle={{ borderRadius: 50, borderWidth: 2 }}
                value={filters.type.includes(chat.id)}
                valueChangeHandler={value => {
                  const currentSelectedChats = filters.type
                  if (value) currentSelectedChats.push(chat.id)
                  else
                    currentSelectedChats.splice(
                      filters.type.indexOf(chat.id),
                      1
                    )
                  setFilters(filters => ({
                    ...filters,
                    type: [...new Set(currentSelectedChats)],
                  }))
                }}
                round>
                <View style={{ marginBottom: normalize(15), flex: 1 }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      handleChatPress(chat?.chats[0]?.uid, post.postData.id)
                    }
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: normalize(16),
                    }}>
                    <View style={styles.icon}>
                      <ProfilePhoto size={50} photo={chat.profile_photo} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <AppText
                          textStyle="caption2"
                          customStyle={{
                            paddingRight: 15,
                            width: '90%',
                            marginBottom: normalize(4),
                          }}
                          numberOfLines={1}>
                          {chat.full_name}
                        </AppText>
                        <AppText
                          textStyle="metadata"
                          color={Colors.contentPlaceholder}>
                          1m
                        </AppText>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <AppText
                          textStyle={
                            !chat.chats[0].read ? 'caption2' : 'caption'
                          }
                          customStyle={{ width: '90%' }}
                          numberOfLines={2}>
                          {chat.chats[0].text}
                        </AppText>
                        {!chat.chats[0].read && <BlueDot />}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </AppCheckbox>
            </Swipeable>
          )
        })}
      </ScrollView>
      <View
        style={{
          display: multipleSelect ? 'flex' : 'none',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: normalize(24),
          paddingHorizontal: normalize(35),
        }}>
        <TouchableOpacity>
          <AppText textStyle="button3">Mark as Read</AppText>
        </TouchableOpacity>
        <TouchableOpacity>
          <AppText textStyle="button3" color={Colors.red}>
            Delete
          </AppText>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={showChatOptions}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setShowChatOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChatOptions
          close={() => setShowChatOptions(false)}
          deleteMessage={cancelModalToggle}
        />
      </Modal>
      <Modal
        isVisible={showMultiChatOptions}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => setShowMultiChatOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <MultiChatOptions
          close={() => setShowMultiChatOptions(false)}
          options={getOption}
        />
      </Modal>
      <Modal
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={450}
        animationOut="bounceOut"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{ marginBottom: 16 }}>
            Delete Message?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{ textAlign: 'center', marginBottom: normalize(15) }}>
            Are you sure you want to delete this message?
          </AppText>

          <TouchableOpacity
            onPress={cancelModalToggle}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Delete</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={cancelModalToggle}
            style={{
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
            }}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default PostChat

const styles = StyleSheet.create({
  parent: { flex: 1, backgroundColor: 'white' },
  postChatHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  icon: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(50 / 2),
    overflow: 'hidden',
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
  swipeout: {
    width: normalize(140),
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  swipeOption: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImageContainer: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(24 / 2),
    overflow: 'hidden',
  },
})
