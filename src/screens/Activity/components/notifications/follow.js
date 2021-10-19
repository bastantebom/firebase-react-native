import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Api from '@/services/Api'

import { PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Toast from '@/components/toast'
import Avatar from '@/components/Avatar/avatar'
import typography from '@/globals/typography'
import pluralize from 'pluralize'

const Follow = ({ unreadNotification, item, followings }) => {
  const navigation = useNavigation()
  const [follower, setFollower] = useState({})
  const [isFollower, setIsFollower] = useState(false)

  const timeAgo = time => timePassedShort(time)

  const handleViewProfile = () => {
    if (!item.read) unreadNotification(item.id)

    navigation.navigate('NBTScreen', {
      screen: 'OthersProfile',
      params: { uid: item.followers?.[0]?.id },
    })
  }

  const handleFollowBack = async () => {
    if (!item.read) unreadNotification(item.id)

    try {
      if (isFollower) {
        const response = await Api.unfollowUser({
          uid: item.followers?.[0]?.id,
        })

        if (!response.success) throw new Error(response.message)

        Toast.show({
          label: `successfully unfollowed this account`,
          type: 'success',
          dismissible: true,
          timeout: 5000,
          screenId: 'Notifications',
        })

        setIsFollower(false)
      } else {
        const response = await Api.followUser({ uid: item.followers?.[0]?.id })

        if (!response.success) throw new Error(response.message)

        Toast.show({
          label: `You're now following this account`,
          type: 'success',
          dismissible: true,
          timeout: 5000,
          screenId: 'Notifications',
        })

        setIsFollower(true)
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops! Something went wrong',
        type: 'error',
        dismissible: true,
        timeout: 5000,
        screenId: 'Notifications',
      })
    }
  }

  const loadUser = async () => {
    try {
      const response = await Api.getUser({ uid: item.followers?.[0]?.id })

      if (!response.success) throw new Error(response.message)

      setFollower(response.data)
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const getNotificationTitle = item => {
    let content
    if (item.followers.length === 3) {
      content = (
        <>
          <Text style={typography.medium}>{item.followers[0].name}</Text>,
          <Text style={typography.medium}>{item.followers[1].name}</Text>, and{' '}
          {item.followers.length - 2}{' '}
          {pluralize('other', item.follwers_count - 2)}
          followed you
        </>
      )
    } else if (item.followers.length === 2) {
      content = (
        <>
          <Text style={typography.medium}>{item.followers[0].name}</Text>
          {' and '}
          <Text style={typography.medium}>{item.followers[1].name}</Text>
          followed you
        </>
      )
    } else if (item.followers.length === 1) {
      content = (
        <>
          <Text style={typography.medium}>{item.followers[0].name}</Text>
          followed you
        </>
      )
    }

    return content ? (
      <Text style={typography.caption}>{content}</Text>
    ) : undefined
  }

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    setIsFollower(
      followings.some(following => following.uid === item.followers?.[0]?.id)
    )
  }, [followings])

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
            path={follower?.profile_photo}
            size="64x64"
          />
        </View>
        <View style={styles.captionWrapper}>
          <Text style={typography.caption}>{getNotificationTitle(item)}</Text>
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
          <AppText textStyle="button3">
            {isFollower ? 'Unfollow' : 'Follow Back'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: normalize(4),
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
    paddingVertical: normalize(6),
    marginRight: normalize(10),
    width: '35%',
    backgroundColor: '#FFD400',
    borderRadius: normalize(5),
  },
  invertedButton: {
    alignItems: 'center',
    paddingVertical: normalize(6),
    marginRight: normalize(10),
    width: '35%',
    borderRadius: normalize(5),
    borderWidth: normalize(1),
  },
})

export default Follow
