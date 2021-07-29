import React, { useContext, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { formatNumber } from 'react-native-currency-input'
import { useNavigation } from '@react-navigation/native'

import { UserContext } from '@/context/UserContext'

import { Colors, normalize, timePassedShort } from '@/globals'
import { AppText, MarginView } from '@/components'
import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'

const ActivitiesCard = ({ item }) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const [activity] = useState(item)

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
    const capitalize = word => {
      if (word === 'pending') return 'Awating Confirmation'

      return word.split(' ').map(item => {
        return item[0].toUpperCase() + item.slice(1, item.length)
      })[0]
    }

    if (activity.order_id) return capitalize(activity.order.status)

    if (
      activity.pending_requests ||
      (!activity.pending_requests && !activity.availed)
    )
      return 'Ongoing'
    else return 'Completed'
  }

  const setOrders = () => {
    if (activity.category === 'my order') {
      const totalPrice =
        activity?.order?.items?.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        ) || activity.order.offer

      return ` ₱${formatNumber(totalPrice, {
        separator: '.',
        precision: 2,
        delimiter: ',',
      })}`
    }

    let label = ''
    if (!!activity.availed) label = label + `${activity.availed} availed `
    if (!!activity.pending_requests)
      label = label + `${activity.pending_requests} pending`

    return label
  }

  const handleUserPress = () => {
    if (user.uid === item.user.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile',
          params: { uid: item.user.uid },
        },
      })
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (item?.post?.uid === user.uid) {
          navigation.navigate('NBTScreen', {
            screen: 'OngoingItem',
            params: {
              activity: item,
            },
          })
        } else {
          navigation.navigate('orders', {
            screen: 'order-tracker',
            params: {
              orderID: item.order.id,
            },
          })
        }
      }}>
      <MarginView marginSize={1} style={styles.marginView}>
        <View style={styles.postImageContainer}>
          <PostImage
            path={
              activity?.post?.cover_photos[0] ||
              activity?.order?.post?.cover_photos[0]
            }
            size="64x64"
            postType={activity?.post?.type || activity?.order?.post?.type}
          />
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.userInfoWrapper}>
            <TouchableOpacity onPress={handleUserPress} activeOpacity={1}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Avatar
                    style={{ height: '100%', width: '100%' }}
                    path={activity?.user?.profile_photo}
                    size="64x64"
                  />
                </View>
                <AppText textStyle="body3" customStyle={styles.username}>
                  {activity?.user?.display_name ||
                    activity?.user?.full_name ||
                    activity?.user?.username}
                </AppText>
              </View>
            </TouchableOpacity>
            <AppText
              textStyle="captionConstant"
              color={Colors.contentPlaceholder}>
              {timeAgo(Date.now() / 1000 - (activity?.date?._seconds || 0))}
            </AppText>
          </View>

          <View style={styles.statusWrapper}>
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
          </View>

          <View style={styles.orderTitle}>
            {getOrderIcon(activity?.post?.type || activity?.order?.post?.type)}
            <AppText
              textStyle="caption2"
              numberOfLines={1}
              customStyle={{ marginLeft: normalize(4) }}>
              {activity?.post?.title || activity?.order?.post?.title}
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
