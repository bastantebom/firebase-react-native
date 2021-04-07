import React, { useContext, useState, useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { formatNumber } from 'react-native-currency-input'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

import { Colors, normalize, timePassedShort } from '@/globals'
import { AppText, MarginView } from '@/components'
import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import SkeletonLoader from '@/screens/Activity/components/skeleton-loader'

const ActivitiesCard = ({ item }) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const [orderLoader, setOrderLoader] = useState(true)
  const [activity, setActivity] = useState(item)

  useEffect(() => {
    ;(async () => {
      if (!activity.orders) {
        let currentActivity = { ...activity }
        const { data } = await Api.getOrders({
          uid: user.uid,
          pid: item.post.id,
        })

        currentActivity.orders = data
        setActivity(currentActivity)
      }

      setOrderLoader(false)
    })()
  }, [])

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const getOrderIcon = type => {
    switch (type) {
      case 'sell':
        return <Icons.SellPost />
      case 'service':
        return <Icons.ServicePost />
      default:
        return <Icons.NeedPost />
    }
  }

  const setStatusBackground = () => {
    const label = setStatusLabel()

    if (
      label === 'Ongoing' ||
      label === 'Ready for Pickup' ||
      label === 'Ready for Delivery' ||
      label === 'Scheduled'
    )
      return Colors.secondaryDarkTangerine
    else if (label === 'Completed') return Colors.secondaryRoyalBlue
    else if (label === 'Declined' || label === 'Cancelled') return Colors.red
    else if (
      label === 'Awating Confirmation ' ||
      label === 'Awating Payment' ||
      label === 'Payment Processing'
    )
      return Colors.neutralsMischka

    return Colors.neutralsMischka
  }

  const setStatusLabel = () => {
    if (activity.post.uid === user.uid) {
      const orderStatus = setOrders()

      if (activity.post.type === 'service' || activity.post.type === 'need') {
        const hasOffers = orderStatus.map(status => status.includes('offers'))

        if (hasOffers) return 'Ongoing'

        return 'Completed'
      } else if (activity.post.type === 'sell') {
        const hasPending = orderStatus.map(status => status.includes('pending'))

        if (hasPending) return 'Ongoing'

        return 'Completed'
      }
    } else {
      if (activity.orders.some(order => order.status === 'pending'))
        return 'Awating Confirmation'
      else if (activity.orders.some(order => order.status === 'confirmed'))
        return 'Awating Payment'
      else if (
        activity.orders.some(order => order.status === 'payment processing')
      )
        return 'Payment Processing'
      else if (activity.orders.some(order => order.status === 'paid'))
        return 'Ready for Delivery/Pickup'
      else if (activity.orders.some(order => order.status === 'delivering'))
        return 'Delivering'
      else if (activity.orders.some(order => order.status === 'completed'))
        return 'Completed'
      else if (activity.orders.some(order => order.status === 'declined'))
        return 'Declined'
    }

    return 'N/A'
  }

  const setOrders = () => {
    if (activity.post.uid !== user.uid) {
      const totalPrice =
        activity?.orders[0]?.items?.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        ) || activity.orders[0].offer

      return ` ₱${formatNumber(totalPrice, {
        separator: '.',
        precision: 2,
        delimiter: ',',
      })}`
    }

    const orderCounts = {}

    if (activity.post.type === 'service') {
      activity.orders.forEach(order => {
        if (['cancelled', 'declined', 'completed'].includes(order.status)) {
          orderCounts.availed = {
            label: 'availed',
            count: orderCounts?.completed?.count + 1 || 1,
          }
        } else {
          orderCounts.offers = {
            label: 'offers',
            count: orderCounts?.offers?.count + 1 || 1,
          }
        }
      })
    } else if (activity.post.type === 'sell') {
      activity.orders.forEach(order => {
        if (['cancelled', 'declined', 'completed'].includes(order.status)) {
          orderCounts.availed = {
            label: 'availed',
            count: orderCounts?.availed?.count + 1 || 1,
          }
        } else {
          orderCounts.pending = {
            label: 'pending request',
            count: orderCounts?.pending?.count + 1 || 1,
          }
        }
      })
    } else {
      activity.orders.forEach(() => {
        orderCounts.offers = {
          label: 'offers',
          count: orderCounts?.offers?.count + 1 || 1,
        }
      })
    }

    return Object.values(orderCounts).map(
      count => ` ${count.count} ${count.label}`
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (item.post.uid === user.uid) {
          navigation.navigate('NBTScreen', {
            screen: 'OngoingItem',
            params: {
              item: activity,
            },
          })
        } else {
          navigation.navigate('orders', {
            screen: 'order-tracker',
            params: {
              orderID: item.orders[0].id,
            },
          })
        }
      }}>
      <MarginView marginSize={1} style={styles.marginView}>
        <View style={styles.postImageContainer}>
          <PostImage
            path={activity.post.cover_photos[0]}
            size="64x64"
            postType={activity.post.type}
          />
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Avatar
                  style={{ height: '100%', width: '100%' }}
                  path={activity?.sellerInfo?.profile_photo}
                  size="64x64"
                />
              </View>
              <AppText textStyle="body3" customStyle={styles.username}>
                {activity?.sellerInfo?.name}
              </AppText>
            </View>
            <AppText
              textStyle="captionConstant"
              color={Colors.contentPlaceholder}>
              {timeAgo(Date.now() / 1000 - activity.post.date_posted._seconds)}
            </AppText>
          </View>

          <View style={styles.statusWrapper}>
            {orderLoader ? (
              <View style={styles.loaderWrapper}>
                <SkeletonLoader isLoading={orderLoader} />
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.statusText,
                    {
                      backgroundColor: setStatusBackground(),
                    },
                  ]}>
                  <AppText textStyle="metadata" color={'white'}>
                    {setStatusLabel()}
                  </AppText>
                </View>
                <AppText textStyle="metadata">{setOrders()}</AppText>
              </>
            )}
          </View>

          <View style={styles.orderTitle}>
            {getOrderIcon(activity.post.type)}
            <AppText
              textStyle="caption2"
              numberOfLines={1}
              customStyle={{ marginLeft: normalize(4) }}>
              {activity.post.title}
            </AppText>
          </View>
        </View>
      </MarginView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  marginView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: normalize(12),
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  postImageContainer: {
    marginRight: normalize(10),
    width: '25%',
    height: normalize(72),
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '71%',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    paddingLeft: normalize(8),
    paddingRight: normalize(4),
    fontSize: normalize(12),
  },
  avatar: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(100),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutralsZirconLight,
  },
  orderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: normalize(40),
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    alignSelf: 'flex-start',
    borderRadius: normalize(100),
    paddingHorizontal: normalize(8),
    marginVertical: normalize(8),
    marginRight: normalize(3),
  },
  loaderWrapper: {
    alignSelf: 'flex-start',
    marginVertical: normalize(8),
    marginRight: normalize(3),
  },
})

export default ActivitiesCard
