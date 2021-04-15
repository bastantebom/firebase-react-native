import React, { useContext } from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'

import { PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import typography from '@/globals/typography'

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
        <Text style={typography.caption}>
          <Text style={[typography.caption, typography.bold]}>
            {`${item.seller.name} `}
          </Text>
          failed. Please try again.
        </Text>
      )
    } else if (item.status === 'paid') {
      return (
        <Text style={typography.caption}>
          Successfully paid to
          <Text style={[typography.caption, typography.bold]}>
            {` ${item.seller.name}`}
          </Text>
        </Text>
      )
    }

    if (item.post_type === 'sell') {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={[typography.caption, typography.bold]}>
              {`${item.user.name} `}
            </Text>
            reqested an order on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <Text style={typography.caption}>
              Your order from
              <Text style={[typography.caption, typography.bold]}>
                {` ${item.seller.name} `}
              </Text>
              has been accepted. Proceed to payment to complete your order
            </Text>
          )
        } else {
          return (
            <Text style={typography.caption}>
              Your order from
              <Text style={[typography.caption, typography.bold]}>
                {` ${item.seller.name} `}
              </Text>
              has been accepted.
            </Text>
          )
        }
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been declined.
          </Text>
        )
      } else if (item.status === 'cancelled') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been cancelled.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been completed.
          </Text>
        )
      }
    } else if (item.post_type === 'service') {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={[typography.caption, typography.bold]}>
              {`${item.user.name} `}
            </Text>
            reqested a booking on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <Text style={typography.caption}>
              Your booking from
              <Text style={[typography.caption, typography.bold]}>
                {` ${item.seller.name} `}
              </Text>
              has been accepted. Proceed to payment to complete your booking
            </Text>
          )
        } else {
          return (
            <Text style={typography.caption}>
              Your booking from
              <Text style={[typography.caption, typography.bold]}>
                {` ${item.seller.name} `}
              </Text>
              has been accepted.
            </Text>
          )
        }
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been declined.
          </Text>
        )
      } else if (item.status === 'cancelled') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been cancelled.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been completed.
          </Text>
        )
      }
    } else {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={[typography.caption, typography.bold]}>
              {`${item.user.name} `}
            </Text>
            has made an offer on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        return (
          <Text style={typography.caption}>
            <Text style={[typography.caption, typography.bold]}>
              {`${item.seller.name} `}
            </Text>
            accepted your offer on his post.
          </Text>
        )
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            <Text style={[typography.caption, typography.bold]}>
              {`${item.seller.name} `}
            </Text>
            declined your offer on his post.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your offer from{' '}
            <Text style={[typography.caption, typography.bold]}>
              {` ${item.seller.name} `}
            </Text>
            has been completed.
          </Text>
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

export default Order
