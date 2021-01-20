import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
  Dimensions,
  Animated,
  Alert,
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import Swiper from 'react-native-swiper'
import ReadMore from 'react-native-read-more-text'
import Api from '@/services/Api'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'

import { normalize, GlobalStyle, Colors, timePassed } from '@/globals'
import {
  AppText,
  TransparentHeader,
  ProfileInfo,
  CacheableImage,
} from '@/components'
import { HeaderShareGray, Icons } from '@/assets/images/icons'

import EditPostScreen from './EditPostScreen'
import { ImageModal } from './ImageModal'
import ItemModal from './forms/modals/ItemModal'
import BasketModal from './forms/modals/BasketModal'
import OfferModal from './forms/modals/OfferModal'
import NewBasketPrompt from './forms/modals/NewBasketPrompt'
import SetScheduleModalSingleService from './forms/modals/SetScheduleModal'
import { PostService } from '@/services'
import {
  commaSeparate,
  generateDynamicLink,
  getPreviewLinkData,
} from '@/globals/Utils'
import Share from 'react-native-share'

const SinglePostView = props => {
  const navigation = useNavigation()

  const {
    user: {
      display_name,
      profile_photo,
      email,
      phone_number,
      username,
      full_name,
    },
    cover_photos,
    title,
    description,
    payment,
    price,
    store_details: {
      location: { city, province },
    },
    account_verified,
    date_posted,
    id,
    uid,
    is_multiple,
    type,
    items,
    price_range,
    likers,
  } = props.route?.params?.data
  const { othersView = false } = props.route?.params

  const [payments, setPayments] = useState([])
  useEffect(() => {
    const paymentMethods = {
      gcash: 'GCash',
      paypal: 'PayPal',
      grabpay: 'GrabPay',
    }

    setPayments(
      payment.map(
        item =>
          paymentMethods[item] || item.charAt(0).toUpperCase() + item.slice(1)
      )
    )
  }, [])

  const itemsByCategory = [
    ...items
      .reduce(
        (
          r,
          {
            category,
            description,
            itemImage,
            image,
            price,
            title,
            itemId,
            id,
            name,
          }
        ) => {
          r.has(category) ||
            r.set(category, {
              category,
              items: [],
            })

          r.get(category).items.push({
            description,
            itemImage,
            image,
            price,
            title,
            itemId,
            category,
            id,
            name,
          })

          return r
        },
        new Map()
      )
      .values(),
  ]

  const { user } = useContext(UserContext)
  const {
    userCart,
    deleteCurrentOrderModal,
    showDeleteCurrentOrderModal,
    setCurrentPost,
    currentPostOrder,
    userPosts,
    setUserPosts,
  } = useContext(Context)

  const isLiked = ~likers?.indexOf(user?.uid)
  const [likePost, setLikePost] = useState(isLiked)

  const [ellipsisState, setEllipsisState] = useState(false)
  const [expired] = useState(false)
  const [following, setFollowing] = useState(false)
  const [storeOpen] = useState(true)
  const [multipleItems] = useState(is_multiple)
  const [itemModalData, setItemModalData] = useState({})
  const [totalCartPrice, setTotalCartPrice] = useState('0.00')

  const [showNotification, setShowNotification] = useState(false)
  const [scheduleModal, showScheduleModal] = useState(false)
  const [editPost, showEditPost] = useState(false)
  const [postImageModal, setPostImageModal] = useState(false)
  const [itemModal, showItemModal] = useState(false)
  const [basketModal, showBasketModal] = useState(false)
  const [offerModal, showOfferModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disableCartButton, setDisableCartButton] = useState(false)
  const [newBasketPrompt, showNewBasketPrompt] = useState(false)
  const [currentItem, setCurrentItem] = useState()

  useEffect(() => {
    let computedPrice = 0

    if (userCart.length)
      userCart.map(item => (computedPrice += item.price * item.quantity))

    setTotalCartPrice(computedPrice)

    setDisableCartButton(
      (!Array.isArray(userCart) || !userCart.length) && is_multiple
    )
  }, [userCart])

  useEffect(() => {
    const promises = [
      (async () => {
        const { data } = await Api.getFollowers({
          uid: props.route?.params?.data.uid,
        })
        setFollowing(data.some(resData => resData.uid === user.uid))
      })(),
      (async () => {
        const { likes } = await Api.getPostLikes({
          pid: props.route?.params?.data.id,
        })
        setLiked(likes?.includes(user.uid))
      })(),
    ]

    ;(async () => {
      await Promise.all(promises)
    })()
  }, [])

  useEffect(() => {
    setShowNotification(setNotification())

    const timeout = setTimeout(() => {
      setShowNotification(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [props])

  const toggleEditPost = () => {
    toggleEllipsisState()

    setTimeout(() => {
      showEditPost(!editPost)
    }, 500)
  }

  const toggleEllipsisState = () => setEllipsisState(!ellipsisState)
  const togglePostImageModal = () => setPostImageModal(!postImageModal)

  const setNotification = () => {
    return props.route.params?.created
      ? props.route.params?.created
      : props.route.params?.edited
      ? props.route.params?.edited
      : false
  }

  const profileInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name ? display_name : full_name,
    uid,
  }

  const defaultImage = [
    {
      key: 0,
      image: require('@/assets/images/logo.png'),
    },
  ]

  const deletePost = async () => {
    try {
      const response = await Api.deletePost({ pid: id })
      if (!response.success) throw new Error(response.message)
      toggleEllipsisState()
      navigation.goBack()

      setUserPosts(userPosts.filter(post => post.id !== id))
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong')
    }
  }

  const hidePost = async () => {
    const { success } = await Api.hidePost({ pid: id })

    if (success) {
      toggleEllipsisState()
      navigation.goBack()
    }
  }

  const handleLikedPost = async () => {
    const { id } = props.route?.params?.data
    const { likes } = await Api.getPostLikes({ pid: id })

    const isLiked = likes.includes(user.uid)
    await Api[isLiked ? 'unlikePost' : 'likePost']({ pid: id })

    setLiked(!isLiked)
  }

  const handleFollowing = async () => {
    const { uid } = props.route?.params?.data
    await Api[following ? 'unfollowUser' : 'followUser']({
      uid,
    })
    setFollowing(!following)
  }

  const timeAgo = time => {
    if (time <= 60) return 'Just now'

    return `${timePassed(time)} ago`
  }

  const makeCall = () =>
    Linking.openURL(
      `${Platform.OS === 'android' ? 'tel' : 'telprompt'}:${phone_number}`
    )

  const toggleLike = async () => {
    const res = await PostService.likeUnlike(id, isLiked)
    setLikePost(!likePost)
  }

  const handleChatPress = async () => {
    let channel
    try {
      if (!user?.uid) return
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [user.uid]: true,
          [uid]: true,
        })
        .where('post_id', '==', id)
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')
        const { id } = await ref.add({
          members: {
            [user.uid]: true,
            [uid]: true,
          },
          post_id: id,
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }
      navigation.navigate('Chat', { user, channel })
    } catch (error) {
      console.log(error)
    }
  }

  const handleShare = async () => {
    try {
      const url = await generateDynamicLink({
        type: 'post',
        params: { id },
        social: getPreviewLinkData({
          type: 'post',
          data: props.route?.params?.data,
        }),
      })

      await Share.open({ url })
    } catch (error) {
      console.log(error)
    }
  }

  const CustomNotification = () => {
    const backgroundColor = props.route.params?.created
      ? Colors.primaryYellow
      : Colors.secondaryRoyalBlue

    const notificationMessage = props.route.params?.created
      ? 'Post Successful!'
      : 'Post edited successfully'

    const notificationColor = props.route.params?.created
      ? Colors.contentEbony
      : 'white'

    const NotificationCheckbox = () => {
      return props.route.params?.created ? (
        <Icons.CircleTick width={normalize(24)} height={normalize(24)} />
      ) : (
        <Icons.CircleTickWhite width={normalize(24)} height={normalize(24)} />
      )
    }

    const NotificationClose = () => {
      return props.route.params?.created ? (
        <Icons.CloseDark width={normalize(24)} height={normalize(24)} />
      ) : (
        <Icons.CloseLight width={normalize(24)} height={normalize(24)} />
      )
    }

    if (showNotification)
      return (
        <View
          style={{
            backgroundColor: backgroundColor,
            position: 'absolute',
            bottom: 0,
            width: normalize(375),
            paddingHorizontal: 16,
            alignItems: 'center',
            height: normalize(58),
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            paddingBottom: 8,
            flexDirection: 'row',
            zIndex: 5,
          }}>
          <NotificationCheckbox />
          <AppText
            customStyle={{ flex: 1, marginLeft: 8 }}
            color={notificationColor}
            textStyle="body2">
            {notificationMessage}
          </AppText>
          <TouchableOpacity
            onPress={() => setShowNotification(false)}
            activeOpacity={0.7}>
            <NotificationClose />
          </TouchableOpacity>
        </View>
      )
    return null
  }

  const renderTruncatedFooter = handlePress => {
    return (
      <TouchableOpacity onPress={handlePress}>
        <AppText
          textStyle="body3"
          color={Colors.contentOcean}
          customStyle={{ marginTop: normalize(10) }}>
          Read more
        </AppText>
      </TouchableOpacity>
    )
  }

  const renderRevealedFooter = handlePress => {
    return (
      <TouchableOpacity onPress={handlePress}>
        <AppText
          textStyle="body3"
          color={Colors.contentOcean}
          customStyle={{ marginTop: normalize(10) }}>
          Show less
        </AppText>
      </TouchableOpacity>
    )
  }

  const showItemModalWithItem = item => {
    showItemModal(true)
    setItemModalData(item)
  }

  const [data, setData] = useState([])
  const [dataCoords, setDataCoords] = useState([])

  const ref = useRef(null)

  const scrollHandler = i => {
    if (dataCoords.length > i) {
      ref.current.scrollTo({
        x: 0,
        y: dataCoords[i] - 60,
        animated: true,
      })
    }
  }

  const [scrollY] = useState(new Animated.Value(0))

  useEffect(() => {
    setData(itemsByCategory)
  }, [])

  const HEADER_MAX_HEIGHT = normalize(248)
  const HEADER_MIN_HEIGHT = normalize(80)
  const HEADER_INITIAL_HEIGHT = normalize(50)
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_INITIAL_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  const offsetHeight = scrollY.interpolate({
    inputRange: [
      HEADER_SCROLL_DISTANCE,
      HEADER_MAX_HEIGHT,
      HEADER_MAX_HEIGHT * 2,
    ],
    outputRange: [0, 0, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT / 1.5, HEADER_MAX_HEIGHT],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  })

  const headerTransform = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT * 0.75, HEADER_MAX_HEIGHT],
    outputRange: [1, 0, -50],
    extrapolate: 'clamp',
  })

  const ItemView = (category, i) => {
    return (
      <View
        key={i}
        style={styles.categoryWrapper}
        onLayout={event => {
          const layout = event.nativeEvent.layout
          dataCoords[i] = layout.y
          setDataCoords(dataCoords)
        }}>
        <AppText
          textStyle="subtitle1"
          customStyle={{ marginBottom: normalize(15) }}>
          {category.category}
        </AppText>
        {category.items.map(item => {
          return (
            <TouchableOpacity
              disabled={uid === user?.uid}
              key={item.id}
              onPress={async () => {
                if (currentPostOrder === undefined || currentPostOrder === id) {
                  showItemModalWithItem(item)
                } else {
                  showNewBasketPrompt(true)
                  setCurrentItem(item)
                }
              }}>
              <View style={styles.itemWrapper}>
                {item?.image?.substring(0, 8) === 'https://' && (
                  <View style={styles.imageWrapper}>
                    <Image style={styles.image} source={{ uri: item.image }} />
                  </View>
                )}
                <View style={styles.detailWrapper}>
                  <View style={styles.titleDesc}>
                    <AppText textStyle="body1medium">{item.name}</AppText>
                    {item.description ? (
                      <AppText textStyle="body2">{item.description}</AppText>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View style={styles.itemPrice}>
                    <AppText textStyle="subtitle1">
                      ₱{commaSeparate(item.price)}
                    </AppText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const SinglePostContent = () => {
    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ height: offsetHeight, zIndex: offsetHeight }}>
          <View
            style={{
              position: 'absolute',
              backgroundColor: Colors.neutralsWhite,
              borderColor: Colors.neutralsZircon,
              borderWidth: 1,
              width: '100%',
            }}>
            <View
              style={{
                paddingHorizontal: normalize(15),
                paddingVertical: normalize(25),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icons.PostParcelBlue
                    width={normalize(25)}
                    height={normalize(25)}
                  />
                  <AppText
                    textStyle="subtitle1"
                    customStyle={{ marginLeft: 8 }}>
                    {profileInfo.display_name}
                  </AppText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                    <View
                      style={[styles.headerButton, GlobalStyle.marginLeft1]}>
                      <HeaderShareGray
                        width={normalize(20)}
                        height={normalize(20)}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleLike}>
                    <View
                      style={[styles.headerButton, GlobalStyle.marginLeft1]}>
                      {likePost ? (
                        <Icons.LikeColored
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                      ) : (
                        <Icons.Like
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
        <ScrollView
          bounces={false}
          ref={ref}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } },
              },
            ],
            {
              useNativeDriver: false,
            }
          )}
          stickyHeaderIndices={[2]}
          contentContainerStyle={{ marginTop: 0 }}>
          <View style={[styles.postImageContainer]}>
            {cover_photos === undefined || cover_photos.length == 0 ? (
              type === 'Need' || type === 'need' ? (
                <Image
                  style={GlobalStyle.image}
                  source={require('@/assets/images/cover-need.png')}
                />
              ) : type === 'Sell' || type === 'sell' ? (
                <Image
                  style={GlobalStyle.image}
                  source={require('@/assets/images/cover-sell.png')}
                />
              ) : (
                <Image
                  style={GlobalStyle.image}
                  source={require('@/assets/images/cover-service.png')}
                />
              )
            ) : (
              <View style={{ backgroundColor: 'white', flex: 1 }}>
                <Swiper
                  activeDotColor={Colors.primaryYellow}
                  dotColor={Colors.neutralsIron}
                  dotStyle={{
                    marginRight: 7,
                    width: normalize(6),
                    height: normalize(6),
                  }}
                  activeDotStyle={{
                    marginRight: 7,
                    width: normalize(6),
                    height: normalize(6),
                  }}>
                  {cover_photos.map((item, index) => {
                    return (
                      <TouchableWithoutFeedback
                        key={index}
                        onPress={togglePostImageModal}>
                        <CacheableImage
                          style={GlobalStyle.image}
                          source={{
                            uri: item,
                          }}
                        />
                      </TouchableWithoutFeedback>
                    )
                  })}
                </Swiper>
              </View>
            )}
            <CustomNotification />
          </View>

          <View style={styles.postInfoContainer}>
            <ProfileInfo userInfo={profileInfo} type="own-post" />
            <AppText
              textStyle="subtitle1"
              customStyle={{ marginTop: 24, marginBottom: 16 }}>
              {title}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: normalize(12),
              }}>
              {!is_multiple && (
                <>
                  {type !== 'need' ? (
                    <AppText
                      textStyle="eyebrow1"
                      customStyle={{ fontSize: normalize(10) }}>
                      PRICE
                    </AppText>
                  ) : (
                    <AppText
                      textStyle="eyebrow1"
                      customStyle={{ fontSize: normalize(10) }}>
                      BUDGET
                    </AppText>
                  )}
                  <AppText
                    textStyle="subtitle1"
                    color={Colors.secondaryMountainMeadow}
                    customStyle={{ marginLeft: 8 }}>
                    {type !== 'need'
                      ? `₱${commaSeparate(items[0].price)}`
                      : `₱${commaSeparate(price_range?.min)} - ₱${commaSeparate(
                          price_range?.max
                        )}`}
                  </AppText>
                </>
              )}
            </View>
            <View style={styles.iconText}>
              <Icons.PostClock width={normalize(18)} height={normalize(18)} />
              <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                {timeAgo(Date.now() / 1000 - date_posted._seconds)}
              </AppText>
            </View>

            <View style={styles.iconText}>
              <Icons.PostParcel width={normalize(18)} height={normalize(18)} />
              <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                in{' '}
              </AppText>
              {type === 'service' ? (
                <AppText textStyle="body2" color={Colors.secondaryBrinkPink}>
                  Service
                </AppText>
              ) : type === 'need' ? (
                <AppText
                  textStyle="body2"
                  color={Colors.secondaryMountainMeadow}>
                  Need
                </AppText>
              ) : (
                <AppText textStyle="body2" color={Colors.secondaryRoyalBlue}>
                  Sell
                </AppText>
              )}
            </View>

            <View style={styles.iconText}>
              <Icons.PostNavigation
                width={normalize(18)}
                height={normalize(18)}
              />
              <AppText
                textStyle="body2"
                customStyle={{ marginLeft: 8, marginRight: 20 }}>
                {city}, {province}
              </AppText>
            </View>
            {expired ? (
              <View
                style={[{ paddingBottom: normalize(100) }, styles.iconText]}>
                <Icons.PostInfoRed
                  width={normalize(18)}
                  height={normalize(18)}
                />
                <AppText
                  textStyle="body2"
                  customStyle={{ marginLeft: 8 }}
                  color={Colors.errColor}>
                  This post has expired
                </AppText>
              </View>
            ) : (
              <>
                {type == 'service' && (
                  <View style={{ marginBottom: normalize(16) }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 0,
                      }}>
                      <Icons.PostCalendar
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                      <AppText
                        textStyle="body2"
                        customStyle={{ marginLeft: 8, marginRight: 20 }}>
                        10:00 AM - 7:00 PM ( Tue - Sun )
                      </AppText>
                    </View>
                    <>
                      {storeOpen ? (
                        <AppText
                          textStyle="body2"
                          customStyle={{ marginLeft: 30 }}
                          color={Colors.secondaryMountainMeadow}>
                          Open Now
                        </AppText>
                      ) : (
                        <AppText
                          textStyle="body2"
                          customStyle={{ marginLeft: 30 }}
                          color={Colors.errColor}>
                          Closed
                        </AppText>
                      )}
                    </>
                  </View>
                )}
                <View style={styles.iconText}>
                  <Icons.PostInfo
                    width={normalize(18)}
                    height={normalize(18)}
                  />
                  <View
                    style={{
                      marginLeft: normalize(8),
                      marginRight: normalize(20),
                    }}>
                    <ReadMore
                      numberOfLines={5}
                      renderTruncatedFooter={renderTruncatedFooter}
                      renderRevealedFooter={renderRevealedFooter}>
                      <AppText
                        textStyle="body2"
                        customStyle={{ fontFamily: 'RoundedMplus1c-Regular' }}>
                        {description}
                      </AppText>
                    </ReadMore>
                  </View>
                </View>
                <Divider
                  style={[GlobalStyle.dividerStyle, { marginBottom: 16 }]}
                />
                {payments && (
                  <View style={styles.iconText}>
                    <Icons.PostCash
                      width={normalize(18)}
                      height={normalize(18)}
                    />

                    <AppText
                      textStyle="body2"
                      customStyle={{
                        marginLeft: 8,
                      }}>
                      {payments.join(', ')}
                    </AppText>
                  </View>
                )}
                {type == 'service' && (
                  <View style={styles.iconText}>
                    <Icons.PostTool
                      width={normalize(18)}
                      height={normalize(18)}
                    />
                    <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                      Serviceable area within 50KM
                    </AppText>
                  </View>
                )}
              </>
            )}
          </View>
          {is_multiple && (
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                paddingHorizontal: 15,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderBottomColor: Colors.neutralsZircon,
                borderBottomWidth: 2,
              }}>
              <ScrollView
                directionalLockEnabled={true}
                bounces={false}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}>
                {itemsByCategory.map((category, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        paddingRight: normalize(24),
                        paddingVertical: normalize(12),
                      }}
                      onPress={() => {
                        scrollHandler(i, category)
                      }}>
                      <AppText textStyle="body2">{category.category}</AppText>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          )}
          {is_multiple && <>{data.map(ItemView)}</>}
        </ScrollView>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.View
            style={[
              styles.bar,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTransform }],
              },
            ]}>
            <TransparentHeader
              type={uid === user?.uid ? 'post-own' : 'post-other'}
              ellipsisState={ellipsisState}
              toggleEllipsisState={toggleEllipsisState}
              following={following}
              backFunction={() => navigation.goBack()}
              editPostFunction={toggleEditPost}
              deletePostFunction={deletePost}
              handleLikedPost={handleLikedPost}
              handleFollowing={handleFollowing}
              hidePost={hidePost}
              postId={id}
              postTitle={title}
              liked={liked}
            />
          </Animated.View>
        </Animated.View>

        <Modal
          isVisible={itemModal}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{ margin: 0, justifyContent: 'flex-end' }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={() => showItemModal(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <ItemModal
            item={itemModalData}
            postType={type}
            postID={id}
            closeModal={() => showItemModal(false)}
          />
        </Modal>

        {othersView && (
          <SafeAreaView
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: 'white',
              }}>
              {phone_number ? (
                <TouchableOpacity
                  style={{ marginRight: email ? 8 : 0 }}
                  activeOpacity={0.7}
                  onPress={makeCall}>
                  <View style={styles.contactButtonContainer}>
                    <Icons.ContactTelephone
                      width={normalize(24)}
                      height={normalize(24)}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                style={{ marginRight: email ? 8 : 0 }}
                activeOpacity={0.7}
                onPress={handleChatPress}>
                <View style={styles.contactButtonContainer}>
                  <Icons.Chat
                    style={{ color: '#1F1A54' }}
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                </View>
              </TouchableOpacity>
              {multipleItems ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: phone_number ? 8 : 0,
                  }}
                  activeOpacity={0.7}
                  disabled={disableCartButton}
                  onPress={() => {
                    if (type === 'need') {
                      showOfferModal(true)
                    } else {
                      showBasketModal(true)
                    }
                  }}>
                  <View
                    style={[
                      styles.cartButtonContainer,
                      {
                        backgroundColor: disableCartButton
                          ? Colors.neutralGray
                          : Colors.primaryYellow,
                      },
                    ]}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: '100%',
                        paddingHorizontal: normalize(16),
                      }}>
                      {type === 'need' ? (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                          }}>
                          <AppText textStyle="body3">Make an offer</AppText>
                        </View>
                      ) : (
                        <>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ position: 'relative' }}>
                              <Icons.ShoppingCart
                                width={normalize(24)}
                                height={normalize(24)}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  right: normalize(-4),
                                  top: normalize(-3),
                                }}>
                                <Icons.CartDot
                                  width={normalize(10)}
                                  height={normalize(10)}
                                />
                              </View>
                            </View>
                            <View
                              style={{
                                backgroundColor: 'white',
                                paddingVertical: normalize(2),
                                paddingHorizontal: normalize(7),
                                borderRadius: 11,
                                marginLeft: normalize(5),
                              }}>
                              <AppText
                                textStyle="body3"
                                color={Colors.contentOcean}>
                                {userCart
                                  .map(item => item.quantity)
                                  .reduce((qty, curr) => qty + curr, 0)}
                              </AppText>
                            </View>
                          </View>
                          <AppText textStyle="body1medium">
                            ₱{commaSeparate(totalCartPrice)}
                          </AppText>
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (type === 'need') {
                      showOfferModal(true)
                    } else if (type === 'service' && !is_multiple) {
                      showScheduleModal(true)
                    } else {
                      showBasketModal(true)
                    }
                  }}
                  style={{ flex: 1, marginLeft: phone_number ? 8 : 0 }}
                  activeOpacity={0.7}
                  disabled={expired ? true : false}>
                  <View
                    style={
                      expired
                        ? styles.disabledBuyButtonContainer
                        : styles.buyButtonContainer
                    }>
                    <AppText
                      textStyle="button2"
                      customStyle={{ marginLeft: 8 }}>
                      {type === 'service'
                        ? 'Book'
                        : type === 'need'
                        ? 'Make an Offer'
                        : 'Buy'}
                    </AppText>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SinglePostContent />
      <Modal
        isVisible={deleteCurrentOrderModal}
        animationIn="zoomIn"
        animationInTiming={450}
        animationOut="zoomOut"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showDeleteCurrentOrderModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText>Are you sure?</AppText>
          <AppText>Adding other items will clear your current basket.</AppText>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.buttonDisable,
              paddingHorizontal: 24,
              paddingVertical: 8,
            }}>
            <AppText>Okay</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primaryYellow,
              paddingHorizontal: 24,
              paddingVertical: 8,
            }}>
            <AppText>Cancel</AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={newBasketPrompt}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        // style={{ margin: 0 }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showNewBasketPrompt(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <NewBasketPrompt
          currentItem={currentItem}
          close={() => showNewBasketPrompt(false)}
          postID={id}
        />
      </Modal>

      <Modal
        isVisible={editPost}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showEditPost(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <EditPostScreen
          data={props.route.params.data}
          card={() => {}}
          togglePostModal={() => showEditPost(false)}
        />
      </Modal>
      <Modal
        isVisible={postImageModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageModal
          close={togglePostImageModal}
          data={
            cover_photos === undefined || cover_photos.length == 0
              ? defaultImage
              : cover_photos
          }
        />
      </Modal>
      <Modal
        isVisible={basketModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <BasketModal
          closeModal={() => showBasketModal(false)}
          postType={type}
          postData={props.route?.params?.data}
        />
      </Modal>
      <Modal
        isVisible={offerModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showOfferModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <OfferModal
          closeModal={() => showOfferModal(false)}
          postType={type}
          postData={props.route?.params?.data}
        />
      </Modal>

      <Modal
        isVisible={scheduleModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showScheduleModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <SetScheduleModalSingleService
          closeModal={() => showScheduleModal(false)}
          post={{
            title: title,
            price: `₱${commaSeparate(items[0].price)}`,
          }}
          handleContinue={(date, time) => {
            showScheduleModal(false)
            navigation.navigate('NBTScreen', {
              screen: 'basket',
              params: {
                postType: type,
                postData: props.route?.params?.data,
                schedule: { date, time },
              },
            })
          }}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: normalize(8),
  },
  postImageContainer: {
    height: normalize(248),
    width: normalize(375),
    overflow: 'hidden',
  },
  postInfoContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    overflow: 'visible',
    zIndex: 10,
    position: 'relative',
  },
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
  iconText: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contactButtonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.primaryYellow,
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.neutralsWhite,
    width: normalize(50),
  },
  buyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.primaryYellow,
    borderRadius: 5,
  },
  disabledBuyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.buttonDisable,
    borderRadius: 5,
  },
  cartButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11.5,
    alignItems: 'center',
    backgroundColor: Colors.primaryYellow,
    borderRadius: 5,
  },
  categoryWrapper: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(20),
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: normalize(10),
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  imageWrapper: {
    position: 'relative',
    marginRight: normalize(10),
  },
  image: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 4,
  },
  status: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1F1A54',
    opacity: 0.6,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    paddingHorizontal: normalize(3),
  },
  detailWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#DADCE0',
    borderBottomWidth: 1,
    paddingVertical: normalize(10),
    justifyContent: 'space-between',
  },
  titleDesc: {
    flexDirection: 'column',
    flex: 0.8,
  },
  itemPrice: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bar: {
    height: normalize(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
})

export default SinglePostView
