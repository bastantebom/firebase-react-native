import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { normalize, Colors, timePassedShort } from '@/globals'
import { BlueDot, ChatBlue, ChatEmpty } from '@/assets/images/icons'
import { AppText } from '@/components'
import { UserContext } from '@/context/UserContext'
import { isEmpty } from 'lodash'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'

const ChatHouseCard = ({ post, handleChatPress, navigation }) => {
  const { user } = useContext(UserContext)

  const unRead = () => {
    return (
      post.chats.filter(chat => !chat.read).length > 0 && !isEmpty(post.chats)
    )
  }

  const renderAvatar = () => {
    return (
      <View style={styles.avatar}>
        <Avatar
          style={{ height: '100%', width: '100%' }}
          path={post.profilePhoto}
          size="64x64"
        />
      </View>
    )
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const renderChatCopy = post => {
    return isEmpty(post.chat) && !post.chats.length
      ? `No messages yet`
      : post.chats.filter(chat => !chat.read).length > 0
      ? `${post.chats.filter(chat => !chat.read).length} New in ${
          post.chats.length
        } ${post.chats.length > 1 ? `chats` : `chat`}`
      : `${post.chats.length} ${post.chats.length > 1 ? `chats` : `chat`}`
  }

  const chatPress = () => {
    const members = {
      [post.postData.uid]: true,
      [user?.uid]: true,
    }
    handleChatPress(members, post.postData.id)
  }

  return (
    <View>
      {post.cardType === 'seller' ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('NBTScreen', {
              screen: 'PostChat',
              params: { post },
            })
          }
          style={{ flexDirection: 'row' }}>
          <View style={styles.postImageContainer}>
            <PostImage
              size="32x32"
              path={post?.cover_photos?.[0]}
              postType={post?.type?.toLowerCase()}
              width={normalize(64)}
              height={normalize(64)}
            />
          </View>
          <View style={{ paddingLeft: normalize(8), flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                textStyle="body2medium"
                customStyle={{
                  paddingRight: 15,
                  marginBottom: normalize(4),
                }}
                numberOfLines={1}>
                {post?.postData?.title}
              </AppText>
              <AppText textStyle="metadata" color={Colors.contentPlaceholder}>
                {timeAgo(Date.now() / 1000 - post.time)}
              </AppText>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {unRead() ? <ChatBlue /> : <ChatEmpty />}
              <AppText
                textStyle="caption"
                customStyle={{ marginLeft: normalize(4) }}
                color={
                  unRead() ? Colors.contentOcean : Colors.contentPlaceholder
                }>
                {renderChatCopy(post)}
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={chatPress}
          style={{ flexDirection: 'row', flex: 1 }}>
          <View style={[styles.postImageContainer, styles.postImageBuyer]}>
            <PostImage
              size="32x32"
              path={post?.cover_photos?.[0]}
              postType={post?.type?.toLowerCase()}
              width={normalize(56)}
              height={normalize(56)}
            />
          </View>
          <View
            style={[
              styles.userInfoImageContainer,
              post.profilePhoto && styles.additionalPadding,
            ]}>
            {renderAvatar()}
          </View>
          <View style={{ paddingLeft: normalize(8), flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                textStyle="caption2"
                customStyle={{
                  paddingRight: 15,
                  marginBottom: normalize(4),
                }}
                numberOfLines={1}>
                {post.seller.split(' ')[0]} • {post.storeName}
              </AppText>
              <AppText textStyle="metadata" color={Colors.contentPlaceholder}>
                {timeAgo(Date.now() / 1000 - post?.time)}
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
                  post?.chats?.read && post?.chats[0]?.uid === user?.uid
                    ? 'caption2'
                    : 'caption'
                }
                customStyle={{
                  width: post?.chats[0]?.read ? '100%' : '90%',
                }}
                numberOfLines={2}>
                {`${
                  isEmpty(post.chats)
                    ? `No messages yet`
                    : `${
                        post.chats.uid === user?.uid
                          ? `You: `
                          : `${post.seller.split(' ')[0]}: `
                      } ${post.chats.text}`
                }`}
              </AppText>
              {!isEmpty(post?.chats) &&
                !post?.chats?.read &&
                post?.chats?.uid !== user?.uid && <BlueDot />}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    height: normalize(24),
    width: normalize(24),
  },
  postImageContainer: {
    width: normalize(64),
    height: normalize(72),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImageBuyer: {
    width: normalize(56),
    height: normalize(56),
  },
  userInfoImageContainer: {
    height: normalize(24),
    width: normalize(24),
    borderRadius: normalize(24 / 2),
    overflow: 'hidden',
    alignSelf: 'center',
    marginLeft: normalize(-15),
    marginTop: normalize(40),
    backgroundColor: Colors.neutralsWhite,
  },
  additionalPadding: {
    borderWidth: normalize(2),
    borderColor: Colors.neutralsWhite,
  },
})

export default ChatHouseCard
