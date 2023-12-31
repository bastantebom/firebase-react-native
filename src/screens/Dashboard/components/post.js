import React, { useContext } from 'react'
import { Icons } from '@/assets/images/icons'
import { AppText } from '@/components'
import { Colors, GlobalStyle, normalize, timePassedShort } from '@/globals'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'
import { UserContext } from '@/context/UserContext'
import { getDistance } from 'geolib'

import SkeletonContent from 'react-native-skeleton-content-nonexpo'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import { formatNumber } from 'react-native-currency-input'

/**
 * @param {object} param0
 * @param {boolean} param0.isLoading
 * @param {() => void} param0.onPress
 * @param {() => void} param0.onUserPress
 * @param {() => void} param0.onLikePress
 */
const Post = ({
  data: post,
  isLoading,
  onPress,
  onUserPress,
  onLikePress,
  currentLocation,
  renderLike,
}) => {
  const { user } = useContext(UserContext)

  const renderPostImage = () => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => onPress?.(post)}>
        <View style={styles.postImageContainer}>
          <PostImage
            path={post.cover_photos?.[0]}
            size="128x128"
            postType={post.type}
          />
        </View>
      </TouchableOpacity>
    )
  }

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

  const renderDeliveryMethods = () => {
    const methods = post.shipping_methods || {}
    const objectArray = Object.entries(methods)

    let temp = []

    objectArray.forEach(([key, value]) => {
      if (value.value) {
        if (post.type === 'service') {
          if (key === 'delivery') {
            temp.push('walk-in')
          } else {
            temp.push('appointment')
          }
        } else temp.push(key)
      }
    })

    const deliveryMethods = temp

    return (
      post.type !== 'need' && (
        <View style={GlobalStyle.rowCenter}>
          <Icons.TransportationBox
            width={normalize(16)}
            height={normalize(16)}
          />

          <AppText
            textStyle="eyebrow2"
            customStyle={{
              color: Colors.contentEbony,
              marginLeft: 4,
              textTransform: 'capitalize',
            }}>
            {deliveryMethods.length ? deliveryMethods.join(' and ') : 'not set'}
          </AppText>
        </View>
      )
    )
  }

  const renderPrice = () => {
    return (
      <AppText
        textStyle="price"
        customStyle={{ marginBottom: normalize(10) }}
        color={Colors.secondaryMountainMeadow}>
        {getPrice()}
      </AppText>
    )
  }

  const renderLocation = () => {
    const city = post.location?.city

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
      <View
        style={[
          GlobalStyle.rowCenter,
          GlobalStyle.marginBottom1,
          { flexWrap: 'wrap' },
        ]}>
        <View style={[GlobalStyle.rowCenter, { marginRight: normalize(18) }]}>
          <Icons.NavigationPin
            style={{ color: '#F56770' }}
            width={normalize(16)}
            height={normalize(16)}
          />
          <AppText
            textStyle="eyebrow2"
            color={Colors.contentPlaceholder}
            customStyle={{ marginLeft: 4 }}>
            {city}
          </AppText>
        </View>
        {distanceInMeters !== null ? (
          <View style={GlobalStyle.rowCenter}>
            <Icons.Direction
              style={{ color: '#F56770' }}
              width={normalize(16)}
              height={normalize(16)}
            />
            <AppText
              textStyle="eyebrow2"
              color={Colors.contentPlaceholder}
              customStyle={{ marginLeft: 4 }}>
              {distance}
            </AppText>
          </View>
        ) : null}
      </View>
    )
  }

  const renderPostDetails = () => {
    return (
      <View style={styles.postDetailsContainer}>
        <TouchableOpacity activeOpacity={1} onPress={() => onPress?.(post)}>
          <AppText
            textStyle="body2Dashboard"
            customStyle={{ marginBottom: normalize(10) }}>
            {post.title}
          </AppText>
          {renderPrice()}
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {renderLocation()}
        {renderDeliveryMethods()}
      </View>
    )
  }
  const renderPostHeader = () => {
    return post?.user ? (
      <PostHeader
        post={post}
        liked={post.likes?.includes(user?.uid)}
        onAvatarPress={() => onUserPress?.(post)}
        onNamePress={() => onUserPress?.(post)}
        onLikePress={() => onLikePress?.(post)}
        renderLike={renderLike}
      />
    ) : null
  }

  return (
    <PostSkeleton isLoading={!!isLoading}>
      <View style={styles.container}>
        {renderPostHeader()}
        <View style={styles.postContainer}>
          {renderPostImage()}
          {renderPostDetails()}
        </View>
      </View>
    </PostSkeleton>
  )
}

/**
 * @param {object} param0
 * @param {object} param0.post
 * @param {boolean} param0.liked
 * @param {() => void} param0.onAvatarPress
 * @param {() => void} param0.onNamePress
 */
const PostHeader = ({
  post,
  liked,
  onAvatarPress,
  onNamePress,
  onLikePress,
  renderLike: _renderLike,
}) => {
  const { full_name, display_name, profile_photo, account_verified } = post.user

  const name = display_name || full_name
  const timePassed = time => timePassedShort(Date.now() / 1000 - time) + ' ago'

  const renderLike =
    _renderLike ||
    (() => (
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}>
        <TouchableOpacity onPress={() => onLikePress(post)} activeOpacity={1}>
          {liked ? (
            <Icons.LikeColored width={normalize(24)} height={normalize(24)} />
          ) : (
            <Icons.Like width={normalize(24)} height={normalize(24)} />
          )}
        </TouchableOpacity>
      </View>
    ))

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onAvatarPress?.()}
          style={{
            height: normalize(32),
            width: normalize(32),
            borderRadius: normalize(33 / 2),
            overflow: 'hidden',
            alignSelf: 'center',
            borderColor: Colors.neutralsZirconLight,
            borderWidth: 1,
          }}>
          <Avatar
            style={{ height: '100%', width: '100%' }}
            path={profile_photo}
            size="64x64"
          />
        </TouchableOpacity>

        <View style={{ marginLeft: 8, justifyContent: 'center' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onNamePress?.()}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'RoundedMplus1c-Medium',
                fontSize: normalize(12),
                lineHeight: normalize(18),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {name}
            </Text>

            {account_verified ? (
              <Icons.Verified
                style={{ marginLeft: normalize(4) }}
                width={normalize(10)}
                height={normalize(10)}
              />
            ) : null}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: Colors.contentPlaceholder,
                fontFamily: 'RoundedMplus1c-Regular',
                fontSize: normalize(12),
                lineHeight: normalize(18),
              }}>
              {timePassed(post.date_posted?._seconds)}
            </Text>

            <Text
              style={{
                paddingLeft: normalize(4),
                color: Colors.contentPlaceholder,
                fontFamily: 'RoundedMplus1c-Regular',
                fontSize: normalize(12),
                lineHeight: normalize(18),
              }}>
              • in
            </Text>

            <Text
              style={{
                paddingHorizontal: 4,
                fontFamily: 'RoundedMplus1c-Regular',
                fontSize: normalize(12),
                lineHeight: normalize(18),
                color:
                  post.type === 'service'
                    ? Colors.secondaryBrinkPink
                    : post.type === 'sell'
                    ? Colors.contentOcean
                    : Colors.secondaryMountainMeadow,
              }}>
              {`${post.type.slice(0, 1).toUpperCase()}${post.type.slice(1)}`}
            </Text>
          </View>
        </View>
      </View>

      {renderLike()}
    </View>
  )
}

/**
 *
 * @param {object} param0
 * @param {boolean} param0.isLoading
 */
const PostSkeleton = ({ children, isLoading }) => {
  return (
    <SkeletonContent
      containerStyle={{ flexDirection: 'column' }}
      isLoading={isLoading}
      layout={[
        {
          flexDirection: 'row',
          padding: normalize(16),
          paddingBottom: normalize(8),
          children: [
            {
              height: normalize(32),
              width: normalize(32),
              borderRadius: normalize(32 / 2),
              overflow: 'hidden',
            },
            {
              marginLeft: normalize(8),
              justifyContent: 'center',
              children: [
                {
                  width: normalize(100),
                  height: normalize(14),
                  marginBottom: normalize(4),
                },
                {
                  width: normalize(150),
                  height: normalize(12),
                },
              ],
            },
          ],
        },
        {
          flexDirection: 'row',
          paddingHorizontal: normalize(16),
          paddingBottom: normalize(16),
          borderBottomWidth: normalize(1),
          borderBottomColor: Colors.neutralsZircon,

          children: [
            {
              width: normalize(122),
              height: normalize(126),
            },
            {
              paddingLeft: normalize(8),
              children: [
                {
                  width: normalize(213),
                  height: normalize(21),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(40),
                  height: normalize(18),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(213),
                  height: normalize(1),
                  marginVertical: normalize(8),
                },
                {
                  width: normalize(180),
                  height: normalize(21),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(140),
                  height: normalize(21),
                  marginBottom: normalize(8),
                },
              ],
            },
          ],
        },
      ]}>
      {children}
    </SkeletonContent>
  )
}

export default Post

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: Colors.neutralsZircon,
    borderBottomWidth: 1,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
  },
  postContainer: {
    width: '100%',
    paddingTop: normalize(8),
    flexDirection: 'row',
  },
  postImageContainer: {
    width: normalize(125),
    height: normalize(125),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postDetailsContainer: {
    flex: 1,
    marginLeft: normalize(9),
  },
  divider: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginBottom: normalize(10),
  },
})
