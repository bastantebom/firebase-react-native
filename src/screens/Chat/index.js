import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
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
import { Colors, normalize } from '@/globals'
import {
  AudioVideo,
  HeaderBackGray,
  ProfileImageDefault,
  SendMessage,
  VerticalEllipsis,
} from '@/assets/images/icons'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import { TransitionIndicator } from '@/components'

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

  const [currentUser] = useState({
    _id: userInfo.uid,
    name: userInfo.full_name,
    avatar:
      userInfo.profile_photo ||
      (() => (
        <ProfileImageDefault
          width={normalize(28.5)}
          height={normalize(28.5)}></ProfileImageDefault>
      )),
  })

  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState({})
  const [messagingUser, setMessagingUser] = useState({})

  const handleSend = useCallback(async (messages = []) => {
    const chatsRef = firestore()
      .collection('chat_rooms')
      .doc(channel.id)
      .collection('messages')

    await Promise.all(
      messages.map(async message => {
        const created_at = firestore.Timestamp.fromDate(message.createdAt)
        const messageData = {
          ...message,
          created_at,
          createdAt: created_at.seconds * 1000,
          uid: currentUser._id,
          read: false,
        }
        delete messageData.user
        await chatsRef.add(messageData)
      })
    )
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
              avatar: response.data.profile_photo,
              name: response.data.full_name,
            }
        })
      )
    } catch (error) {
      console.log(error)
    }
    setMembers(chatMembers)
    setIsLoading(false)

    firestore()
      .collection('chat_rooms')
      .doc(channel.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const messages = snap?.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            text: '',
            ...data,
            user: chatMembers[data.uid],
          }
        })
        setMessages(messages)
      })
  }

  useEffect(() => {
    let isSubscribed = true
    if (isSubscribed) init()
    return () => (isSubscribed = false)
  }, [])

  useEffect(() => {
    const user =
      members[Object.keys(members).find(uid => uid !== currentUser._id)]
    if (user)
      setMessagingUser({ ...user, avatar: user.profile_photo, active: true })
  }, [members])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator
        loading={isLoading}
        backdropStyle={{ backgroundColor: '#fff' }}
      />
      <ChatHeader user={messagingUser} navigation={navigation} />
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
    </SafeAreaView>
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

const ChatHeader = ({ navigation, user, showActiveStatus }) => {
  return (
    <View style={styles.chatWrapper}>
      <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.7}>
        <HeaderBackGray style={styles.backButton} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
        }}>
        <TouchableOpacity style={styles.headerContent} onPress={() => null}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.headerContentImage}
          />
          <View>
            <Text style={styles.headerContentName}>@{user.username}</Text>
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
      <TouchableOpacity>
        <VerticalEllipsis height={normalize(24)} width={normalize(24)} />
      </TouchableOpacity>
    </View>
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
  inputToolbarContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputToolbarWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 0,
    padding: normalize(24),
    backgroundColor: '#fff',
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
  },
  headerContentName: {
    fontSize: normalize(14),
    lineHeight: normalize(21),
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
    borderColor: '#DADCE0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatar: {
    height: normalize(28),
    width: normalize(28),
  },
  backButton: {
    width: normalize(16),
    height: normalize(16),
    marginRight: normalize(16),
  },
  composerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderWidth: normalize(1),
    borderColor: '#DADCE0',
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
    color: 'white',
    width: normalize(24),
    height: normalize(24),
  },
  messagesContainer: {
    backgroundColor: '#fff',
  },
  sendContainer: {
    backgroundColor: '#FFD400',
    padding: 12,
    height: 48,
    width: 48,
    marginLeft: 8,
    borderRadius: 4,
  },
})

export default ChatScreen
