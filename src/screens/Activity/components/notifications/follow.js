import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Api from '@/services/Api'

import { NotVerified, Verified, PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'

const Follow = ({ unreadNotification, item }) => {
  const navigation = useNavigation()

  const timeAgo = time => {
    if (time <= 60) return 'Just now'

    return timePassedShort(time)
  }

  const handleViewProfile = () => {
    if (!item.read) unreadNotification(item.id)

    navigation.navigate('NBTScreen', {
      screen: 'OthersProfile',
      params: { uid: item.follower_uid },
    })
  }

  const handleFollowBack = async () => {
    if (!item.read) unreadNotification(item.id)

    try {
      const response = await Api.followUser({ uid: item.follower_uid })

      if (response.success) alert('Success')
      else throw new Error(response.message)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  return (
    <View
      style={{
        ...styles.notification,
        backgroundColor: !item?.read ? '#F2F7FF' : '#FBFBFB',
      }}>
      <View style={styles.holder}>
        <View style={styles.avatarHolder}>
          <Avatar
            style={styles.avatar}
            path={item?.user?.profile_photo}
            size="64x64"
          />
        </View>
        <View style={styles.captionWrapper}>
          <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
            {item.user.name}
          </AppText>
          <AppText textStyle="caption"> followed you</AppText>
        </View>
      </View>
      <View style={styles.notificationFooter}>
        <View style={styles.timeAgo}>
          <PostClock style={styles.postClock} />
          <AppText textStyle="caption">
            {timeAgo(Date.now() / 1000 - item?.date?._seconds)}
          </AppText>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.yellowButton}
          onPress={handleViewProfile}>
          <AppText textStyle="button3">View Profile</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.invertedButton}
          onPress={handleFollowBack}>
          <AppText textStyle="button3">Follow Back</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: 4,
  },
  holder: {
    flexDirection: 'row',
    marginBottom: normalize(20),
  },
  avatarHolder: {
    marginRight: normalize(15),
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: normalize(12),
  },
  captionWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  postClock: {
    marginRight: normalize(5),
  },
  yellowButton: {
    alignItems: 'center',
    paddingVertical: 6,
    marginRight: 10,
    width: 130,
    backgroundColor: '#FFD400',
    borderRadius: 5,
  },
  invertedButton: {
    alignItems: 'center',
    paddingVertical: 6,
    marginRight: 10,
    width: 130,
    borderRadius: 5,
    borderWidth: 1,
  },
})

export default Follow
