import React, { useContext, useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, CacheableImage } from '@/components'
import { GlobalStyle, normalize, timePassedShort } from '@/globals'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

import {
  RedBadge,
  YellowBadge,
  ProfileImageDefault,
  PostClock,
  Bee,
  Verified,
  NotVerified,
} from '@/assets/images/icons'

const NotificationsCard = ({ info, openNotificationHandler }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()

  const {
    profilePhoto,
    name,
    type,
    isFollowing,
    read,
    date,
    follower_uid,
    id,
    approved,
  } = info
  const [following, setFollowing] = useState(isFollowing)

  const AvatarPhoto = ({ size }) => {
    return profilePhoto ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: profilePhoto,
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

  const openProfileHandler = () => {
    if (!read) openNotificationHandler(id)
    if (user && user.uid === follower_uid) {
      navigation.navigate('Profile', {
        screen: 'Profile',
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: follower_uid },
      })
    }
  }

  const followBackHandler = async () => {
    if (!read) openNotificationHandler(id)
    const followBackResponse = await Api.followUser({ uid: follower_uid })
    try {
      if (followBackResponse.success) {
        setFollowing(followBackResponse.data.is_following)
      }
    } catch (error) {
      console.log(error.message || error)
    }
  }

  const viewNotVerifiedHandler = () => {
    navigation.navigate('NBTScreen', {
      screen: 'NotVerified',
      params: {
        screen: 'NotVerifiedScreen',
        params: { date },
      },
    })
  }

  return (
    <View>
      <View
        style={[
          styles.notification,
          { backgroundColor: !read ? '#F2F7FF' : '#FBFBFB' },
        ]}>
        <View style={styles.holder}>
          <View>
            <View style={styles.avatarHolder}>
              {type === 'follow' && <AvatarPhoto size={35} />}
              {type === 'verification' && <AvatarPhoto size={35} />}
            </View>
            {
              <View style={styles.badgeHolder}>
                {type === 'verification' && !approved ? (
                  <NotVerified width={normalize(18)} height={normalize(18)} />
                ) : type === 'verification' && approved ? (
                  <Verified width={normalize(18)} height={normalize(18)} />
                ) : null}
              </View>
            }
          </View>

          {type == 'verification' && !approved ? (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption">
                  Your account verification has been unsuccessful. You may opt
                  to try again.
                </AppText>
              </Text>
            </View>
          ) : null}

          {type == 'follow' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption2">{name} </AppText>
                <AppText textStyle="caption">followed you</AppText>
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.holder, styles.cta]}>
          <View style={styles.holder}>
            <PostClock width={normalize(16)} height={normalize(16)} />
            <AppText
              customStyle={{
                marginLeft: 3,
                color: '#8C8B98',
                width: normalize(33),
              }}>
              {timeAgo(Date.now() / 1000 - date.seconds)}
            </AppText>
          </View>

          {type === 'follow' && (
            <>
              <TouchableOpacity
                style={{
                  paddingVertical: 6,
                  marginRight: 10,
                  width: 130,
                  alignItems: 'center',
                  backgroundColor: '#FFD400',
                  borderRadius: 5,
                }}
                activeOpacity={0.7}
                onPress={() => openProfileHandler()}>
                <AppText textStyle="button3">View Profile</AppText>
              </TouchableOpacity>
              {!following && (
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    width: 130,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    borderColor: '#1F1A54',
                    borderWidth: 1.5,
                  }}
                  onPress={() => followBackHandler()}>
                  <AppText textStyle="button3">Follow Back</AppText>
                </TouchableOpacity>
              )}
            </>
          )}
          {type === 'verification' && (
            <>
              <TouchableOpacity
                style={{
                  paddingVertical: 6,
                  marginRight: 10,
                  width: 130,
                  alignItems: 'center',
                  backgroundColor: '#FFD400',
                  borderRadius: 5,
                }}
                onPress={() => viewNotVerifiedHandler()}>
                <AppText textStyle="button3">View</AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: 14,
    marginTop: normalize(10),
    borderRadius: 4,
  },
  notificationOld: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: 4,
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarHolder: {
    marginRight: normalize(15),
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },
  badgeHolder: {
    position: 'absolute',
    bottom: -4,
    right: normalize(10),
  },
  cta: {
    paddingTop: 20,
  },
  btnHolder: {
    flexDirection: 'row',
  },
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },
})

export default NotificationsCard
