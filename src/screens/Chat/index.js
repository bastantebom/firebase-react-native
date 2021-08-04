import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import {
  GiftedChat,
  InputToolbar,
  Actions,
  Message,
  Bubble,
  MessageText,
  Send,
} from 'react-native-gifted-chat'
import Video from 'react-native-video'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Colors, normalize } from '@/globals'
import { AudioVideo, Icons, SendMessage } from '@/assets/images/icons'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import { TransitionIndicator, AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import typography from '@/globals/typography'

/**
 * @typedef {Object} ChatChannel
 * @property {string} id
 * @property {string[]} members
 */

/**
 * @typedef {Object} ChatProps
 * @property {ChatChannel} channel
 */

/**
 * @typedef {Object} RootProps
 * @property {ChatProps} Chat
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'Chat'>} param0 */
const ChatScreen = ({ route, navigation }) => {
  const { channel } = route.params
  const { userInfo } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  const renderAvatar = path => (
    <View style={styles.avatar}>
      <Avatar
        style={{ height: '100%', width: '100%' }}
        path={path}
        size="64x64"
      />
    </View>
  )

  const [currentUser] = useState({
    _id: userInfo.uid,
    name: userInfo.full_name,
    avatar: () => renderAvatar(userInfo.profile_photo),
  })

  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState({})
  const [messagingUser, setMessagingUser] = useState({})
  const [postDetail, setPostDetail] = useState({})

  const handleSend = useCallback(async (messages = []) => {
    const chatsRef = firestore().collection('chat_rooms').doc(channel.id)

    await Promise.all([
      ...messages.map(async message => {
        const created_at = firestore.Timestamp.fromDate(message.createdAt)
        const messageData = {
          ...message,
          created_at,
          createdAt: created_at.seconds * 1000,
          uid: currentUser._id,
          read: false,
        }
        delete messageData.user
        await chatsRef.collection('messages').add(messageData)
      }),
      (async () => {
        await chatsRef.update({
          has_messages: true,
          latest_chat_time: firestore.Timestamp.fromDate(new Date()),
        })
      })(),
    ])
  })

  const init = async () => {
    const chatMembers = {}
    try {
      await Promise.all(
        Object.keys(channel.members).map(async uid => {
          const response = await Api.getUser({ uid })

          if (response.success)
            chatMembers[uid] = {
              ...response.data,
              _id: uid,
              avatar: () => renderAvatar(response.data.profile_photo),
              name: response.data.full_name,
            }
        })
      )
      const postDetailsResponse = await Api.getPost({ pid: channel.post_id })
      if (!postDetailsResponse.success)
        throw new Error(postDetailsResponse.message)
      setPostDetail(postDetailsResponse.data)
    } catch (error) {
      console.log(error)
    }
    setMembers(chatMembers)
    setIsLoading(false)

    let unsubscribe = firestore()
      .collection('chat_rooms')
      .doc(channel.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const messages = snap?.docs.map(doc => {
          const data = doc.data()
          if (data.uid !== userInfo?.uid && !data.read) {
            readChat(doc.id, channel.id)
          }
          return {
            id: doc.id,
            text: '',
            ...data,
            user: chatMembers[data.uid],
          }
        })
        setMessages(messages)
      })
    return unsubscribe
  }

  const readChat = async (id, channel) => {
    if (!userInfo?.uid) return
    const messageRef = firestore()
      .collection('chat_rooms')
      .doc(channel)
      .collection('messages')
      .doc(id)
    await messageRef.update({
      read: true,
    })
  }

  useEffect(() => {
    let unsubscribe = init()
    return () => unsubscribe
  }, [])

  useEffect(() => {
    const user =
      members[Object.keys(members).find(uid => uid !== currentUser._id)]
    if (user)
      setMessagingUser({ ...user, avatar: user.profile_photo, active: true })
  }, [members])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <TransitionIndicator
          loading={isLoading}
          backdropStyle={{ backgroundColor: '#fff' }}
        />
        <ChatHeader
          user={messagingUser}
          userInfo={userInfo}
          navigation={navigation}
          post={postDetail}
        />
        <GiftedChat
          messages={messages}
          messagesContainerStyle={styles.messagesContainer}
          onSend={messages => handleSend(messages)}
          renderMessageVideo={renderMessageVideo}
          showUserAvatar={true}
          renderTime={() => null}
          renderActions={() => null}
          renderInputToolbar={renderInputToolbar}
          renderMessage={renderMessage}
          user={currentUser}
          alwaysShowSend={true}
          minInputToolbarHeight={normalize(93)}
          renderSend={renderSend}
        />
      </View>
    </>
  )
}

const renderMessageText = props => {
  return (
    <MessageText
      {...props}
      containerStyle={{
        left: styles.messageText,
        right: styles.messageText,
      }}></MessageText>
  )
}

const renderBubble = props => {
  return (
    <Bubble
      {...props}
      renderMessageText={renderMessageText}
      textStyle={{
        left: { ...typography.body2, color: Colors.contentEbony },
        right: { ...typography.body2, color: Colors.neutralsWhite },
      }}
      wrapperStyle={{
        left: { ...styles.bubble, ...styles.bubbleLeft },
        right: { ...styles.bubble, ...styles.bubbleRight },
      }}></Bubble>
  )
}

const renderMessage = props => {
  return (
    <Message
      {...props}
      renderBubble={renderBubble}
      imageStyle={{
        left: styles.avatar,
        right: styles.avatar,
      }}
      containerStyle={{
        left: styles.message,
        right: styles.message,
      }}></Message>
  )
}

const renderInputToolbar = props => {
  return (
    <CustomInputToolbar
      {...props}
      primaryStyle={styles.inputToolbar}
      containerStyle={styles.inputToolbarWrapper}
      textInputStyle={{
        fontSize: normalize(16),
        lineHeight: normalize(24),
        margin: 0,
        ...typography.body2,
      }}
    />
  )
}

const renderMessageVideo = props => {
  const { currentMessage } = props

  return (
    <View>
      <Video source={{ uri: currentMessage.video }} useNativeControls></Video>
    </View>
  )
}

const renderActions = props => {
  const handlePickImage = () => {
    return null
  }

  return (
    <Actions
      {...props}
      onPressActionButton={handlePickImage}
      icon={() => <AudioVideo width={24} height={24} />}
      containerStyle={{
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 6,
        paddingRight: 6,
      }}
    />
  )
}

const renderSend = props => {
  return (
    <Send {...props} containerStyle={styles.sendContainer}>
      <SendMessage style={styles.sendButton}></SendMessage>
    </Send>
  )
}

const ChatHeader = ({ navigation, user, showActiveStatus, post, userInfo }) => {
  const handleUserPress = () => {
    if (user?.uid === userInfo?.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile',
          params: { uid: user?.uid },
        },
      })
    }
  }

  const handlePostPress = () => {
    if (!post?.uid || !post?.id) return
    if (post?.archived) {
      navigation.push('NBTScreen', {
        screen: 'unavailable-archive',
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'posts',
        params: {
          screen: 'published-post',
          params: {
            id: post.id,
            uid: post.uid,
          },
        },
      })
    }
  }

  return (
    <>
      <View style={styles.chatWrapper}>
        <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.7}>
          <Icons.Back
            style={styles.backButton}
            width={normalize(24)}
            height={normalize(24)}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            style={styles.headerContent}
            onPress={handleUserPress}>
            <View style={styles.headerContentImage}>
              <Avatar
                style={{ height: '100%', width: '100%' }}
                path={user.avatar}
                size="64x64"
              />
            </View>
            <View>
              <Text style={[styles.headerContentName, typography.body2]}>
                @{user.username}
              </Text>
              {showActiveStatus ? (
                <Text
                  style={[
                    styles.headerContentStatus,
                    { color: user.active ? '#369683' : '#aaa' },
                  ]}>
                  {user.active ? 'Active now' : 'Not active'}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {post?.id && (
        <View style={styles.postDetails}>
          <TouchableOpacity
            style={styles.headerContent}
            activeOpacity={0.8}
            onPress={handlePostPress}>
            <View style={styles.postImageContainer}>
              <PostImage
                size="32x32"
                path={post?.cover_photos?.[0]}
                postType={post?.type?.toLowerCase()}
              />
            </View>
            <Text
              style={[
                typography.caption,
                { marginLeft: normalize(8), width: '90%', flexShrink: 1 },
              ]}
              numberOfLines={2}>
              {post?.title}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

class CustomInputToolbar extends InputToolbar {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View
        style={[{ position: this.state.position }, this.props.containerStyle]}>
        <View style={[styles.inputToolbarContent, this.props.primaryStyle]}>
          <View style={[styles.composerWrapper, { alignItems: 'center' }]}>
            {this.renderActions()}
            {this.renderComposer()}
          </View>
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  inputToolbarContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputToolbarWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: Colors.neutralsWhite,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 0,
    padding: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContentImage: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(100),
    marginRight: normalize(6),
    overflow: 'hidden',
  },
  headerContentName: {
    fontSize: normalize(14),
    lineHeight: normalize(21),
    marginLeft: normalize(5),
  },
  headerContentStatus: {
    fontSize: normalize(8),
    lineHeight: normalize(12),
  },
  chatWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: normalize(16),
    borderBottomWidth: 1,
    borderColor: Colors.neutralGray,
    backgroundColor: Colors.neutralsWhite,
    alignItems: 'center',
  },
  avatar: {
    height: normalize(28),
    width: normalize(28),
    borderRadius: normalize(14),
    overflow: 'hidden',
  },
  backButton: {
    marginRight: normalize(16),
    color: Colors.primaryMidnightBlue,
  },
  composerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderWidth: normalize(1),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
  },
  inputToolbar: {
    padding: 0,
    margin: 0,
    paddingLeft: normalize(8),
  },
  bubble: {
    borderRadius: normalize(12),
  },
  bubbleLeft: {},
  bubbleRight: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  message: {},
  messageText: {
    paddingTop: normalize(11),
    paddingBottom: normalize(11),
    paddingLeft: normalize(11),
    paddingRight: normalize(11),
  },
  sendButton: {
    color: Colors.neutralsWhite,
    width: normalize(24),
    height: normalize(24),
  },
  messagesContainer: {
    backgroundColor: Colors.neutralsWhite,
  },
  sendContainer: {
    backgroundColor: Colors.primaryYellow,
    padding: normalize(12),
    height: normalize(44),
    width: normalize(48),
    marginLeft: normalize(8),
    borderRadius: 4,
  },
  postDetails: {
    backgroundColor: Colors.neutralsWhitesmoke,
    height: normalize(56),
    flexDirection: 'row',
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(16),
  },
  postImageContainer: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: 8,
    overflow: 'hidden',
  },
})

export default ChatScreen
