import React, { useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Divider } from 'react-native-paper'
import { getDistance } from 'geolib'
import { cloneDeep } from 'lodash'

import { UserContext } from '@/context/UserContext'
import { commaSeparate } from '@/globals/Utils'
import { Colors, normalize, timePassedShort } from '@/globals'

import { Icons } from '@/assets/images/icons'
import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import SkeletonLoader from '@/screens/Dashboard/components/Newsfeed/skeleton-loader'

/** @param {Object} param0 */
const NewsFeed = ({ props }) => {
  const navigation = useNavigation()

  const { noMorePost, posts, locationData, handleLikePress } = props
  const { user } = useContext(UserContext)

  const getPrice = post => {
    const prices = post.price_range
      ? [post.price_range.min, post.price_range.max]
      : post.items.map(
          item => parseFloat((item.price + '').replace(/,/g, '')) || 0
        )

    return prices.length === 1
      ? `₱${commaSeparate(prices[0])}`
      : `₱${commaSeparate(Math.min(...prices))} - ₱${commaSeparate(
          Math.max(...prices)
        )}`
  }

  const getPostDistance = (post, currentLocation) => {
    const { latitude, longitude } = post.store_details?.location || {}
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

  const getDeliveryMethod = post => {
    const methods = post.delivery_methods || {}
    const objectArray = Object.entries(methods)
    const temp = []

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

    return temp
  }

  return (
    <>
      {posts.map((post, index) => {
        return (
          <View key={index} style={styles.container}>
            <TouchableOpacity
              style={styles.postHeaderContainer}
              onPress={() => {
                if (user?.uid === post?.uid) {
                  navigation.navigate('TabStack', { screen: 'You' })
                } else {
                  navigation.navigate('NBTScreen', {
                    screen: 'OthersProfile',
                    params: { uid: post?.uid },
                  })
                }
              }}>
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
                      {`${post.type.slice(0, 1).toUpperCase()}${post.type.slice(
                        1
                      )}`}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    handleLikePress(post)
                  }}>
                  {post?.likes?.includes(user?.uid) ? (
                    <Icons.LikeColored
                      width={normalize(24)}
                      height={normalize(24)}
                    />
                  ) : (
                    <Icons.Like width={normalize(24)} height={normalize(24)} />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postContainer}
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'OthersPost',
                  params: {
                    data: post,
                    viewing: true,
                    created: false,
                    edited: false,
                    othersView: user?.uid !== post.uid,
                  },
                })
              }>
              <View style={styles.postImageContainer}>
                <PostImage
                  path={post.cover_photos?.[0]}
                  size="120x120"
                  postType={post.type}
                />
              </View>
              <View style={styles.postDetailsContainer}>
                <View style={{ width: '100%' }}>
                  <AppText numberOfLines={2} customStyle={styles.postTitle}>
                    {post.title}
                  </AppText>
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
                    <AppText
                      textStyle="eyebrow2"
                      color={Colors.contentPlaceholder}
                      customStyle={{ marginLeft: 4 }}>
                      {post.store_details.location.city || 'N/A'}
                    </AppText>
                  </View>
                  <View style={styles.postDistance}>
                    <Icons.Direction
                      style={{ color: '#F56770' }}
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                    <AppText
                      textStyle="eyebrow2"
                      color={Colors.contentPlaceholder}
                      customStyle={{ marginLeft: 4 }}>
                      {getPostDistance(post, locationData)}
                    </AppText>
                  </View>
                </View>
                {post.type !== 'need' && (
                  <View style={styles.deliveryMethodContainer}>
                    <Icons.TransportationBox
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                    <AppText
                      textStyle="eyebrow2"
                      customStyle={styles.deliveryMethodText}>
                      {getDeliveryMethod(post).length
                        ? getDeliveryMethod(post).join(' and ')
                        : 'not set'}
                    </AppText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        )
      })}
      {noMorePost && (
        <Text style={styles.noMorePost}>No More Posts Available</Text>
      )}
    </>
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
    color: Colors.contentPlaceholder,
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
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(15),
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
  },
  deliveryMethodText: {
    marginLeft: 4,
    color: Colors.contentEbony,
    textTransform: 'capitalize',
  },
  divider: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
  },
  noMorePost: {
    margin: normalize(20),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    textAlign: 'center',
  },
})

export default NewsFeed
