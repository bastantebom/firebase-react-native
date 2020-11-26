import React, { useState, useEffect, useContext, useCallback } from 'react'
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
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import Swiper from 'react-native-swiper'
import ReadMore from 'react-native-read-more-text'

import {
  AppText,
  TransparentHeader,
  ProfileInfo,
  CacheableImage,
} from '@/components'
import { normalize, GlobalStyle, Colors, timePassed } from '@/globals'
import {
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  CircleTick,
  CloseDark,
  CircleTickWhite,
  CloseLight,
  ContactEmail,
  ContactTelephone,
  Chat,
  PostNote,
  PostParcel,
  PostInfoRed,
  PostTool,
  PostCalendar,
  ShoppingCart,
  CartDot,
} from '@/assets/images/icons'
import { CoverNeed, CoverSell, CoverService } from '@/assets/images'

import { PostService } from '@/services'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import EditPostScreen from './EditPostScreen'
import { ImageModal } from './ImageModal'
import ItemModal from './forms/modals/ItemModal'
import BasketModal from './forms/modals/BasketModal'
import OfferModal from './forms/modals/OfferModal'

const SinglePostView = props => {
  const { othersView = false } = props.route?.params

  const {
    user: { display_name, profile_photo, email, phone_number },
    cover_photos,
    title,
    description,
    payment,
    price,
    store_details: {
      schedule,
      location: { city, province, country },
    },
    delivery_methods,
    available,
    username,
    account_verified,
    date_posted,
    post_id,
    full_name,
    uid,
    is_multiple,
    type,
    items,
    price_range,
  } = props.route?.params?.data

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

  const navigation = useNavigation()

  const [showNotification, setShowNotification] = useState(false)
  const [ellipsisState, setEllipsisState] = useState(false)
  const [otherPostModal, setOtherPostModal] = useState(false)

  const [editPost, showEditPost] = useState(false)
  const [postImageModal, setPostImageModal] = useState(false)

  const [expired, setExpired] = useState(false)
  const { user, setUserInfo, userInfo } = useContext(UserContext)
  const {
    userCart,
    setUserCart,
    deleteCurrentOrderModal,
    showDeleteCurrentOrderModal,
  } = useContext(Context)
  const [following, setFollowing] = useState(false)
  const [storeOpen, setStoreOpen] = useState(true)
  const [multipleItems] = useState(is_multiple)
  const [itemModal, showItemModal] = useState(false)
  const [itemModalData, setItemModalData] = useState({})

  const [basketModal, showBasketModal] = useState(false)
  const [offerModal, showOfferModal] = useState(false)

  const [totalCartPrice, setTotalCartPrice] = useState('0.00')

  useEffect(() => {
    let computedPrice = 0

    if (userCart.length > 0)
      userCart.map(item => {
        computedPrice += item.price * item.quantity
      })

    setTotalCartPrice(computedPrice)
  }, [userCart])

  const toggleEditPost = () => {
    toggleEllipsisState()
    setTimeout(() => {
      showEditPost(!editPost)
    }, 500)
  }

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState)
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  const togglePostImageModal = () => {
    setPostImageModal(!postImageModal)
  }

  const toggleFollowing = () => {
    setFollowing(!following)
  }

  useEffect(() => {
    setShowNotification(setNotification())

    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }, [props])

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
    uid: uid,
  }

  const defaultImage = [
    {
      key: 0,
      image: require('@/assets/images/logo.png'),
    },
  ]
  const deletePost = async () => {
    return await PostService.deletePost(post_id).then(() => {
      toggleEllipsisState()
      setUserInfo({ ...userInfo, post_count: userInfo.post_count - 1 })
      navigation.goBack()
    })
  }

  const hidePost = async () => {
    return await PostService.hidePost({ uid: user?.uid, pid: post_id }).then(
      res => {
        toggleEllipsisState()
        setUserInfo({ ...userInfo, hidden_posts: res.hidden_posts })
        navigation.goBack()
      }
    )
  }

  let timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }

    return timePassed(time) + ' ago'
  }

  let makeCall = () => {
    let phoneNumber = ''
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone_number}`
    } else {
      phoneNumber = `telprompt:${phone_number}`
    }
    Linking.openURL(phoneNumber)
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
        <CircleTick width={normalize(24)} height={normalize(24)} />
      ) : (
        <CircleTickWhite width={normalize(24)} height={normalize(24)} />
      )
    }

    const NotificationClose = () => {
      return props.route.params?.created ? (
        <CloseDark width={normalize(24)} height={normalize(24)} />
      ) : (
        <CloseLight width={normalize(24)} height={normalize(24)} />
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
          <TouchableOpacity onPress={closeNotification} activeOpacity={0.7}>
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

  const SinglePostContent = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.postImageContainer}>
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
                  <AppText
                    textStyle="subtitle1"
                    color={Colors.secondaryMountainMeadow}
                    customStyle={{ marginRight: 8 }}>
                    ₱{' '}
                    {type !== 'need'
                      ? price
                      : `${price_range?.min} - ${price_range?.max}`}
                  </AppText>
                  {type !== 'need' ? (
                    <AppText customStyle={{ fontSize: normalize(10) }}>
                      PRICE
                    </AppText>
                  ) : (
                    <AppText customStyle={{ fontSize: normalize(10) }}>
                      BUDGET
                    </AppText>
                  )}
                </>
              )}
            </View>
            <View style={styles.iconText}>
              <PostClock width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                {timeAgo(Date.now() / 1000 - date_posted._seconds)}
              </AppText>
            </View>

            <View style={styles.iconText}>
              <PostParcel width={normalize(24)} height={normalize(24)} />
              <AppText
                textStyle="body2"
                customStyle={{ marginLeft: 8, marginRight: 4 }}>
                in
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
              <PostNavigation width={normalize(24)} height={normalize(24)} />
              <AppText
                textStyle="body2"
                customStyle={{ marginLeft: 8, marginRight: 20 }}>
                {city}, {province}
              </AppText>
            </View>
            {expired ? (
              <View
                style={[{ paddingBottom: normalize(100) }, styles.iconText]}>
                <PostInfoRed width={normalize(24)} height={normalize(24)} />
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
                      <PostCalendar
                        width={normalize(18)}
                        height={normalize(18)}
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
                  <PostInfo width={normalize(24)} height={normalize(24)} />
                  <View
                    style={{
                      marginLeft: normalize(8),
                      marginRight: normalize(20),
                    }}>
                    <ReadMore
                      numberOfLines={5}
                      renderTruncatedFooter={renderTruncatedFooter}
                      renderRevealedFooter={renderRevealedFooter}>
                      <AppText textStyle="body2">{description}</AppText>
                    </ReadMore>
                  </View>
                </View>
                <Divider
                  style={[GlobalStyle.dividerStyle, { marginBottom: 16 }]}
                />
                {payment?.length > 0 && (
                  <View style={styles.iconText}>
                    <PostCash width={normalize(24)} height={normalize(24)} />

                    <AppText
                      textStyle="body2"
                      customStyle={{
                        marginLeft: 8,
                        textTransform: 'capitalize',
                      }}>
                      {payment.join(', ')}
                    </AppText>
                  </View>
                )}
                {type == 'service' && (
                  <View style={styles.iconText}>
                    <PostTool width={normalize(20)} height={normalize(20)} />
                    <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                      Serviceable area within 50KM
                    </AppText>
                  </View>
                )}
                <View style={styles.iconText}>
                  <PostNote width={normalize(22)} height={normalize(22)} />
                  <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                    You can see the product in person
                  </AppText>
                </View>
              </>
            )}
          </View>
          {is_multiple && (
            <>
              {itemsByCategory.map((category, i) => {
                return (
                  <View key={i} style={styles.categoryWrapper}>
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
                          onPress={() => showItemModalWithItem(item)}>
                          <View style={styles.itemWrapper}>
                            {item?.image?.substring(0, 8) === 'https://' && (
                              <View style={styles.imageWrapper}>
                                <Image
                                  style={styles.image}
                                  source={{ uri: item.image }}
                                />
                              </View>
                            )}
                            <View style={styles.detailWrapper}>
                              <View style={styles.titleDesc}>
                                <AppText textStyle="body1medium">
                                  {item.name}
                                </AppText>
                                {item.description ? (
                                  <AppText textStyle="body2">
                                    {item.description}
                                  </AppText>
                                ) : (
                                  <></>
                                )}
                              </View>
                              <View style={styles.itemPrice}>
                                <AppText textStyle="subtitle1">
                                  ₱{item.price}
                                </AppText>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                )
              })}
            </>
          )}
        </ScrollView>

        {/* ITEM MODAL */}
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
            postID={post_id}
            closeModal={() => showItemModal(false)}
          />
        </Modal>
        {/* ITEM MODAL */}

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
                    <ContactTelephone
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
                activeOpacity={0.7}>
                <View style={styles.contactButtonContainer}>
                  <Chat width={normalize(24)} height={normalize(24)} />
                </View>
              </TouchableOpacity>
              {multipleItems ? (
                <TouchableOpacity
                  style={{ flex: 1, marginLeft: phone_number ? 8 : 0 }}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (type === 'need') {
                      showOfferModal(true)
                    } else {
                      showBasketModal(true)
                    }
                  }}>
                  <View style={styles.cartButtonContainer}>
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
                              <ShoppingCart
                                width={normalize(24)}
                                height={normalize(24)}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  right: normalize(-4),
                                  top: normalize(-3),
                                }}>
                                <CartDot
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
                                {userCart?.length}
                              </AppText>
                            </View>
                          </View>
                          <AppText textStyle="body1medium">
                            ₱{totalCartPrice}
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
    <>
      <SinglePostContent />
      <TransparentHeader
        type={uid === user?.uid ? 'post-own' : 'post-other'}
        ellipsisState={ellipsisState}
        toggleEllipsisState={toggleEllipsisState}
        toggleFollowing={toggleFollowing}
        following={following}
        backFunction={() => navigation.goBack()}
        editPostFunction={toggleEditPost}
        deletePostFunction={deletePost}
        hidePost={hidePost}
        postId={post_id}
        postTitle={title}
      />

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
          card={cardMap(type)}
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
    </>
  )
}

const cardMap = card => {
  return card === 'service'
    ? 'need'
    : card === 'Need' || card === 'need'
    ? 'post'
    : 'sell'
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
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
})

export default SinglePostView
