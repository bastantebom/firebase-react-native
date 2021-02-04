import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

import { Colors, normalize } from '@/globals'
import {
  AppButton,
  AppText,
  BottomSheetHeader,
  Notification,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'
import Post from '@/screens/Dashboard/components/post'
import {
  Alert,
  LayoutAnimation,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
} from 'react-native'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import { capitalize } from 'lodash'
import {
  CashActive,
  CircleTickWhite,
  CreditCardActive,
  GCashActive,
  GrabPayActive,
  Icons,
  LocationContactUs,
  MasterCardActive,
  PaypalActive,
  PostBox,
  PostCash,
  PostNote,
  VisaActive,
} from '@/assets/images/icons'
import { View } from 'native-base'
import Svg, { Circle, Line } from 'react-native-svg'
import getStatusData from './utils/order-statuses'
import LinearGradient from 'react-native-linear-gradient'
import LottieView from 'lottie-react-native'
import getStatusColor from './utils/order-status-color'

import Modal from 'react-native-modal'
import CancelOrderModal from './modals/cancel-order'
import DeclineOrderModal from './modals/decline-order'

import moment from 'moment'
import { commaSeparate } from '@/globals/Utils'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} OrderTrackerProps
 * @property {string} orderID
 * @property {object|undefined} post
 */

/**
 * @typedef {object} RootProps
 * @property {OrderTrackerProps} OrderTracker
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'OrderTracker'>} param0 */
const OrderTrackerScreen = ({ navigation, route }) => {
  const { orderID } = route.params

  const { user } = useContext(UserContext)
  const [post, setPost] = useState(route.params.post || {})
  const [isLoading, setIsLoading] = useState(false)
  const [orderData, setOrderData] = useState({})
  const [orderStatus, setOrderStatus] = useState({})
  const [title, setTitle] = useState('Order status')
  const [userType, setUserType] = useState('')
  const [attachedPost, setAttachedPost] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [statusHistoryVisible, setStatusHistoryVisible] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [declineModalVisible, setDeclineModalVisible] = useState(false)
  const [orderStatusHistory, setOrderStatusHistory] = useState([])

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    handleRefresh(false)

    return firestore()
      .doc(`orders/${orderID}`)
      .onSnapshot(async snapshot => {
        if (!snapshot?.data() || !user) return
        Platform.OS === 'android' && setIsLoading(true)
        try {
          const data = snapshot.data()
          setOrderData(orderData => ({ ...orderData, ...data }))

          if (orderData.status !== data.status && post.type) {
            const statusData = getStatusData({
              userType: data.seller_id === user.uid ? 'seller' : 'buyer',
              type: post.type,
              status: data.status,
              paymentMethod: data.payment_method,
            })
            setOrderStatus(statusData)
          }
        } catch (error) {
          console.log(error)
          Alert.alert('Error', 'Oops, something went wrong.')
        }
        Platform.OS === 'android' && setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    const newUserType = orderData.seller_id === user.uid ? 'seller' : 'buyer'
    const newTitle = getTitle()
    const newTotal = (orderData?.items || []).reduce(
      (total, item) =>
        total + parseFloat((item.price + '').replace(/,/g, '')) * item.quantity,
      0
    )

    if (newUserType !== userType) setUserType(newUserType)
    if (newTitle !== title) setTitle(newTitle)
    if (newTotal !== totalPrice) setTotalPrice(newTotal)
    if (
      orderData.history &&
      orderData?.history?.length !== orderStatusHistory.length
    )
      setOrderStatusHistory(orderData.history)
  }, [orderData])

  const getTitle = () => {
    const status = orderData.status

    if (userType === 'buyer') {
      if (post.type === 'sell') {
        switch (status) {
          case 'pending':
          case 'processing':
          case 'confirmed':
            return 'Order Status'
          case 'declined':
          case 'cancelled':
          case 'completed':
            return `Order ${capitalize(status)}`
          default:
            return 'Order Request'
        }
      } else if (post.type === 'service') {
        switch (status) {
          case 'pending':
          case 'ongoing':
          case 'confirmed':
            return 'Status'
          case 'cancelled':
          case 'completed':
            return capitalize(status)
          default:
            return 'Service Request'
        }
      } else return 'Order Request'
    } else if (userType === 'seller') {
      if (post.type === 'sell') {
        switch (post.type) {
          case 'declined':
            return `Order ${capitalize(status)}`
        }
      } else if (post.type === 'service') {
        switch (status) {
          case 'completed':
            return capitalize(status)
          case 'cancelled':
            return `Service ${capitalize(status)}`
          default:
            return 'Service Request'
        }
      } else return 'Order Request'
    }

    return 'Order Request'
  }

  const handleRefresh = async (refresh = true) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true)
    try {
      const doc = await firestore().doc(`orders/${orderID}`).get()
      const data = doc.data()

      let response = await Api.getUser({ uid: data.buyer_id })
      data.buyerData = response.data
      response = await Api.getUser({ uid: data.seller_id })
      data.sellerData = response.data

      let postData
      if (!post.id) {
        let response = await Api.getPost({ pid: data.post_id })
        postData = response.data
        response = await Api.getUser({ uid: postData.uid })
        postData.user = response.data
      } else {
        postData = post
        if (!postData.user) {
          const response = await Api.getUser({ uid: postData.uid })
          postData.user = response.data
        }
      }

      if (!attachedPost && data.attachedPostId) {
        const response = await Api.getPost({
          pid: data.attachedPostId,
        })
        const getUserResponse = await Api.getUser({
          uid: response.data.uid,
        })
        setAttachedPost({ ...response.data, user: getUserResponse.data })
      }

      setPost(postData)
      setOrderData(data)

      setOrderStatus(
        getStatusData({
          userType: data.seller_id === user.uid ? 'seller' : 'buyer',
          type: postData.type,
          status: data.status,
          paymentMethod: data.payment_method,
        })
      )
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsRefreshing(false)
    setIsLoading(false)
  }

  const handlePayment = method => {
    if (method === 'cash') return
    navigation.navigate('payments', {
      screen: method,
      params: {
        orderData,
      },
    })
  }

  const handleViewPostPress = async () => {
    setIsLoading(true)
    const data = post

    try {
      if (!data.user) {
        const response = await Api.getUser({ uid: post.uid })
        const user = response.data
        data.user = user

        setPost(post => ({ ...post, user }))
      }

      navigation.navigate('NBTScreen', {
        screen: 'OthersPost',
        params: {
          data,
          viewing: true,
          created: false,
          edited: false,
          othersView: user?.uid !== post.uid,
        },
      })
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong')
    }
    setIsLoading(false)
  }

  const handleChatPress = async () => {
    setIsLoading(true)
    let channel
    try {
      if (!user?.uid) return
      const otherUID =
        userType === 'seller' ? orderData.buyer_id : orderData.seller_id
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [user.uid]: true,
          [otherUID]: true,
        })
        .where('post_id', '==', orderData.post_id)
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')
        const { id } = await ref.add({
          members: {
            [user.uid]: true,
            [otherUID]: true,
          },
          post_id: orderData.post_id,
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }

      navigation.navigate('NBTScreen', {
        screen: 'Chat',
        params: {
          user,
          channel,
        },
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleCancel = () => {
    setCancelModalVisible(false)
    handleStatusChange('cancelled')
  }

  const handleDecline = () => {
    setDeclineModalVisible(false)
    handleStatusChange('declined')
  }

  const handleStatusChange = async status => {
    setIsLoading(true)
    try {
      const response = await Api.updateOrder({
        uid: user.uid,
        id: orderData.id,
        body: {
          status,
        },
      })

      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error)
      Alert('Error', 'Oops, something went wrong')
    }
    setIsLoading(false)
  }

  const renderStatusIndicator = (status, drawLine, past) => {
    const color = getStatusColor({
      userType,
      status,
      postType: post.type,
      paymentMethod: orderData.payment_method,
      past,
    })

    return (
      <View
        style={[
          styles.statusIndicator,
          {
            height: '100%',
            zIndex: 2,
            alignItems: 'center',
            flexDirection: 'row',
          },
        ]}>
        <Svg
          style={{ zIndex: 2 }}
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none">
          <Circle cx="4" cy="4" r="4" fill={color} />
        </Svg>
        {drawLine && (
          <Svg style={styles.statusIndicatorLine} height="32" width="3">
            <Line
              x1="0"
              x2="0"
              y1="0"
              y2="32"
              strokeWidth="3"
              stroke={Colors.neutralsZircon}
            />
          </Svg>
        )}
      </View>
    )
  }

  const renderStatusInfo = () => {
    const color = ['declined', 'cancelled'].includes(orderData.status)
      ? Colors.secondaryBrinkPink
      : Colors.primaryMidnightBlue
    return (
      <>
        <View style={styles.statusInfo}>
          {renderOrderStatusHistory()}
          <View style={[styleUtils.row, styleUtils.alignCenter]}>
            {renderStatusIndicator(orderData.status)}
            <Text style={[styles.activeStatusText, { color }]}>
              {orderStatus?.title}
            </Text>
          </View>
          <Text
            style={styles.statusDescription}
            numberOfLines={statusHistoryVisible ? null : 2}>
            {orderStatus?.message}
          </Text>
        </View>
      </>
    )
  }

  const renderStatusAnimation = () => {
    return (
      <View style={styles.statusAnimation}>
        {post.type && (
          <LottieView
            source={
              orderStatus.animation ||
              getStatusData({ userType, type: post.type, status: 'pending' })
                .animation
            }
            autoPlay
          />
        )}
        {orderStatus.withGradient && (
          <>
            <LinearGradient
              style={styles.gradient}
              colors={['rgba(255,255,255, 1)', 'rgba(255,255,255, .3)']}
              locations={[0.1, 0.7]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 1.0, y: 0 }}
            />
            <LinearGradient
              style={styles.gradient}
              colors={['rgba(255,255,255, .3)', 'rgba(255,255,255, 1)']}
              locations={[0.1, 0.7]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 1.0, y: 0 }}
            />
          </>
        )}
      </View>
    )
  }

  const renderOrderStatusHistory = () => {
    const history = orderStatusHistory?.slice?.(0, -1) || []
    return (
      post.id && (
        <View>
          {statusHistoryVisible &&
            history.map(({ status, date }) => {
              const { title } = getStatusData({
                userType,
                type: post.type,
                status,
                past: true,
              })

              return (
                <View key={date._seconds} style={styles.orderHistoryItem}>
                  <View>{renderStatusIndicator('confirmed', true, true)}</View>
                  <View>
                    <Text numberOfLines={1} style={styles.statusText}>
                      {title}
                    </Text>
                    <Text numberOfLines={1} style={styles.statusText}>
                      {moment
                        .unix(date._seconds)
                        .format('MMM D YYYY, h:mm a') || 'N/A'}
                    </Text>
                  </View>
                </View>
              )
            })}
        </View>
      )
    )
  }

  const renderShowDetailsToggle = () => {
    if (orderData.status === 'pending') return null

    const history = orderStatusHistory?.slice?.(0, -1) || []

    return (
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 120,
            create: {
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
          })
          setStatusHistoryVisible(!statusHistoryVisible)
        }}>
        <Text style={styles.buttonLink}>
          {statusHistoryVisible ? 'Hide' : 'Show'} details
        </Text>
      </TouchableOpacity>
    )
  }

  const renderAvatar = () => {
    const profilePhoto = orderData.buyerData?.profile_photo
    if (userType === 'seller')
      return (
        <View style={[styles.messagePhoto, styles.avatarImageWrapper]}>
          <Avatar
            path={profilePhoto}
            size="64x64"
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>
      )
    else if (userType === 'buyer') {
      return (
        <View style={[styles.messagePhoto, styles.postImageWrapper]}>
          <PostImage
            size="64x64"
            path={post?.cover_photos?.[0]}
            postType={post?.type?.toLowerCase()}
          />
        </View>
      )
    }
  }

  const renderStatusSection = () => {
    return (
      <View style={[styles.section, styles.orderStatus]}>
        <View style={styleUtils.row}>
          {renderStatusInfo()}
          {renderStatusAnimation()}
        </View>
        {renderShowDetailsToggle()}
      </View>
    )
  }

  const renderMessageSection = () => {
    const name =
      userType === 'buyer'
        ? orderData?.sellerData?.display_name ||
          orderData?.sellerData?.full_name
        : orderData?.buyerData?.display_name || orderData?.buyerData?.full_name

    return (
      <View style={styles.section}>
        <View style={[styleUtils.row, styleUtils.alignCenter]}>
          {renderAvatar()}
          <View>
            <Text style={styles.messageSectionName}>{name}</Text>
            <Text style={styles.messageSectionDescription}>
              Order # {orderData.id}
            </Text>
          </View>
        </View>
        <View style={styles.messageSectionButtonsWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleViewPostPress}
            style={[
              styles.messageSectionButtonWrapper,
              { marginRight: normalize(8) },
            ]}>
            <View style={styles.messageSectionButton}>
              <Icons.Eye
                style={styles.messageSectionButtonIcon}
                width={normalize(16)}
                height={normalize(16)}
              />
              <Text style={styles.messageSectionButtonText}>View Post</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleChatPress}
            style={styles.messageSectionButtonWrapper}>
            <View style={styles.messageSectionButton}>
              <Icons.Chat
                style={styles.messageSectionButtonIcon}
                width={normalize(16)}
                height={normalize(16)}
              />
              <Text style={styles.messageSectionButtonText}>Message</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderDeliverySection = () => {
    if (post.type === 'need') return
    return (
      <View style={styles.section}>
        <View style={styles.deliverFrom}>
          <LocationContactUs
            style={styles.sectionIcon}
            width={normalize(18)}
            height={normalize(18)}
          />
          <View style={styles.sectionInfo}>
            {['pickup', 'delivery'].includes(orderData.delivery_method) && (
              <AppText textStyle="body1">
                From{' '}
                <AppText textStyle="body1medium">
                  {orderData?.sellerData?.display_name ||
                    orderData?.sellerData?.full_name}
                </AppText>
              </AppText>
            )}

            <AppText
              textStyle="body2"
              customStyle={{ marginTop: normalize(7) }}>
              {post?.store_details?.location?.full_address}
            </AppText>
          </View>
        </View>
        {
          <View
            style={[
              styles.deliverTo,
              {
                paddingTop: normalize(10),
                borderTopWidth: 1,
              },
            ]}>
            <PostBox
              style={styles.sectionIcon}
              width={normalize(18)}
              height={normalize(18)}
            />
            <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
              <AppText
                textStyle="body1"
                customStyle={{ marginRight: normalize(5) }}>
                {orderData.delivery_method === 'delivery' &&
                post.type === 'sell'
                  ? 'Deliver to'
                  : orderData.delivery_method === 'pickup' &&
                    post.type === 'sell'
                  ? 'Pickup at'
                  : post.type === 'service' && orderData.status !== 'ongoing'
                  ? 'Service at'
                  : post.type === 'service' && orderData.status === 'ongoing'
                  ? 'Servicing at'
                  : null}
                &nbsp;
                <AppText textStyle="body1medium">
                  {orderData?.buyerData?.addresses.find(
                    address => address.default
                  ).name
                    ? orderData?.buyerData?.addresses.find(
                        address => address.default
                      ).name
                    : 'Home (default)'}
                </AppText>
              </AppText>
              <AppText
                textStyle="body2"
                customStyle={{ marginTop: normalize(7) }}>
                {
                  orderData?.buyerData?.addresses.find(
                    address => address.default
                  ).full_address
                }
              </AppText>
            </View>
          </View>
        }
      </View>
    )
  }

  const renderScheduleSection = () => {
    return (
      post.type === 'service' &&
      orderData.schedule && (
        <View style={styles.section}>
          <View style={styleUtils.row}>
            <PostCash width={normalize(20)} height={normalize(20)} />
            <View style={styles.sectionInfo}>
              <AppText textStyle="body1medium">
                Service requested on{' '}
                {moment(orderData?.schedule).format('MMMM D, YYYY')}
              </AppText>
              <AppText
                textStyle="body2"
                customStyle={{ marginTop: normalize(7) }}>
                at {moment(orderData?.schedule).format('h:mm a')}
              </AppText>
            </View>
          </View>
        </View>
      )
    )
  }

  const renderPaymentMethodSection = () => {
    const paymentMethods = {
      cash: {
        label: 'Cash on Delivery / Pick up',
        icon: () => <CashActive />,
      },
      card: {
        label: 'Visa / Mastercard',
        icon: () => <CreditCardActive />,
      },
      gcash: {
        label: 'GCash',
        icon: () => <GCashActive />,
      },
      grabpay: {
        label: 'GrabPay',
        icon: () => <GrabPayActive />,
      },
      paypal: {
        label: 'PayPal',
        icon: () => <PaypalActive />,
      },
      visa: {
        label: 'Visa',
        icon: () => <VisaActive />,
      },
      mastercard: {
        label: 'MasterCard',
        icon: () => <MasterCardActive />,
      },
    }

    return (
      <View style={styles.section}>
        <View style={{ flexDirection: 'row' }}>
          <PostCash
            style={styles.sectionIcon}
            width={normalize(18)}
            height={normalize(18)}
          />
          <View style={styles.sectionInfo}>
            <AppText textStyle="body1medium">
              {post.type !== 'need'
                ? 'Payment Method'
                : userType === 'seller'
                ? 'Offer'
                : 'Your offer'}
            </AppText>
          </View>
        </View>

        {['service', 'sell'].includes(post.type) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 16,
            }}>
            {paymentMethods[orderData.payment_method]?.icon()}
            <AppText
              textStyle={'body2medium'}
              customStyle={{ marginLeft: normalize(10) }}>
              {paymentMethods[orderData.payment_method]?.label}
            </AppText>
          </View>
        )}
        {post.type === 'need' && (
          <AppText textStyle="body2" customStyle={{ marginTop: normalize(7) }}>
            {commaSeparate(orderData?.price)}
          </AppText>
        )}
      </View>
    )
  }

  const renderSummarySection = () => {
    if (post.type === 'need') return

    return (
      <View style={styles.section}>
        <View style={[styleUtils.row]}>
          <PostNote
            style={styles.sectionIcon}
            width={normalize(18)}
            height={normalize(18)}
          />
          <AppText
            textStyle="body1medium"
            customStyle={{
              marginLeft: normalize(8),
              marginBottom: normalize(7),
            }}>
            Order Summary
          </AppText>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.neutralGray,
            paddingBottom: normalize(10),
          }}>
          {(orderData.items || []).map((item, index, arr) => {
            return (
              <View
                key={item.id || index}
                style={[
                  styles.summaryItem,
                  index === arr.length - 1
                    ? {}
                    : { paddingBottom: normalize(10) },
                ]}>
                <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
                  {post.type === 'sell' && (
                    <AppText
                      textStyle="body1"
                      color={Colors.secondaryLavenderBlue}
                      customStyle={{ marginRight: normalize(10) }}>
                      {item.quantity}x
                    </AppText>
                  )}
                  <View>
                    <AppText textStyle="body1medium">
                      {item.name || post.title}
                    </AppText>
                    {item.note && (
                      <AppText textStyle="caption">{item.note}</AppText>
                    )}
                  </View>
                </View>
                <AppText textStyle="body1" color={Colors.contentPlaceholder}>
                  ₱
                  {commaSeparate(
                    parseFloat((item.price + '').replace(/,/, '')) *
                      item.quantity
                  )}
                </AppText>
              </View>
            )
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: normalize(10),
          }}>
          <AppText textStyle="body1medium">Total</AppText>
          <AppText textStyle="body1medium">
            ₱{commaSeparate(totalPrice)}
          </AppText>
        </View>
      </View>
    )
  }

  const renderNotesSection = () => {
    return (
      <>
        {post.type === 'need' && orderData.notes?.length && (
          <View style={styles.section}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#E5E5E5',
                paddingBottom: normalize(10),
              }}>
              <View style={styleUtils.row}>
                <PostNote
                  style={styles.sectionIcon}
                  width={normalize(20)}
                  height={normalize(20)}
                />
                <View style={styles.sectionInfo}>
                  <AppText textStyle="body1medium">Order Notes</AppText>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: normalize(10),
              }}>
              <AppText textStyle="body1medium">{orderData.notes}</AppText>
            </View>
          </View>
        )}

        {(post.type === 'need' ||
          (post.type === 'service' && orderData.status === 'cancelled')) &&
          orderData.message?.length && (
            <View style={styles.section}>
              <View style={styleUtils.row}>
                {post.type === 'need' ? (
                  <PostNote
                    style={styles.sectionIcon}
                    width={normalize(18)}
                    height={normalize(18)}
                  />
                ) : (
                  <PostCash
                    style={styles.sectionIcon}
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                )}
                <View style={styles.sectionInfo}>
                  <AppText textStyle="body1medium">Message</AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    {orderData?.message}
                  </AppText>
                </View>
              </View>
            </View>
          )}
      </>
    )
  }

  const renderAttachedPost = () => {
    return (
      post.type === 'need' &&
      attachedPost && (
        <View style={[styles.section, { padding: 0, borderWidth: 0 }]}>
          <View style={{ flexDirection: 'row' }}>
            <Icons.SendMessage
              style={[
                styles.sectionIcon,
                { color: Colors.checkboxBorderDefault },
              ]}
              width={normalize(18)}
              height={normalize(18)}
            />
            <View style={[styles.sectionInfo, { marginBottom: normalize(12) }]}>
              <AppText textStyle="body1medium">Attached Post</AppText>
            </View>
          </View>
          <View style={[styles.section, { padding: 0, margin: 0 }]}>
            <Post data={attachedPost} renderLike={() => {}}></Post>
          </View>
        </View>
      )
    )
  }

  const renderActionButtons = () => {
    return (
      <>
        {userType === 'buyer' && (
          <>
            {orderData.status === 'pending' && (
              <>
                <View
                  style={{
                    backgroundColor: 'rgba(164, 167, 175, 0.1)',
                    height: 5,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: normalize(25),
                    paddingHorizontal: normalize(35),
                    justifyContent:
                      post.type === 'sell' ||
                      (post.type === 'service' &&
                        orderData.status === 'pending')
                        ? 'space-between'
                        : 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCancelModalVisible(true)}
                    style={{ width: '100%', alignItems: 'center' }}>
                    <AppText
                      textStyle="button2"
                      color={Colors.secondaryBrinkPink}>
                      {post.type === 'sell'
                        ? 'Cancel Order'
                        : post.type === 'service'
                        ? 'Cancel Request'
                        : 'Cancel Offer'}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {['sell', 'service'].includes(post.type) &&
              orderData.status === 'confirmed' &&
              orderData.payment_method !== 'cash' && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styleUtils.btnPrimary]}
                  onPress={() => handlePayment(orderData.payment_method)}>
                  <AppText textStyle="body2medium">Continue to Payment</AppText>
                  <AppText textStyle="body2">
                    ₱{commaSeparate(totalPrice)}
                  </AppText>
                </TouchableOpacity>
              )}

            {orderData.status === 'confirmed' &&
              post.type === 'service' &&
              orderData.payment_method === 'cash' && (
                <View style={{ padding: normalize(16) }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCancelModalVisible(true)}
                    style={{ width: '100%', alignItems: 'center' }}>
                    <AppText
                      textStyle="button2"
                      color={Colors.secondaryBrinkPink}>
                      Cancel Request
                    </AppText>
                  </TouchableOpacity>
                </View>
              )}
          </>
        )}

        {userType === 'seller' && (
          <>
            {orderData.status === 'pending' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: normalize(15),
                }}>
                <View style={{ width: '40%' }}>
                  <AppButton
                    type="secondary"
                    text="Decline"
                    onPress={() => setDeclineModalVisible(true)}
                  />
                </View>
                <View style={{ width: '55%' }}>
                  <AppButton
                    type="primary"
                    onPress={() => handleStatusChange('confirmed')}
                    text={
                      post.type === 'sell'
                        ? 'Confirm Order'
                        : post.type === 'need'
                        ? 'Confirm Offer'
                        : 'Confirm Request'
                    }
                  />
                </View>
              </View>
            )}

            {post.type === 'sell' &&
              orderData.status === 'confirmed' &&
              orderData.payment_method !== 'cash' && (
                <View
                  style={{
                    padding: normalize(16),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCancelModalVisible(true)}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AppText
                      textStyle="button2"
                      color={Colors.secondaryBrinkPink}>
                      {post.type === 'sell'
                        ? 'Cancel Order'
                        : post.type === 'service'
                        ? 'Cancel Request'
                        : null}
                    </AppText>
                  </TouchableOpacity>
                </View>
              )}

            {post.type === 'sell' &&
              ((orderData.status === 'confirmed' &&
                orderData.payment_method === 'cash') ||
                orderData.status === 'paid') && (
                <View style={{ padding: normalize(16) }}>
                  <>
                    {orderData.delivery_method === 'delivery' &&
                      ((orderData.status === 'confirmed' &&
                        orderData.payment_method === 'cash') ||
                        (orderData.status === 'paid' &&
                          orderData.payment_method !== 'cash')) && (
                        <AppButton
                          type="primary"
                          onPress={() => handleStatusChange('delivering')}
                          text="Confirm for Delivery"
                        />
                      )}
                    {orderData.delivery_method === 'pickup' &&
                      ((orderData.status === 'confirmed' &&
                        orderData.payment_method === 'cash') ||
                        (orderData.status === 'paid' &&
                          orderData.payment_method !== 'cash')) && (
                        <AppButton
                          type="primary"
                          onPress={() => handleStatusChange('pickup')}
                          text="Confirm for Pick Up"
                        />
                      )}
                  </>
                </View>
              )}

            {post.type === 'service' && (
              <>
                <View style={{ padding: normalize(16) }}>
                  {(orderData.status === 'confirmed' &&
                    orderData.payment_method === 'cash') ||
                  (orderData.status === 'paid' &&
                    orderData.payment_method !== 'cash') ? (
                    <AppButton
                      type="primary"
                      onPress={() => handleStatusChange('completed')}
                      text="Order Completed"
                      customStyle={{ marginBottom: 16 }}
                    />
                  ) : null}
                  {!['completed', 'cancelled', 'declined', 'pending'].includes(
                    orderData.status
                  ) && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setCancelModalVisible(true)}
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        padding: normalize(12),
                      }}>
                      <AppText
                        textStyle="button2"
                        color={Colors.secondaryBrinkPink}>
                        Cancel Request
                      </AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {post.type === 'sell' &&
              ['delivering', 'pickup'].includes(orderData.status) && (
                <View style={{ padding: normalize(16) }}>
                  <AppButton
                    type="primary"
                    onPress={() => handleStatusChange('completed')}
                    text="Order Completed"
                  />
                </View>
              )}

            {post.type === 'need' && orderData.status === 'confirmed' && (
              <View style={{ padding: normalize(16) }}>
                <AppButton
                  type="primary"
                  onPress={() => handleStatusChange('completed')}
                  text="Offer Completed"
                />
              </View>
            )}

            {['completed', 'cancelled', 'declined'].includes(
              orderData.status
            ) && (
              <View style={{ padding: normalize(16) }}>
                <AppButton
                  type="primary"
                  onPress={navigation.goBack}
                  text="Done"
                />
              </View>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.headerBackground} />
      <TransitionIndicator loading={isLoading} />
      <ScreenHeaderTitle
        close={navigation.goBack}
        title={title}
        paddingSize={3}
      />
      {notificationMessage && (
        <Notification
          onClose={() => setNotificationMessage(null)}
          type="success"
          icon={<CircleTickWhite />}>
          <AppText
            textStyle="body2"
            customStyle={{ marginLeft: 14 }}
            color={Colors.neutralsWhite}>
            {notificationMessage}
          </AppText>
        </Notification>
      )}

      <ScrollView
        style={styles.scrollWrapper}
        refreshControl={
          <RefreshControl
            style={{ zIndex: 1 }}
            refreshing={isRefreshing}
            titleColor="#2E3034"
            tintColor="#2E3034"
            onRefresh={handleRefresh}
          />
        }>
        {renderStatusSection()}
        {renderMessageSection()}
        {renderDeliverySection()}
        {renderScheduleSection()}
        {renderPaymentMethodSection()}
        {renderSummarySection()}
        {renderNotesSection()}
        {renderAttachedPost()}
      </ScrollView>

      {renderActionButtons()}

      <Modal
        isVisible={cancelModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setCancelModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setCancelModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <BottomSheetHeader />
        <CancelOrderModal
          onCancelPress={handleCancel}
          onBackPress={() => setCancelModalVisible(false)}
          cancelText={
            post.type === 'sell'
              ? 'Cancel Order'
              : post.type === 'service'
              ? 'Cancel Request'
              : 'Cancel'
          }
        />
      </Modal>

      <Modal
        isVisible={declineModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setDeclineModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setDeclineModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <BottomSheetHeader />
        <DeclineOrderModal
          onDeclinePress={handleDecline}
          onBackPress={() => setDeclineModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  activeStatusText: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    marginLeft: normalize(16),
  },
  avatarImageWrapper: {
    borderRadius: 35 / 2,
  },
  buttonLink: {
    color: Colors.contentOcean,
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    letterSpacing: 1.25,
  },
  deliverFrom: {
    flexDirection: 'row',
    paddingBottom: normalize(10),
  },
  deliverTo: {
    borderTopColor: Colors.neutralGray,
    flexDirection: 'row',
  },
  gradient: {
    backgroundColor: 'transparent',
    height: 60,
    left: 0,
    position: 'absolute',
    width: 12,
  },
  headerBackground: {
    backgroundColor: '#EDF0F8',
    height: normalize(150),
    left: 0,
    opacity: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: -1,
  },
  messagePhoto: {
    height: normalize(36),
    marginRight: normalize(10),
    overflow: 'hidden',
    width: normalize(36),
  },
  messageSectionButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondarySolitude,
    borderRadius: normalize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: normalize(8),
  },
  messageSectionButtonIcon: {
    color: Colors.contentOcean,
  },
  messageSectionButtonsWrapper: {
    flexDirection: 'row',
    marginTop: normalize(12),
  },
  messageSectionButtonText: {
    color: Colors.contentOcean,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: 0.4,
    lineHeight: normalize(18),
    marginLeft: normalize(6),
  },
  messageSectionButtonWrapper: {
    flex: 1,
  },
  messageSectionDescription: {
    color: Colors.checkboxBorderDefault,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: 0.4,
    lineHeight: normalize(18),
  },
  messageSectionName: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  orderHistoryItem: {
    flexDirection: 'row',
    marginBottom: normalize(8),
  },
  orderStatus: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    elevation: 12,
    marginTop: normalize(16),
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  postImageWrapper: {
    borderRadius: 8,
  },
  scrollWrapper: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.neutralsWhite,
    borderColor: Colors.neutralsZirconLight,
    borderRadius: 4,
    borderWidth: 1,
    margin: normalize(16),
    marginTop: 0,
    padding: normalize(16),
  },
  sectionIcon: {
    marginTop: normalize(3),
  },
  sectionInfo: {
    marginLeft: normalize(8),
  },
  statusAnimation: {
    flexBasis: 120,
    height: 60,
    position: 'relative',
  },
  statusDescription: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(21),
    marginTop: normalize(2),
    letterSpacing: 0.4,
    color: Colors.contentPlaceholder,
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
  },
  statusIndicatorLine: {
    left: 3,
    position: 'absolute',
    top: '50%',
  },
  statusInfo: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
  },
  statusText: {
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: 0.4,
    lineHeight: normalize(18),
    marginLeft: normalize(16),
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
  },
})

const styleUtils = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  btnPrimary: {
    padding: normalize(16),
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryYellow,
    borderRadius: 5,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 24,
    marginHorizontal: 16,
  },
})

export default OrderTrackerScreen
