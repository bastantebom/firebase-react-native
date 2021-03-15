import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { Colors, GlobalStyle, timePassed, normalize } from '@/globals'
import { PaddingView, AppText, ProfileInfo } from '@/components'
import { UserContext } from '@/context/UserContext'
import {
  Verified,
  NavigationPinRed,
  TransportationBox,
  Like,
  LikeColored,
} from '@/assets/images/icons'

import LoadingScreen from './loading'
import { PostService } from '@/services'
import { commaSeparate } from '@/globals/Utils'
import PostImage from './post-image'

const Post = ({ data, type, isLoading, toggleLikePost, toggleMenu }) => {
  const { user } = useContext(UserContext)

  const {
    user: { display_name, profile_photo, account_verified },
    date_posted,
    available,
    payment_method,
    store_details: {
      schedule,
      location: { city, province, country },
    },
    title,
    username,
    delivery_methods,
    description,
    items,
    uid,
    id,
    cover_photos,
    email,
    phone_number,
    is_multiple,
    full_name,
    price,
    likers,
    post_id,
    price_range,
  } = data

  const post_type = data?.type

  const isLiked = ~likers?.indexOf(user?.uid)
  const [likePost, setLikePost] = useState(isLiked)

  const toggleLike = async () => {
    const res = await PostService.likeUnlike(id, isLiked)
    setLikePost(!likePost)
  }

  const userInfo = {
    username,
    profile_photo,
    account_verified,
    display_name: display_name ? display_name : full_name,
    date_posted,
    uid,
    post_type,
  }

  const navigation = useNavigation()

  const navToPost = () => {
    if (type === 'liked') {
      toggleLikePost()
      toggleMenu()
    }

    navigation.navigate('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'published-post',
        params: {
          post: data,
        },
      },
    })
  }

  const getPrice = () => {
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

  if (type === 'dashboard')
    return (
      <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
        <PaddingView paddingSize={2} style={styles.container}>
          <ProfileInfo userInfo={userInfo} type="dashboard" />
          <View
            style={{
              position: 'absolute',
              top: normalize(11),
              right: 11,
              padding: 5,
            }}>
            <TouchableOpacity onPress={toggleLike} activeOpacity={0.7}>
              {likePost ? (
                <LikeColored width={normalize(20)} height={normalize(20)} />
              ) : (
                <Like
                  style={{ color: Colors.icon }}
                  width={normalize(20)}
                  height={normalize(20)}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.postContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <View style={styles.postImageContainer}>
                <PostImage
                  path={cover_photos?.[0]}
                  size="375x350"
                  postType={post_type}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.postDetailContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
                <AppText
                  textStyle="body2Dashboard"
                  customStyle={GlobalStyle.marginBottom1}>
                  {title}
                </AppText>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppText
                    textStyle="price"
                    customStyle={styles.priceText}
                    color={Colors.secondaryMountainMeadow}>
                    {getPrice()}
                  </AppText>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} />
              <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
                <View style={GlobalStyle.rowCenter}>
                  <NavigationPinRed width={16} height={16} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{ marginLeft: 4 }}>
                    {city}, {province}
                  </AppText>
                </View>
              </View>
              {delivery_methods?.pickup || delivery_methods?.delivery ? (
                <View style={GlobalStyle.rowCenter}>
                  <TransportationBox width={16} height={16} />

                  <AppText
                    textStyle="eyebrow2"
                    customStyle={{ color: Colors.contentEbony, marginLeft: 4 }}>
                    {delivery_methods?.pickup && delivery_methods?.delivery
                      ? post_type === 'service'
                        ? 'Appointment & Walk-in'
                        : 'Pickup & Delivery'
                      : delivery_methods?.delivery
                      ? post_type === 'service'
                        ? 'Walk-in'
                        : 'Delivery'
                      : delivery_methods?.pickup
                      ? post_type === 'service'
                        ? 'Appointment'
                        : 'Pickup'
                      : 'Not set'}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        </PaddingView>
      </LoadingScreen.LoadingPublicPost>
    )

  if (type === 'liked')
    return (
      <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
        <PaddingView paddingSize={2} style={styles.container}>
          <ProfileInfo
            userInfo={userInfo}
            type="dashboard"
            toggleLikePost={toggleLikePost}
            toggleMenu={toggleMenu}
          />

          <View style={styles.postContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <View style={styles.postImageContainer}>
                <PostImage
                  path={cover_photos?.[0]}
                  size="375x350"
                  postType={post_type}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.postDetailContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
                <AppText
                  textStyle="body2Dashboard"
                  customStyle={GlobalStyle.marginBottom1}>
                  {title}
                </AppText>

                <AppText
                  textStyle="price"
                  customStyle={styles.priceText}
                  color={Colors.secondaryMountainMeadow}>
                  {getPrice()}
                </AppText>
              </TouchableOpacity>

              <Divider style={styles.dividerStyle} />

              <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
                <View style={GlobalStyle.rowCenter}>
                  <NavigationPinRed width={16} height={16} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{ marginLeft: 4 }}>
                    {city}, {province}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </PaddingView>
      </LoadingScreen.LoadingPublicPost>
    )

  if (type === 'archived')
    return (
      <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
        <PaddingView paddingSize={2} style={styles.container}>
          <ProfileInfo
            userInfo={userInfo}
            type="dashboard"
            toggleLikePost={toggleLikePost}
            toggleMenu={toggleMenu}
          />

          <View style={styles.postContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <View style={styles.postImageContainer}>
                <PostImage
                  path={cover_photos?.[0]}
                  size="375x350"
                  postType={post_type}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.postDetailContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
                <AppText
                  textStyle="body2Dashboard"
                  customStyle={GlobalStyle.marginBottom1}>
                  {title}
                </AppText>

                <AppText
                  textStyle="price"
                  customStyle={styles.priceText}
                  color={Colors.secondaryMountainMeadow}>
                  ₱{price}
                </AppText>
              </TouchableOpacity>

              <Divider style={styles.dividerStyle} />

              <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
                <View style={GlobalStyle.rowCenter}>
                  <NavigationPinRed width={16} height={16} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{ marginLeft: 4 }}>
                    {city}, {province}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </PaddingView>
      </LoadingScreen.LoadingPublicPost>
    )

  return (
    <AppText color={'red'}>
      type of list is required. Type: 'own' | 'dashboard'
    </AppText>
  )
}

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: Colors.neutralsZircon,
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  userInfoImageContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(32 / 2),
    overflow: 'hidden',
  },
  userInfoImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  userInfoDetailsContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  userInfoDetailsNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoDetailsName: {
    fontFamily: 'RoundedMplus1c-Medium',
    paddingRight: 4,
  },
  userInfoDetailsUsernameContainer: {
    flexDirection: 'row',
  },
  starRatingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },

  postContainer: {
    width: '100%',
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
  },

  postImageContainer: {
    width: normalize(122),
    height: normalize(126),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postDetailContainer: {
    flex: 1,
    marginLeft: 12,
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZirconLight,
    width: '100%',
    marginBottom: 8,
  },
  priceText: {
    marginRight: 8,
  },
})

export default Post
