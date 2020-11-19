import React, { useContext, useState } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { Colors, GlobalStyle, timePassed, normalize } from '@/globals'
import OwnPost from './OwnPost'
import ArchivePost from './ArchivePost'
import { PaddingView, AppText, ProfileInfo, CacheableImage } from '@/components'
import { UserContext } from '@/context/UserContext'
import {
  Verified,
  StarRating,
  NavigationPinRed,
  NavigationArrow,
  TransportationBox,
  Like,
  LikeColored,
} from '@/assets/images/icons'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'

import LoadingScreen from './loading'
import SinglePostOthersView from './SinglePostOthersView'
import { PostService } from '@/services'

const Post = ({ data, type, isLoading, toggleLikePost, toggleMenu }) => {
  const { user } = useContext(UserContext)
  const [showPost, setShowPost] = useState(false)

  const {
    user: { display_name, profile_photo },
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
    account_verified,
    email,
    phone_number,
    is_multiple,
    full_name,
    price,
    likers,
  } = data

  const post_type = data?.type

  const isLiked = ~likers?.indexOf(user?.uid)
  const [likePost, setLikePost] = useState(isLiked)

  const VerifiedBadge = () => {
    return account_verified ? <Verified /> : <></>
  }

  let timeAgo = time => {
    return '• ' + timePassed(time) + ' ago'
  }

  const toggleLike = async () => {
    const res = await PostService.likeUnlike(id, isLiked)
    setLikePost(!likePost)
  }

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name ? display_name : full_name,
    date_posted: date_posted,
    uid: uid,
    post_type: post_type,
  }

  const navigation = useNavigation()

  const navToPost = () => {
    let computedData = {
      data: data,
      viewing: true,
      created: false,
      edited: false,
    }
    if (type === 'liked') {
      toggleLikePost()
      toggleMenu()
    }

    if (user && user.uid === uid)
      navigation.navigate('Post', {
        screen: 'SinglePostView',
        params: computedData,
      })
    else
      navigation.navigate('NBTScreen', {
        screen: 'OthersPost',
        params: { ...computedData, othersView: true },
      })
  }

  const getPrice = () => {
    const prices = items.map(item => {
      return Number(item.price)
    })

    if (prices.length === 1) return prices[0].toString()
    else {
      const min = Math.min(...prices)
      const max = Math.max(...prices)

      const finalPrices = [min, max]

      return finalPrices.join(' - ')
    }
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
                <Like width={normalize(20)} height={normalize(20)} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.postContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <View style={styles.postImageContainer}>
                {cover_photos.length > 0 ? (
                  <CacheableImage
                    style={GlobalStyle.image}
                    source={{ uri: cover_photos[0] }}
                  />
                ) : post_type === 'service' ? (
                  <DefaultService
                    width={normalize(122)}
                    height={normalize(126)}
                  />
                ) : post_type === 'need' || post_type === 'Need' ? (
                  <DefaultNeed width={normalize(122)} height={normalize(126)} />
                ) : (
                  <DefaultSell width={normalize(122)} height={normalize(126)} />
                )}
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
                    ₱{getPrice()}
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
                      ? 'Pickup & Delivery'
                      : delivery_methods?.delivery
                      ? 'Delivery'
                      : delivery_methods?.pickup
                      ? 'Pickup'
                      : 'Not set'}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        </PaddingView>
        <Modal
          isVisible={showPost}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutLeft"
          animationOutTiming={500}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <SinglePostOthersView
            data={data}
            backFunction={() => setShowPost(false)}
          />
        </Modal>
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
                {cover_photos.length > 0 ? (
                  <CacheableImage
                    style={GlobalStyle.image}
                    source={{ uri: cover_photos[0] }}
                  />
                ) : // <Image style={GlobalStyle.image} source={require('@/assets/images/logo.png')} />
                post_type === 'service' ? (
                  <DefaultService
                    width={normalize(122)}
                    height={normalize(126)}
                  />
                ) : post_type === 'need' || post_type === 'Need' ? (
                  <DefaultNeed width={normalize(122)} height={normalize(126)} />
                ) : (
                  <DefaultSell width={normalize(122)} height={normalize(126)} />
                )}
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
                  ₱{getPrice()}
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
        <Modal
          isVisible={showPost}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutLeft"
          animationOutTiming={500}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <SinglePostOthersView
            data={data}
            backFunction={() => setShowPost(false)}
          />
        </Modal>
      </LoadingScreen.LoadingPublicPost>
    )

  if (type === 'own') return <OwnPost data={data} isLoading={isLoading} />
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
                {cover_photos.length > 0 ? (
                  <CacheableImage
                    style={GlobalStyle.image}
                    source={{ uri: cover_photos[0] }}
                  />
                ) : // <Image style={GlobalStyle.image} source={require('@/assets/images/logo.png')} />
                post_type === 'service' ? (
                  <DefaultService
                    width={normalize(122)}
                    height={normalize(126)}
                  />
                ) : post_type === 'need' || post_type === 'Need' ? (
                  <DefaultNeed width={normalize(122)} height={normalize(126)} />
                ) : (
                  <DefaultSell width={normalize(122)} height={normalize(126)} />
                )}
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
                {/* <View style={[GlobalStyle.rowCenter, GlobalStyle.marginLeft2]}>
                <NavigationArrow width={12} height={12} />
                <AppText
                  textStyle="eyebrow2"
                  color={Colors.contentPlaceholder}
                  customStyle={{marginLeft: 4}}>
                  {postServiceRadius}
                </AppText>
              </View> */}
              </View>
              {/* {pickup || delivery ? (
              <View style={GlobalStyle.rowCenter}>
                <TransportationBox width={16} height={16} />

                <AppText
                  textStyle="eyebrow2"
                  customStyle={{ color: Colors.contentEbony, marginLeft: 4 }}>
                  {pickup && delivery
                    ? 'Pickup & Delivery'
                    : delivery
                    ? 'Delivery'
                    : pickup
                    ? 'Pickup'
                    : 'Not set'}
                </AppText>
              </View>
            ) : null} */}
            </View>
          </View>
        </PaddingView>
        <Modal
          isVisible={showPost}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutLeft"
          animationOutTiming={500}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <SinglePostOthersView
            data={data}
            backFunction={() => setShowPost(false)}
          />
        </Modal>
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
