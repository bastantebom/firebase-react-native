import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import { UserContext } from '@/context/UserContext'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize, normalize, timePassedShort } from '@/globals/Utils'
import { getDistance } from 'geolib'
import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { formatNumber } from 'react-native-currency-input'

/**
 * @param {object} props
 * @property {object} props.post
 * @property {function} props.onUserPress
 * @property {function} props.onPostPress
 * @property {function} props.onCardPress
 * @property {import('react-native').StyleProp<import('react-native').ViewStyle>} props.thumbnailStyle
 * @property {import('react-native').StyleProp<import('react-native').ViewStyle>} props.containerStyle
 */
const PostCard = React.memo(
  ({
    post,
    onUserPress,
    onPostPress,
    onCardPress,
    onLikePress,
    currentLocation,
    thumbnailStyle,
    containerStyle,
  }) => {
    const { user } = useContext(UserContext)

    const renderPostHeader = () => {
      const postTypeLabel = {
        sell: 'Selling',
        need: 'Need',
        service: 'Service',
      }

      const postTypeColor = {
        sell: Colors.secondaryRoyalBlue,
        need: Colors.secondaryMountainMeadow,
        service: Colors.secondaryBrinkPink,
      }

      return (
        <View style={styles.postHeader}>
          <TouchableOpacity
            disabled={!onUserPress}
            onPress={() => onUserPress?.()}
            activeOpacity={0.7}
            style={styles.avatarWrapper}>
            <Avatar
              style={{ height: '100%', width: '100%' }}
              path={post.user?.profile_photo}
              size="64x64"
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              disabled={!onUserPress}
              onPress={() => onUserPress?.()}
              activeOpacity={0.7}
              style={[utilStyles.row, utilStyles.alignCenter]}>
              <Text style={[typography.caption, typography.medium]}>
                {post.user?.full_name}
              </Text>
              {!!post.user?.account_verified && (
                <Icons.Verified style={styles.verifiedIcon} {...iconSize(16)} />
              )}
            </TouchableOpacity>
            <View style={[utilStyles.row, utilStyles.alignCenter]}>
              {!!post.date_posted && (
                <>
                  <Text
                    style={[
                      typography.caption,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    {timePassedShort(
                      Date.now() / 1000 - post.date_posted._seconds
                    )}{' '}
                    ago
                  </Text>
                  <Text
                    style={[
                      typography.eyebrow,
                      typography.medium,
                      { color: Colors.neutralsMischka },
                    ]}>
                    {' '}
                    •{' '}
                  </Text>
                </>
              )}
              <Text
                style={[typography.caption, { color: Colors.neutralsMischka }]}>
                in{' '}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: postTypeColor[post.type] },
                ]}>
                {postTypeLabel[post.type]}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={!onLikePress}
            style={styles.likeButton}
            activeOpacity={0.7}
            onPress={() => onLikePress(post)}>
            {!post.likes?.includes?.(user?.uid) ? (
              <Icons.Like style={{ color: Colors.icon }} {...iconSize(24)} />
            ) : (
              <Icons.LikeActive
                style={{ color: Colors.icon }}
                {...iconSize(24)}
              />
            )}
          </TouchableOpacity>
        </View>
      )
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
        <View style={styles.shippingMethod}>
          {renderIcon()}
          <Text style={[typography.eyebrow, styles.shippingMethodLabel]}>
            {label}
          </Text>
        </View>
      )
    }

    const renderPostContent = () => {
      const getPrice = () => {
        const prices = [
          ...new Set(
            post.budget
              ? [post.budget.minimum, post.budget.maximum]
              : post.items?.map(item => item.price)
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

      return (
        <TouchableOpacity
          disabled={!onPostPress}
          onPress={() => onPostPress?.()}
          activeOpacity={0.7}
          style={styles.postContent}>
          <View style={[styles.thumbnailContainer, thumbnailStyle]}>
            <PostImage
              path={post.cover_photos?.[0]}
              size="128x128"
              postType={post.type}
            />
          </View>
          <View style={styles.postInfo}>
            <Text style={typography.body2} numberOfLines={2}>
              {post.title}
            </Text>
            <Text style={[typography.caption, typography.medium, styles.price]}>
              {getPrice()}
            </Text>

            <View style={styles.locationWrapper}>
              <View style={styles.city}>
                <Icons.NavigationPin
                  style={{ color: '#F56770' }}
                  width={normalize(16)}
                  height={normalize(16)}
                />
                <Text
                  style={[
                    typography.eyebrow,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  {post.location?.city}
                </Text>
              </View>
              {distanceInMeters !== null ? (
                <View style={styles.distance}>
                  <Icons.Direction
                    style={{ color: '#F56770' }}
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                  <Text
                    style={[
                      typography.eyebrow,
                      {
                        color: Colors.contentPlaceholder,
                        marginLeft: normalize(4),
                      },
                    ]}>
                    {distance}
                  </Text>
                </View>
              ) : null}
            </View>
            {renderShippingMethods()}
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        disabled={!onCardPress}
        onPress={() => onCardPress?.()}
        activeOpacity={0.7}
        style={[styles.container, containerStyle]}>
        {renderPostHeader()}
        {renderPostContent()}
      </TouchableOpacity>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.post === nextProps.post &&
      prevProps.onUserPress === nextProps.onUserPress &&
      prevProps.onPostPress === nextProps.onPostPress &&
      prevProps.onCardPress === nextProps.onCardPress &&
      prevProps.onLikePress === nextProps.onLikePress &&
      prevProps.currentLocation === nextProps.currentLocation &&
      prevProps.thumbnailStyle === nextProps.thumbnailStyle &&
      prevProps.containerStyle === nextProps.containerStyle
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarWrapper: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    overflow: 'hidden',
    marginRight: normalize(8),
  },
  verifiedIcon: {
    marginLeft: normalize(4),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: normalize(125),
    height: normalize(125),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postContent: {
    marginTop: normalize(12),
    flexDirection: 'row',
  },
  postInfo: {
    marginLeft: normalize(11),
    flex: 1,
  },
  price: {
    color: Colors.secondaryMountainMeadow,
    paddingVertical: normalize(8),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralsZirconLight,
  },
  locationWrapper: {
    marginTop: normalize(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  city: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(8),
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingMethod: {
    flexDirection: 'row',
    marginTop: normalize(8),
  },
  shippingMethodLabel: {
    marginLeft: 4,
    color: Colors.contentPlaceholder,
  },
  likeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
})

export default PostCard
