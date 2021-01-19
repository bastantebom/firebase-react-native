import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'
import { normalize, Colors, GlobalStyle, timePassedShort } from '@/globals'
import {
  BlueDot,
  ChatBlue,
  ChatEmpty,
  ProfileImageDefault,
} from '@/assets/images/icons'
import { AppText, CacheableImage } from '@/components'
import { UserContext } from '@/context/UserContext'
import _ from 'lodash'

const ChatHouseCard = ({ post, handleChatPress, navigation }) => {
  const { user } = useContext(UserContext)

  const CoverPhoto = ({ size }) => {
    return post?.postData.cover_photos?.length > 0 ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{ uri: post?.postData?.cover_photos[0] }}
      />
    ) : post?.postData.type === 'service' ? (
      <DefaultService width={normalize(size)} height={normalize(size)} />
    ) : post?.postData.type === 'need' ? (
      <DefaultNeed width={normalize(size)} height={normalize(size)} />
    ) : (
      <DefaultSell width={normalize(size)} height={normalize(size)} />
    )
  }

  const unRead =
    post?.chats?.length && !post?.chats[0]?.read && !_.isEmpty(post.chats)

  const AvatarPhoto = ({ size }) => {
    return post.profilePhoto ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: post.profilePhoto,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const renderChatCopy = post => {
    return _.isEmpty(post.chat) && !post.chats.length
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
            <CoverPhoto size={64} />
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
              {unRead ? <ChatBlue /> : <ChatEmpty />}
              <AppText
                textStyle="caption"
                customStyle={{ marginLeft: normalize(4) }}
                color={
                  unRead ? Colors.contentOcean : Colors.contentPlaceholder
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
            <CoverPhoto size={56} />
          </View>
          <View
            style={[
              styles.userInfoImageContainer,
              post.profilePhoto && styles.additionalPadding,
            ]}>
            <AvatarPhoto size={24} />
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
                {timeAgo(Date.now() / 1000 - post?.chats?.created_at?._seconds)}
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
                  _.isEmpty(post.chats)
                    ? `No messages yet`
                    : `${
                        post.chats.uid === user?.uid
                          ? `You: `
                          : `${post.seller.split(' ')[0]}: `
                      } ${post.chats.text}`
                }`}
              </AppText>
              {!_.isEmpty(post?.chats) &&
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
    padding: normalize(2),
  },
})

export default ChatHouseCard
