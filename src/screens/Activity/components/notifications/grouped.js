import React, { useContext } from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'
import firestore from '@react-native-firebase/firestore'

import { PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import typography from '@/globals/typography'

const Grouped = ({ item }) => {
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const timeAgo = time => timePassedShort(time)

  const getNames = items => {
    let names = `${items[0].user.name}, ${items[1].user.name}`
    if (items.length > 2) names += ` and ${items.length - 2} others`
    return names
  }

  const handleViewOrders = async item => {
    const postRef = await firestore()
      .collection('posts')
      .doc(item[0].post_id)
      .get()
    const postData = postRef.data()

    const orders = item.map(order => {
      const currentOrder = { ...order }
      currentOrder.items = postData.items
      return currentOrder
    })

    const activity = {
      post: postData,
      orders,
      user: {
        profile_photo: userInfo.profile_photo,
        name: userInfo.display_name || userInfo.full_name,
      },
    }

    Promise.all(
      item.map(async notif => {
        await firestore()
          .collection('activities')
          .doc(user.uid)
          .collection('notifications')
          .doc(notif.id)
          .update({ read: true })
      })
    )

    navigation.navigate('NBTScreen', {
      screen: 'OngoingItem',
      params: {
        item: activity,
      },
    })
  }

  return (
    <View
      style={{
        ...styles.notification,
        backgroundColor: item.some(notif => !notif.read)
          ? '#F2F7FF'
          : '#FBFBFB',
      }}>
      <View style={styles.holder}>
        <View style={styles.avatarHolder}>
          <View style={styles.avatarContainer}>
            <Avatar
              style={styles.avatar}
              path={item[0]?.user?.profile_photo}
              size="64x64"
            />
          </View>
          <View style={{ ...styles.avatarContainer, ...styles.secondAvatar }}>
            <Avatar
              style={styles.avatar}
              path={item[1]?.user?.profile_photo}
              size="64x64"
            />
          </View>
        </View>
        <View style={styles.captionWrapper}>
          <Text style={typography.caption}>
            <Text style={typography.medium}>{getNames(item)}</Text> requested
            orders on your post.
          </Text>
        </View>
      </View>
      <View style={styles.notificationFooter}>
        <View style={styles.timeAgo}>
          <PostClock style={styles.postClock} />
          <AppText textStyle="caption">
            {timeAgo(Date.now() / 1000 - item[0]?.date?._seconds)}
          </AppText>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.yellowButton}
          onPress={() => handleViewOrders(item)}>
          <AppText textStyle="button3">View Orders</AppText>
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
    flexDirection: 'row',
    marginRight: normalize(15),
  },
  avatarContainer: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  secondAvatar: {
    position: 'absolute',
    top: normalize(7),
    right: normalize(-10),
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
export default Grouped
