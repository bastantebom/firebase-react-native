import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { NotVerified, Verified, PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'

const Verification = ({ unreadNotification, item }) => {
  const navigation = useNavigation()

  const timeAgo = time => {
    if (time <= 60) return 'Just now'

    return timePassedShort(time)
  }

  const handlePress = () => {
    if (!item.read) unreadNotification(item.id)

    if (item.approved) {
      navigation.navigate('NBTScreen', {
        screen: 'Verified',
        params: {
          screen: 'VerifiedScreen',
          params: { item },
        },
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'NotVerified',
        params: {
          screen: 'NotVerifiedScreen',
          params: { item },
        },
      })
    }
  }

  return (
    <View
      style={{
        ...styles.notification,
        backgroundColor: !item?.read ? '#F2F7FF' : '#FBFBFB',
      }}>
      <View style={styles.holder}>
        <View>
          <View style={styles.avatarHolder}>
            <Avatar
              style={styles.avatar}
              path={item?.user?.profile_photo}
              size="64x64"
            />
          </View>
          {item?.approved ? (
            <Verified
              style={styles.badge}
              width={normalize(14)}
              height={normalize(14)}
            />
          ) : (
            <NotVerified
              style={styles.badge}
              width={normalize(14)}
              height={normalize(14)}
            />
          )}
        </View>
        <View style={styles.captionWrapper}>
          <AppText textStyle="caption">
            {item?.approved
              ? 'Congratulations, Wayne! Your account has been successfully verified! You may now enjoy the full features of Servbees!'
              : 'Account verification unsuccessful. Try again today.'}
          </AppText>
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
          style={styles.viewButton}
          onPress={handlePress}>
          <AppText textStyle="button3">View</AppText>
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
  viewButton: {
    paddingVertical: 6,
    marginRight: 10,
    width: 130,
    alignItems: 'center',
    backgroundColor: '#FFD400',
    borderRadius: 5,
  },
})

export default Verification
