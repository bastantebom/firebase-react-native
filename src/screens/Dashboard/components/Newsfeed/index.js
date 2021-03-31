import React, { useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Divider } from 'react-native-paper'
import { getDistance } from 'geolib'

import { UserContext } from '@/context/UserContext'
import { iconSize } from '@/globals/Utils'
import { Colors, normalize, timePassedShort } from '@/globals'

import { Icons } from '@/assets/images/icons'
import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import SkeletonLoader from '@/screens/Dashboard/components/Newsfeed/skeleton-loader'
import typography from '@/globals/typography'
import { formatNumber } from 'react-native-currency-input'

/** @param {Object} param0 */
const NewsFeed = ({ props }) => {
  const navigation = useNavigation()

  const { item: post, locationData, handleLikePress } = props
  const { user } = useContext(UserContext)

  const getPrice = post => {
    const prices = [
      ...new Set(
        post.budget
          ? [post.budget.minimum, post.budget.maximum]
          : post?.items?.map(item =>
              typeof item.price === 'string'
                ? parseFloat(item.price.replace(/,/g, ''))
                : item.price
            )
      ),
    ]

    return prices.length === 1
      ? `₱${formatNumber(prices[0], {
          separator: '.',
          precision: 2,
          delimiter: ',',
        })}`
      : `₱${formatNumber(Math.min(...prices), {
          separator: '.',
          precision: 2,
          delimiter: ',',
        })} - ₱${formatNumber(Math.max(...prices), {
          separator: '.',
          precision: 2,
          delimiter: ',',
        })}`
  }

  const getPostDistance = (post, currentLocation) => {
    const { latitude, longitude } = post.location || {}
    const distanceInMeters =
      currentLocation?.latitude &&
      currentLocation?.longitude &&
      latitude &&
      longitude
        ? getDistance(currentLocation, { latitude, longitude })
        : null

    const distance =
      distanceInMeters > 1100
        ? (distanceInMeters / 1000).toFixed(0) + 'km'
        : distanceInMeters + 'm'

    return distance
  }

  const postTypeLabel = {
    sell: 'Selling',
    need: 'Need',
    service: 'Service',
  }

  const handleOnPostPress = post => {
    navigation.navigate('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'published-post',
        params: {
          id: post.id,
          uid: post.uid,
        },
      },
    })
  }

  const handleOnUserPress = () => {
    if (user?.uid === post?.uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: post?.uid },
      })
    }
  }

  const renderShippingMethods = () => {
    if (post.type === 'need') return null

    const renderIcon = () => {
      const iconProps = {
        style: { color: Colors.secondaryLavenderBlue },
        ...iconSize(16),
      }
      if (post.shipping_methods?.delivery) {
        return <Icons.Truck {...iconProps} />
      } else if (post.shipping_methods?.pickup) {
        return <Icons.Pickup {...iconProps} />
      } else if (post.booking_methods?.appointment) {
        return <Icons.Appointment {...iconProps} />
      } else if (post.booking_methods?.walkin) {
        return <Icons.Store {...iconProps} />
      }
    }

    const shippingMethodLabels = {
      pickup: 'Pick up',
      delivery: 'Delivery',
    }

    const bookingMethodLabels = {
      walkin: 'Walk-in',
      appointment: 'By Appointment',
    }

    const label = (() => {
      if (post.type === 'sell')
        return Object.keys(post.shipping_methods || {})
          .map(method => shippingMethodLabels[method])
          .join(' and ')
      else if (post.type === 'service')
        return Object.keys(post.booking_methods || {})
          .map(method => bookingMethodLabels[method])
          .join(' and ')
    })()

    return (
      <View style={styles.deliveryMethodContainer}>
        {renderIcon()}
        <Text style={[typography.eyebrow, styles.deliveryMethodLabel]}>
          {label}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.postHeaderContainer}
        activeOpacity={0.7}
        onPress={handleOnUserPress}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Avatar
              style={{ height: '100%', width: '100%' }}
              path={post?.user?.profile_photo}
              size="64x64"
            />
          </View>
          <View>
            <View>
              <Text style={styles.username}>
                {post?.user?.full_name || post?.user?.display_name}
              </Text>
              {post?.user?.account_verified && (
                <Icons.Verified
                  style={{ marginLeft: normalize(4) }}
                  width={normalize(10)}
                  height={normalize(10)}
                />
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.timePassed}>
                {timePassedShort(
                  Date.now() / 1000 - post.date_posted?._seconds
                ) + ' ago'}
              </Text>
              <Text style={styles.in}>• in</Text>
              <Text
                style={{
                  ...styles.type,
                  color:
                    post.type === 'service'
                      ? Colors.secondaryBrinkPink
                      : post.type === 'sell'
                      ? Colors.contentOcean
                      : Colors.secondaryMountainMeadow,
                }}>
                {postTypeLabel[post.type]}
              </Text>
            </View>
          </View>
        </View>
        <View>
          {post.$likedLoader ? (
            <SkeletonLoader type="liked" isLoading={true} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                handleLikePress(post)
              }}>
              {post?.likes?.includes(user?.uid) ? (
                <Icons.LikeColored
                  width={normalize(24)}
                  height={normalize(24)}
                />
              ) : (
                <Icons.Like
                  style={{ color: Colors.icon }}
                  width={normalize(24)}
                  height={normalize(24)}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.postContainer}
        activeOpacity={0.7}
        onPress={() => handleOnPostPress(post)}>
        <View style={styles.postImageContainer}>
          <PostImage
            path={post.cover_photos?.[0]}
            size="128x128"
            postType={post.type}
          />
        </View>
        <View style={styles.postDetailsContainer}>
          <View style={{ width: '100%' }}>
            <Text
              style={[typography.body2, styles.postTitle]}
              numberOfLines={2}>
              {post.title}
            </Text>
            <AppText
              customStyle={styles.postPrice}
              color={Colors.secondaryMountainMeadow}>
              {getPrice(post)}
            </AppText>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.locationContainer}>
            <View style={styles.postLocation}>
              <Icons.NavigationPin
                style={{ color: '#F56770' }}
                width={normalize(16)}
                height={normalize(16)}
              />
              <Text
                style={[
                  typography.eyebrow,
                  {
                    marginLeft: normalize(4),
                    color: Colors.contentPlaceholder,
                  },
                ]}>
                {post.location?.city || 'N/A'}
              </Text>
            </View>
            <View style={styles.postDistance}>
              <Icons.Direction
                style={{ color: '#F56770' }}
                width={normalize(16)}
                height={normalize(16)}
              />
              <Text
                style={[
                  typography.eyebrow,
                  {
                    marginLeft: normalize(4),
                    color: Colors.contentPlaceholder,
                  },
                ]}>
                {getPostDistance(post, locationData)}
              </Text>
            </View>
          </View>
          {renderShippingMethods()}
        </View>
      </TouchableOpacity>
      <Divider style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: normalize(20),
    width: '100%',
  },
  postHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  userInfo: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: normalize(8),
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(33 / 2),
    borderColor: Colors.neutralsZirconLight,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  username: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePassed: {
    marginRight: normalize(5),
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
  },
  in: {
    paddingLeft: normalize(4),
    color: Colors.neutralsMischka,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
  },
  type: {
    paddingHorizontal: 4,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
  },
  postContainer: {
    flexDirection: 'row',
    marginTop: normalize(10),
    marginBottom: normalize(20),
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  postImageContainer: {
    overflow: 'hidden',
    marginRight: normalize(10),
    width: normalize(125),
    height: normalize(125),
    borderRadius: 8,
  },
  postDetailsContainer: {
    width: Dimensions.get('window').width - normalize(165),
  },
  postTitle: {
    marginBottom: normalize(5),
  },
  postPrice: {
    marginBottom: normalize(10),
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  postLocation: {
    flexDirection: 'row',
    marginRight: normalize(10),
  },
  postDistance: {
    flexDirection: 'row',
  },
  deliveryMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryMethodLabel: {
    marginLeft: 4,
    color: Colors.contentPlaceholder,
  },
  divider: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
  },
  icon: {
    width: normalize(16),
    height: normalize(16),
  },
})

export default NewsFeed
