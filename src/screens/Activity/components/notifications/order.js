import React, { useContext } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'

import { PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'

const Order = ({ unreadNotification, item }) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const timeAgo = time => {
    if (time <= 60) return 'Just now'

    return timePassedShort(time)
  }

  const handleViewProfile = () => {
    if (!item.read) unreadNotification(item.id)

    if (item.user.uid === user.uid) {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: item.seller.uid },
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: item.user.uid },
      })
    }
  }

  const handleViewOrder = () => {
    if (!item.read) unreadNotification(item.id)

    navigation.navigate('orders', {
      screen: 'order-tracker',
      params: {
        orderID: item.order_id,
      },
    })
  }

  const renderText = () => {
    if (item.status === 'payment failed') {
      return (
        <>
          <AppText textStyle="caption">Payment to</AppText>
          <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
            {` ${item.seller.name} `}
          </AppText>
          <AppText textStyle="caption">failed. Please try again.</AppText>
        </>
      )
    } else if (item.status === 'paid') {
      return (
        <>
          <AppText textStyle="caption">Successfully paid to</AppText>
          <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
            {` ${item.seller.name} `}
          </AppText>
        </>
      )
    }

    if (item.post_type === 'sell') {
      if (item.status === 'pending') {
        return (
          <>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {`${item.user.name} `}
            </AppText>
            <AppText textStyle="caption">
              reqested an order on your post.
            </AppText>
          </>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <>
              <AppText textStyle="caption">Your order from</AppText>
              <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
                {` ${item.seller.name} `}
              </AppText>
              <AppText textStyle="caption">
                has been accepted. Proceed to payment to complete your order
              </AppText>
            </>
          )
        } else {
          return (
            <>
              <AppText textStyle="caption">Your order from</AppText>
              <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
                {` ${item.seller.name} `}
              </AppText>
              <AppText textStyle="caption">has been accepted.</AppText>
            </>
          )
        }
      } else if (item.status === 'declined') {
        return (
          <>
            <AppText textStyle="caption">Your order from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been declined.</AppText>
          </>
        )
      } else if (item.status === 'cancelled') {
        return (
          <>
            <AppText textStyle="caption">Your order from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been cancelled.</AppText>
          </>
        )
      } else if (item.status === 'completed') {
        return (
          <>
            <AppText textStyle="caption">Your order from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been completed.</AppText>
          </>
        )
      }
    } else if (item.post_type === 'service') {
      if (item.status === 'pending') {
        return (
          <>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {`${item.user.name} `}
            </AppText>
            <AppText textStyle="caption">
              reqested a booking on your post.
            </AppText>
          </>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <>
              <AppText textStyle="caption">Your booking from</AppText>
              <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
                {` ${item.seller.name} `}
              </AppText>
              <AppText textStyle="caption">
                has been accepted. Proceed to payment to complete your booking
              </AppText>
            </>
          )
        } else {
          return (
            <>
              <AppText textStyle="caption">Your booking from</AppText>
              <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
                {` ${item.seller.name} `}
              </AppText>
              <AppText textStyle="caption">has been accepted.</AppText>
            </>
          )
        }
      } else if (item.status === 'declined') {
        return (
          <>
            <AppText textStyle="caption">Your booking from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been declined.</AppText>
          </>
        )
      } else if (item.status === 'cancelled') {
        return (
          <>
            <AppText textStyle="caption">Your booking from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been cancelled.</AppText>
          </>
        )
      } else if (item.status === 'completed') {
        return (
          <>
            <AppText textStyle="caption">Your booking from</AppText>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">has been completed.</AppText>
          </>
        )
      }
    } else {
      if (item.status === 'pending') {
        return (
          <>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {`${item.user.name} `}
            </AppText>
            <AppText textStyle="caption">
              has made an offer on your post.
            </AppText>
          </>
        )
      } else if (item.status === 'confirmed') {
        return (
          <>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">
              accepted your offer on his post.
            </AppText>
          </>
        )
      } else if (item.status === 'declined') {
        return (
          <>
            <AppText textStyle="caption" customStyle={{ fontWeight: 'bold' }}>
              {` ${item.seller.name} `}
            </AppText>
            <AppText textStyle="caption">
              declined your offer on his post.
            </AppText>
          </>
        )
      }
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
          {item.user.uid !== user.uid ? (
            <Avatar
              style={styles.avatar}
              path={item?.user?.profile_photo}
              size="64x64"
            />
          ) : (
            <Avatar
              style={styles.avatar}
              path={item?.seller?.profile_photo}
              size="64x64"
            />
          )}
        </View>
        <View style={styles.captionWrapper}>{renderText()}</View>
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
          onPress={handleViewOrder}>
          <AppText textStyle="button3">View Order</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.invertedButton}
          onPress={handleViewProfile}>
          <AppText textStyle="button3">View Profile</AppText>
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

export default Order
