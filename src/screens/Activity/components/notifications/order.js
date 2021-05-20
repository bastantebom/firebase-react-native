import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

import { PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import typography from '@/globals/typography'

const Order = ({ unreadNotification, item }) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)
  const [buyerInfo, setBuyerInfo] = useState({})
  const [sellerInfo, setSellerInfo] = useState({})

  const timeAgo = time => timePassedShort(time)

  const handleViewProfile = () => {
    if (!item.read) unreadNotification(item.id)

    if (sellerInfo.uid === user.uid) {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: buyerInfo.uid },
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: sellerInfo.uid },
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
          <Text style={typography.medium}>{`${
            sellerInfo?.display_name || sellerInfo?.full_name || ''
          } `}</Text>
          failed. Please try again.
        </Text>
      )
    } else if (item.status === 'paid') {
      return (
        <Text style={typography.caption}>
          Successfully paid to
          <Text style={typography.medium}>{` ${
            sellerInfo?.display_name || sellerInfo?.full_name || ''
          }`}</Text>
        </Text>
      )
    }

    if (item.post_type === 'sell') {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={typography.medium}>{`${
              buyerInfo?.display_name || buyerInfo?.full_name || ''
            } `}</Text>
            requested an order on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <Text style={typography.caption}>
              Your order from
              <Text style={typography.medium}>{` ${
                sellerInfo?.display_name || sellerInfo?.full_name || ''
              } `}</Text>
              has been accepted. Proceed to payment to complete your order
            </Text>
          )
        } else {
          return (
            <Text style={typography.caption}>
              Your order from
              <Text style={typography.medium}>{` ${
                sellerInfo?.display_name || sellerInfo?.full_name || ''
              } `}</Text>
              has been accepted.
            </Text>
          )
        }
      } else if (item.status === 'delivering') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            is being delivered.
          </Text>
        )
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been declined.
          </Text>
        )
      } else if (item.status === 'cancelled') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been cancelled.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your order from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been completed.
          </Text>
        )
      }
    } else if (item.post_type === 'service') {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={typography.medium}>{`${
              buyerInfo?.display_name || buyerInfo?.full_name || ''
            } `}</Text>
            reqested a booking on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        if (item.payment_method === 'cash') {
          return (
            <Text style={typography.caption}>
              Your booking from
              <Text style={typography.medium}>{` ${
                sellerInfo?.display_name || sellerInfo?.full_name || ''
              } `}</Text>
              has been accepted. Proceed to payment to complete your booking
            </Text>
          )
        } else {
          return (
            <Text style={typography.caption}>
              Your booking from
              <Text style={typography.medium}>{` ${
                sellerInfo?.display_name || sellerInfo?.full_name || ''
              } `}</Text>
              has been accepted.
            </Text>
          )
        }
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been declined.
          </Text>
        )
      } else if (item.status === 'cancelled') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been cancelled.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your booking from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been completed.
          </Text>
        )
      }
    } else {
      if (item.status === 'pending') {
        return (
          <Text style={typography.caption}>
            <Text style={typography.medium}>{`${
              buyerInfo?.display_name || buyerInfo?.full_name || ''
            } `}</Text>
            has made an offer on your post.
          </Text>
        )
      } else if (item.status === 'confirmed') {
        return (
          <Text style={typography.caption}>
            <Text style={typography.medium}>{`${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            accepted your offer on his post.
          </Text>
        )
      } else if (item.status === 'declined') {
        return (
          <Text style={typography.caption}>
            <Text style={typography.medium}>{`${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            declined your offer on his post.
          </Text>
        )
      } else if (item.status === 'completed') {
        return (
          <Text style={typography.caption}>
            Your offer from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been completed.
          </Text>
        )
      } else if (item.status === 'cancelled') {
        return (
          <Text style={typography.caption}>
            Your offer from
            <Text style={typography.medium}>{` ${
              sellerInfo?.display_name || sellerInfo?.full_name || ''
            } `}</Text>
            has been cancelled.
          </Text>
        )
      }
    }
  }

  const profilePhoto = [
    'payment failed',
    'paid',
    'confirmed',
    'delivering',
    'declined',
    'cancelled',
    'completed',
  ].includes(item.status)
    ? sellerInfo?.profile_photo
    : buyerInfo?.profile_photo

  const loadUser = async () => {
    try {
      const [buyer, seller] = await Promise.all([
        Api.getUser({ uid: item.buyer_id }),
        Api.getUser({ uid: item.seller_id }),
      ])

      if (!buyer.success || !seller.success) throw new Error(response.message)

      setBuyerInfo(buyer.data)
      setSellerInfo(seller.data)
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <View
      style={{
        ...styles.notification,
        backgroundColor: !item?.read ? '#F2F7FF' : '#FBFBFB',
      }}>
      <View style={styles.holder}>
        <View style={styles.avatarHolder}>
          <Avatar style={styles.avatar} path={profilePhoto} size="64x64" />
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
