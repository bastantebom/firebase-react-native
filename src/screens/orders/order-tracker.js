import React, { useCallback, useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

import { Colors, normalize } from '@/globals'
import { TransitionIndicator } from '@/components'
import {
  Alert,
  LayoutAnimation,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  Linking,
} from 'react-native'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import { capitalize } from 'lodash'
import { Icons } from '@/assets/images/icons'
import { View } from 'native-base'
import Svg, { Circle, Line } from 'react-native-svg'
import getStatusData from './utils/order-statuses'
import LinearGradient from 'react-native-linear-gradient'
import LottieView from 'lottie-react-native'
import getStatusColor from './utils/order-status-color'

import moment from 'moment'
import { iconSize, parseTime, useInterval } from '@/globals/Utils'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import { formatNumber } from 'react-native-currency-input'
import typography from '@/globals/typography'
import PostCard from '../Post/components/post-card'
import utilStyles from '@/globals/util-styles'
import { format } from 'date-fns'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'
import Button from '@/components/Button'
import { Images } from '@/assets/images'
import ModalComponent from './modals'
import Dialog from '@/screens/orders/modals/components/dialog'
import { useFocusEffect } from '@react-navigation/native'
import StatusBar from '@/components/StatusBar'

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
  const [paymentData, setPaymentData] = useState()
  const [orderStatus, setOrderStatus] = useState({})
  const [title, setTitle] = useState('Order status')
  const [userType, setUserType] = useState('')
  const [attachedPost, setAttachedPost] = useState(null)

  const [statusHistoryVisible, setStatusHistoryVisible] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const [declineOrderModalVisible, setDeclineOrderModalVisible] = useState(
    false
  )
  const [cancelOrderModalVisible, setCancelOrderModalVisible] = useState(false)
  const [confirmOrderModalVisible, setConfirmOrderModalVisible] = useState(
    false
  )
  const [
    confirmDeliveryModalVisible,
    setConfirmDeliveryModalVisible,
  ] = useState(false)
  const [pickupOrderModalVisible, setPickupOrderModalVisible] = useState(false)
  const [completeOrderModalVisible, setCompleteOrderModalVisible] = useState(
    false
  )

  const [orderStatusHistory, setOrderStatusHistory] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [allowRetryPayment, setAllowRetryPayment] = useState(false)

  useFocusEffect(
    useCallback(() => {
      handleRefresh(false)
      const subscribers = []

      subscribers.push(
        firestore()
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
                  postType: post.type,
                  orderData: data,
                  allowRetryPayment,
                })
                setOrderStatus(statusData)
              }
            } catch (error) {
              console.log(error)
              Toast.show({
                label: 'Oops! Something went wrong.',
                type: 'error',
                dismissible: true,
                timeout: 5000,
                screenId: 'order-tracker',
              })
            }
            Platform.OS === 'android' && setIsLoading(false)
          })
      )

      subscribers.push(
        firestore()
          .collection('payments')
          .where('order_id', '==', orderID)
          .orderBy('date_created', 'desc')
          .limit(1)
          .onSnapshot(snapshot => {
            const payments = snapshot?.docs?.map(doc => doc.data()) || []

            setPaymentData(payments[0])
          })
      )

      return () => {
        for (const subscriber of subscribers) {
          subscriber()
        }
      }
    }, [navigation, orderID])
  )

  useEffect(() => {
    const newUserType = orderData.seller_id === user.uid ? 'seller' : 'buyer'
    const newTitle = getTitle()
    const newTotal =
      orderData.offer ||
      (orderData?.items || []).reduce(
        (total, item) => total + item.price * (item.quantity || 1),
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

  useInterval(
    () => {
      if (
        paymentData &&
        orderData.status === 'payment processing' &&
        Date.now() / 1000 - paymentData.date_created._seconds > 60 * 2
      )
        setAllowRetryPayment(true)
    },
    !allowRetryPayment && orderData?.status === 'payment processing'
      ? 1000
      : null,
    [paymentData?.date_created, orderData.status]
  )

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
            return 'Order Status'
          case 'cancelled':
          case 'completed':
            return capitalize(status)
          default:
            return 'Service Request'
        }
      } else if (post.type === 'need') {
        return 'Offer Summary'
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
      const promises = []
      promises.push(
        (async () => {
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

          if (typeof data.attached_post === 'string') {
            const response = await Api.getPost({
              pid: data.attached_post,
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
              postType: postData.type,
              orderData: data,
              allowRetryPayment,
            })
          )
        })()
      )

      promises.push(
        (async () => {
          const snapshot = firestore()
            .collection('payments')
            .where('order_id', '==', orderID)
            .orderBy('date_created', 'desc')
            .limit(5)
            .get()

          const payments = snapshot?.docs?.map(doc => doc.data()) || []

          setPaymentData(payments[0])
        })()
      )

      await Promise.all(promises)
    } catch (error) {
      console.log(error)
    }
    setIsRefreshing(false)
    setIsLoading(false)
  }

  const handleOnPayment = method => {
    if (method === 'cash') return
    navigation.navigate('payments', {
      screen: method,
      params: {
        orderData,
      },
    })
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
          participants: [user.uid, otherUID],
          post_id: orderData.post_id,
          buyer_id: user.uid,
          seller_id: otherUID,
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
    handleStatusChange('cancelled')
    setCancelOrderModalVisible(false)
  }

  const handleStatusChange = async status => {
    setIsLoading(true)
    try {
      const body = { status }
      if (status === 'cancelled') body.cancelled_by = userType
      const orderRef = await firestore().doc(`orders/${orderID}`).get()
      const order = orderRef.data()

      if (
        status === order.status ||
        (status === 'confirmed' &&
          order.history.some(_status => _status === 'confirmed')) ||
        (status === 'cancelled' &&
          order.history.some(_status => _status === 'cancelled')) ||
        (status === 'declined' &&
          order.history.some(_status => _status === 'declined')) ||
        (status === 'completed' &&
          order.history.some(_status => _status === 'completed'))
      )
        return setIsLoading(false)

      const response = await Api.updateOrder({
        uid: user.uid,
        id: orderData.id,
        body,
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

    const orderStatus = post.type
      ? getStatusData({
          userType,
          postType: post.type,
          orderData,
          allowRetryPayment,
        })
      : {}
    return (
      <>
        <View style={styles.statusInfo}>
          {renderOrderStatusHistory()}
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            {renderStatusIndicator(orderData.status)}
            <Text
              style={[
                typography.body1,
                typography.medium,
                styles.activeStatusText,
                { color },
              ]}>
              {orderStatus?.title}
            </Text>
          </View>
          <Text
            style={[typography.body2, styles.statusDescription]}
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
        {!!post.type && (
          <LottieView
            source={
              orderStatus.animation ||
              getStatusData({
                userType,
                postType: post.type,
                orderData: { status: 'pending' },
                allowRetryPayment,
              }).animation
            }
            autoPlay
          />
        )}
        {!!orderStatus.withGradient && (
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
      !!post.id && (
        <View>
          {statusHistoryVisible &&
            history.map(({ status, date }) => {
              const { title } = getStatusData({
                userType,
                postType: post.type,
                past: true,
                orderData: { status },
                allowRetryPayment,
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
        <Text style={[typography.caption, typography.link]}>
          {statusHistoryVisible ? 'Hide' : 'Show'} details
        </Text>
      </TouchableOpacity>
    )
  }

  const renderAvatar = () => {
    const profilePhoto = orderData.buyerData?.profile_photo
    const handleOnAvatarPress = () => {
      if (userType === 'seller')
        navigation.navigate('NBTScreen', {
          screen: 'OthersProfile',
          params: { uid: orderData.buyerData?.uid },
        })
      else if (userType === 'buyer' && post?.id) {
        if (post?.archived) {
          navigation.push('NBTScreen', {
            screen: 'unavailable-archive',
          })
        } else {
          navigation.push('NBTScreen', {
            screen: 'posts',
            params: {
              screen: 'published-post',
              params: {
                id: post?.id,
                uid: post?.uid,
              },
            },
          })
        }
      }
    }

    if (userType === 'seller')
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOnAvatarPress}
          style={[styles.messagePhoto, styles.avatarImageWrapper]}>
          <Avatar
            path={profilePhoto}
            size="64x64"
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </TouchableOpacity>
      )
    else if (userType === 'buyer') {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOnAvatarPress}
          style={[styles.messagePhoto, styles.postImageWrapper]}>
          <PostImage
            size="64x64"
            path={post?.cover_photos?.[0]}
            postType={post?.type?.toLowerCase()}
          />
        </TouchableOpacity>
      )
    }
  }

  const renderStatusSection = () => {
    return (
      <View style={[styles.section, styles.orderStatus]}>
        <View style={utilStyles.row}>
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

    const handelOnNamePress = () => {
      const uid =
        userType === 'buyer'
          ? orderData?.sellerData?.uid
          : orderData.buyerData.uid
      if (!uid) return

      if (user?.uid === uid) {
        navigation.navigate('TabStack', { screen: 'You' })
      } else {
        navigation.push('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'profile',
            params: { uid: uid },
          },
        })
      }
    }

    const handleOnPostTitlePress = () => {
      if (!post?.id) return
      if (post?.archived) {
        navigation.push('NBTScreen', {
          screen: 'unavailable-archive',
        })
      } else {
        navigation.push('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'published-post',
            params: {
              id: post?.id,
              uid: post?.uid,
            },
          },
        })
      }
    }

    const labels = {
      sell: userType === 'seller' ? 'Sold to' : 'Sold by',
      need: userType === 'seller' ? 'Posted by' : 'Offer by',
      service: userType === 'seller' ? 'Booked by' : 'Service by',
    }

    const label = labels[post.type]

    return (
      <View style={styles.section}>
        <View style={[utilStyles.row, utilStyles.alignCenter]}>
          {renderAvatar()}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOnPostTitlePress}>
              <Text style={[typography.body2, typography.medium]}>
                {post.title}
              </Text>
            </TouchableOpacity>
            <View style={[utilStyles.row, utilStyles.alignCenter]}>
              <Text
                style={[
                  typography.body2,
                  { color: Colors.contentPlaceholder },
                ]}>
                {label}{' '}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handelOnNamePress}>
                <Text style={typography.medium}>{name}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.messageSectionButtonsWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleChatPress}
            style={styles.messageSectionButtonWrapper}>
            <View style={styles.messageSectionButton}>
              <Icons.Chat
                style={styles.messageSectionButtonIcon}
                {...iconSize(16)}
              />
              <Text style={styles.messageSectionButtonText}>Message</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const getTimeSlot = timeSlot => {
    switch (timeSlot) {
      case 'morning':
        return `Morning [9am-12nn]`
      case 'afternoon':
        return `Afternoon [1pm-6pm]`
      case 'evening':
        return `Night [6pm-10pm]`
      default:
        return ''
    }
  }

  const renderShippingDetails = () => {
    if (!['sell', 'service'].includes(post.type)) return
    const label = post.type === 'sell' ? 'Shipping Details' : 'Service Details'

    const handleOnViewMapPress = () => {
      if (!user.uid) return
      navigation.navigate('NBTScreen', {
        screen: 'posts',
        params: {
          screen: 'map-direction',
          params: {
            data: post,
            user:
              userType === 'buyer'
                ? orderData?.buyerData
                : orderData?.sellerData,
          },
        },
      })
    }

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.OrderDetails style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>{label}</Text>
        </View>
        {!!orderData.booking_schedule?.schedule && (
          <View style={[styles.section, { marginBottom: normalize(8) }]}>
            <View style={[styles.sectionItem]}>
              <Text
                style={[
                  typography.body2,
                  { color: Colors.contentPlaceholder },
                ]}>
                Date
              </Text>
              <Text style={[typography.body2, typography.medium]}>
                {orderData.booking_schedule.schedule}
              </Text>
            </View>
            {orderData.booking_schedule?.flexible && (
              <View style={[styles.sectionItem, { marginTop: normalize(8) }]}>
                <Text
                  style={[
                    typography.body2,
                    {
                      color: Colors.contentPlaceholder,
                    },
                  ]}>
                  Preferred time
                </Text>
                <Text style={[typography.body2, typography.medium]}>
                  Flexi [9am-10pm]
                </Text>
              </View>
            )}
            {orderData.booking_schedule.time_slot && (
              <View style={[styles.sectionItem, { marginTop: normalize(8) }]}>
                <Text
                  style={[
                    typography.body2,
                    { color: Colors.contentPlaceholder, width: '45%' },
                  ]}>
                  {!orderData.booking_schedule?.flexible
                    ? 'Preferred time '
                    : 'Other available time '}
                </Text>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    { alignSelf: 'flex-start' },
                  ]}>
                  {getTimeSlot(orderData.booking_schedule.time_slot)}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.section}>
          {orderData.booking_method === 'walkin' && (
            <>
              <View style={styles.shippingInfoWrapper}>
                <Icons.Navigation
                  style={styles.shippingInfoIcon}
                  {...iconSize(16)}
                />
                <View style={styles.shippingInfo}>
                  <Text style={typography.body1}>
                    Service at{' '}
                    <Text style={typography.medium}>{post.title}</Text>
                  </Text>
                  <Text style={[typography.body2, { marginTop: normalize(4) }]}>
                    {orderData.booking_address?.full_address
                      .split(', ')
                      .slice(0, -1)
                      .join(', ')}
                    <Text style={{ color: Colors.neutralsIron }}> • </Text>
                    <Text
                      style={[
                        typography.medium,
                        typography.link,
                        { zIndex: 10 },
                      ]}
                      onPress={handleOnViewMapPress}>
                      View Map
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
          {orderData.booking_method === 'appointment' && (
            <>
              <View style={styles.shippingInfoWrapper}>
                <Icons.Navigation
                  style={styles.shippingInfoIcon}
                  {...iconSize(16)}
                />
                <View style={styles.shippingInfo}>
                  <Text style={typography.body1}>
                    Service at{' '}
                    <Text style={typography.medium}>
                      {orderData.booking_address
                        ? orderData.booking_address.full_address.split(',')[0]
                        : ''}
                    </Text>
                  </Text>
                  <Text style={[typography.body2, { marginTop: normalize(4) }]}>
                    {orderData.booking_address
                      ? orderData.booking_address.full_address
                          .split(', ')
                          .slice(0, -1)
                          .join(', ')
                      : ''}
                    <Text style={{ color: Colors.neutralsIron }}> • </Text>
                    <Text
                      style={[
                        typography.medium,
                        typography.link,
                        { zIndex: 10 },
                      ]}
                      onPress={handleOnViewMapPress}>
                      View Map
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
          {orderData.shipping_method === 'delivery' && (
            <>
              <View style={styles.shippingInfoWrapper}>
                <Icons.Navigation
                  style={styles.shippingInfoIcon}
                  {...iconSize(16)}
                />
                <View style={styles.shippingInfo}>
                  <Text style={typography.body1}>
                    From{' '}
                    <Text style={typography.medium}>
                      {orderData?.sellerData?.display_name ||
                        orderData?.sellerData?.full_name}
                    </Text>
                  </Text>

                  <Text style={[typography.body2, { marginTop: normalize(4) }]}>
                    {post?.location?.full_address
                      .split(', ')
                      .slice(0, -1)
                      .join(', ')}
                    <Text style={{ color: Colors.neutralsIron }}> • </Text>
                    <Text
                      style={[
                        typography.medium,
                        typography.link,
                        { zIndex: 10 },
                      ]}
                      onPress={handleOnViewMapPress}>
                      View Map
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginVertical: normalize(16),
                  height: normalize(1),
                  width: '100%',
                  backgroundColor: Colors.Gainsboro,
                }}
              />
              <View>
                <View style={styles.shippingInfoWrapper}>
                  <Icons.Navigation
                    style={styles.shippingInfoIcon}
                    {...iconSize(16)}
                  />
                  <View style={styles.shippingInfo}>
                    <Text style={typography.body1}>
                      Deliver to{' '}
                      <Text style={typography.medium}>
                        {orderData.shipping_address
                          ? orderData.shipping_address.full_address.split(
                              ','
                            )[0]
                          : ''}
                      </Text>
                    </Text>
                    <Text
                      style={[typography.body2, { marginTop: normalize(4) }]}>
                      {orderData.shipping_address
                        ? orderData.shipping_address.full_address
                            .split(', ')
                            .slice(0, -1)
                            .join(', ')
                        : ''}
                      <Text style={{ color: Colors.neutralsIron }}> • </Text>
                      <Text
                        style={[
                          typography.medium,
                          typography.link,
                          { zIndex: 10 },
                        ]}
                        onPress={handleOnViewMapPress}>
                        View Map
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {orderData.shipping_method === 'pickup' && (
            <>
              <View style={styles.shippingInfoWrapper}>
                <Icons.Navigation
                  style={styles.shippingInfoIcon}
                  {...iconSize(16)}
                />
                <View style={styles.shippingInfo}>
                  <Text style={typography.body1}>
                    Pick up at{' '}
                    <Text style={typography.medium}>
                      {orderData?.sellerData?.display_name ||
                        orderData?.sellerData?.full_name}
                    </Text>
                  </Text>

                  <Text style={typography.body2}>
                    {post?.location?.full_address
                      .split(', ')
                      .slice(0, -1)
                      .join(', ')}
                    <Text style={{ color: Colors.neutralsIron }}> • </Text>
                    <Text
                      style={[
                        typography.medium,
                        typography.link,
                        { zIndex: 10 },
                      ]}
                      onPress={handleOnViewMapPress}>
                      View Map
                    </Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </>
    )
  }

  const renderOfferDetailsSection = () => {
    if (post.type !== 'need') return

    const handleOnAttachedPostPress = () => {
      navigation.push('NBTScreen', {
        screen: 'posts',
        params: {
          screen: 'published-post',
          params: {
            id: attachedPost?.id,
            uid: attachedPost?.uid,
          },
        },
      })
    }

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.OrderDetails style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>
            Offer Details
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={typography.body2}>Offer</Text>
          <Text
            style={[
              typography.body1,
              typography.medium,
              { marginTop: normalize(4) },
            ]}>
            ₱
            {formatNumber(orderData.offer, {
              separator: '.',
              precision: 2,
              delimiter: ',',
            })}
          </Text>

          {!!orderData.message?.length && (
            <>
              <View
                style={{
                  marginVertical: normalize(16),
                  height: normalize(1),
                  width: '100%',
                  backgroundColor: Colors.Gainsboro,
                }}
              />
              <Text style={[typography.body2, typography.medium]}>Message</Text>
              <Text style={[typography.body2, { marginTop: normalize(8) }]}>
                {orderData.message}
              </Text>
            </>
          )}

          {!!orderData.attached_post && !!attachedPost && (
            <>
              <View
                style={{
                  marginVertical: normalize(16),
                  height: normalize(1),
                  width: '100%',
                  backgroundColor: Colors.Gainsboro,
                }}
              />
              <Text style={[typography.body2, typography.medium]}>
                Attached Post
              </Text>
              <PostCard
                post={attachedPost}
                containerStyle={{ marginTop: normalize(16) }}
                onCardPress={handleOnAttachedPostPress}
                showLikeButton={false}
              />
            </>
          )}
        </View>
      </>
    )
  }

  const renderOrderDetailsSection = () => {
    if (!orderData) return

    const date =
      orderData.date &&
      format(
        new Date(new Date(orderData.date._seconds * 1000)),
        `MMM${new Date().getMonth() === 4 ? '' : '.'} dd, yyyy hh:mmaa`
      )

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.OrderDetails style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>
            Order Details
          </Text>
        </View>
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={typography.body2}>Order ID</Text>
            <Text style={[typography.body2, typography.medium]}>
              {orderData.id}
            </Text>
          </View>
          {!!date && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: normalize(8),
              }}>
              <Text style={typography.body2}>Order Placed</Text>
              <Text style={[typography.body2, typography.medium]}>{date}</Text>
            </View>
          )}
        </View>
      </>
    )
  }

  const renderPaymentInformationSection = () => {
    const paymentMethods = {
      cash: {
        label: 'Cash on Delivery / Pick up',
        icon: <Icons.CashPaymentActive />,
      },
      card: {
        label: 'Visa / Mastercard',
        icon: <Icons.CardPaymentActive />,
      },
      gcash: {
        label: 'GCash',
        icon: <Icons.GCashPaymentActive />,
      },
      grabpay: {
        label: 'GrabPay',
        icon: <Icons.GrabPayPaymentActive />,
      },
      paypal: {
        label: 'PayPal',
        icon: <Icons.PayPalPaymentActive />,
      },
    }

    const { icon, label } = paymentMethods[orderData.payment_method] || {}

    const date =
      paymentData?.date_paid &&
      format(
        new Date(paymentData.date_paid._seconds * 1000),
        `MMM${new Date().getMonth() === 4 ? '' : '.'} dd, yyyy hh:mmaa`
      )

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.Cash style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>
            Payment Information
          </Text>
        </View>
        <View style={styles.section}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            {icon}
            <Text
              style={[
                typography.body2,
                typography.medium,
                { marginLeft: normalize(10) },
              ]}>
              {label}
            </Text>
          </View>
          {paymentData && (
            <>
              {orderData.status === 'payment processing' && (
                <View
                  style={[
                    utilStyles.row,
                    utilStyles.alignCenter,
                    { marginTop: normalize(16) },
                  ]}>
                  <Icons.InfoCircle
                    style={{
                      color: Colors.icon,
                      marginRight: normalize(4),
                    }}
                    {...iconSize(16)}
                  />
                  <Text
                    style={[
                      typography.caption,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    {userType === 'buyer'
                      ? 'Your payment is still processing.'
                      : 'Payment is still processing'}
                  </Text>
                </View>
              )}
              {!!paymentData?.payment_id && (
                <>
                  <Text
                    style={[typography.body2, { marginTop: normalize(16) }]}>
                    Payment Reference
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      typography.medium,
                      { marginTop: normalize(4) },
                    ]}>
                    {paymentData.payment_id}
                  </Text>
                </>
              )}
              {!!date && (
                <>
                  <Text
                    style={[typography.body2, { marginTop: normalize(16) }]}>
                    Paid on
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      typography.medium,
                      { marginTop: normalize(4) },
                    ]}>
                    {date}
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </>
    )
  }

  const renderSummarySection = () => {
    if (!post) return

    const fee = paymentData?.fee || 0
    const total =
      userType === 'seller' && orderData.payment_method !== 'cash'
        ? totalPrice - fee
        : totalPrice

    const labels = {
      need: 'Offer Summary',
      service: 'Booking Summary',
      sell: 'Order Summary',
    }
    const label = labels[post.type]

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.Summary style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>{label}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.summary}>
            {['sell', 'service'].includes(post.type) &&
              (orderData.items || []).map((item, index, arr) => {
                return (
                  <View
                    key={item.id || index}
                    style={[
                      styles.summaryItem,
                      index === arr.length - 1
                        ? {}
                        : { paddingBottom: normalize(10) },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        maxWidth: '70%',
                        flex: 1,
                      }}>
                      <Text style={[typography.body1, styles.itemQuantity]}>
                        {item.quantity || 1}x
                      </Text>
                      <View>
                        <Text
                          style={[
                            typography.body2,
                            typography.medium,
                            { paddingRight: normalize(8) },
                          ]}>
                          {item.name || post.title}
                        </Text>
                        {!!item.notes && (
                          <Text
                            style={[
                              typography.body2,
                              { marginTop: normalize(4) },
                            ]}>
                            {item.notes}
                          </Text>
                        )}
                        {(item.schedule || orderData.schedule) && (
                          <Text
                            style={[
                              typography.body2,
                              { marginTop: normalize(4) },
                            ]}>
                            {format(
                              new Date(item.schedule || orderData.schedule),
                              `MMMM dd, yyyy 'at' '${parseTime(
                                new Date(item.schedule || orderData.schedule)
                              )}'`
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text
                      style={[
                        typography.body2,
                        { color: Colors.contentPlaceholder },
                      ]}>
                      ₱
                      {formatNumber(item.price, {
                        separator: '.',
                        precision: 2,
                        delimiter: ',',
                      })}
                    </Text>
                  </View>
                )
              })}
            {post.type === 'need' && (
              <View style={styles.summaryItem}>
                <View style={{ flexDirection: 'row', maxWidth: '70%' }}>
                  <Text style={[typography.body2, typography.medium]}>
                    Offer
                  </Text>
                </View>
                <Text
                  style={[
                    typography.body2,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  ₱
                  {formatNumber(orderData.offer, {
                    separator: '.',
                    precision: 2,
                    delimiter: ',',
                  })}
                </Text>
              </View>
            )}
          </View>
          <View>
            {userType === 'seller' && orderData.payment_method !== 'cash' && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: normalize(12),
                  }}>
                  <Text style={[typography.body2]}>Servbees Fee</Text>
                  <Text style={[typography.body2]}>
                    - ₱
                    {formatNumber(0, {
                      separator: '.',
                      precision: 2,
                      delimiter: ',',
                    })}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: normalize(12),
                  }}>
                  <View style={[utilStyles.row, utilStyles.alignCenter]}>
                    <Text style={[typography.body2]}>Payment Fees</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
                      <Icons.InfoCircle
                        style={{ color: Colors.icon, marginLeft: normalize(6) }}
                        {...iconSize(16)}
                      />
                    </TouchableOpacity>
                  </View>
                  {!!paymentData?.payment_id ? (
                    <Text style={[typography.body2]}>
                      - ₱
                      {formatNumber(fee, {
                        separator: '.',
                        precision: 2,
                        delimiter: ',',
                      })}
                    </Text>
                  ) : (
                    <Text style={[typography.body2, { color: Colors.icon }]}>
                      awaiting payment
                    </Text>
                  )}
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: normalize(12),
              }}>
              <Text style={[typography.body1narrow, typography.medium]}>
                Total
              </Text>
              <Text style={[typography.body1narrow, typography.medium]}>
                ₱
                {formatNumber(total, {
                  separator: '.',
                  precision: 2,
                  delimiter: ',',
                })}
              </Text>
            </View>
          </View>
        </View>
      </>
    )
  }

  const renderActionButtons = () => {
    const handleOnSeeOtherPostPress = () => {
      navigation.navigate('TabStack', {
        screen: 'Servbees',
      })
    }

    return (
      <View style={styles.buttonsWrapper}>
        <LinearGradient
          style={{
            height: normalize(20),
            width: '100%',
            position: 'absolute',
            top: normalize(-20),
            zIndex: 1,
          }}
          colors={['transparent', 'rgba(65,65,65,0.05)']}
          locations={[0, 1]}
          pointerEvents="none"
        />
        {userType === 'buyer' && (
          <>
            {orderData.status === 'pending' && (
              <>
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
                    onPress={() => setCancelOrderModalVisible(true)}
                    style={{ width: '100%', alignItems: 'center' }}>
                    <Text
                      style={[
                        typography.body1,
                        typography.medium,
                        { color: Colors.secondaryBrinkPink },
                      ]}>
                      {post.type === 'sell'
                        ? 'Cancel Order'
                        : post.type === 'service'
                        ? 'Cancel Request'
                        : 'Cancel Offer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {(orderData.status === 'confirmed' ||
              (orderData.status === 'payment processing' &&
                allowRetryPayment)) &&
              post.type !== 'need' &&
              orderData.payment_method !== 'cash' && (
                <Button
                  style={{
                    margin: normalize(16),
                    marginBottom: normalize(24),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  type="primary"
                  onPress={() => handleOnPayment(orderData.payment_method)}>
                  <Text style={[typography.body1narrow, typography.medium]}>
                    Continue to Payment
                  </Text>
                  <Text style={typography.subtitle1}>
                    ₱
                    {formatNumber(totalPrice, {
                      separator: '.',
                      precision: 2,
                      delimiter: ',',
                    })}
                  </Text>
                </Button>
              )}

            {orderData.status === 'confirmed' &&
              post.type === 'service' &&
              orderData.payment_method === 'cash' && (
                <View style={{ padding: normalize(16) }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCancelOrderModalVisible(true)}
                    style={{ width: '100%', alignItems: 'center' }}>
                    <Text
                      style={[
                        typography.body1,
                        typography.medium,
                        { color: Colors.secondaryBrinkPink },
                      ]}>
                      Cancel Request
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            {post.type === 'need' && orderData.status === 'cancelled' && (
              <View style={{ padding: normalize(16) }}>
                <Button
                  type="primary"
                  onPress={handleOnSeeOtherPostPress}
                  label="See other posts"
                />
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
                  <Button
                    label="Decline"
                    onPress={() => setDeclineOrderModalVisible(true)}
                  />
                </View>
                <View style={{ width: '55%' }}>
                  <Button
                    type="primary"
                    label={
                      post.type === 'sell'
                        ? 'Confirm Order'
                        : post.type === 'need'
                        ? 'Confirm Offer'
                        : 'Confirm Request'
                    }
                    onPress={() => setConfirmOrderModalVisible(true)}
                  />
                </View>
              </View>
            )}

            {orderData.status === 'confirmed' &&
              post.type === 'need' &&
              orderData.payment_method !== 'cash' && (
                <Button
                  style={{
                    margin: normalize(16),
                    marginBottom: normalize(24),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  type="primary"
                  onPress={() => handleOnPayment(orderData.payment_method)}>
                  <Text style={[typography.body1narrow, typography.medium]}>
                    Continue to Payment
                  </Text>
                  <Text style={typography.subtitle1}>
                    ₱
                    {formatNumber(totalPrice, {
                      separator: '.',
                      precision: 2,
                      delimiter: ',',
                    })}
                  </Text>
                </Button>
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
                    onPress={() => setCancelOrderModalVisible(true)}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        typography.body1,
                        typography.medium,
                        { color: Colors.secondaryBrinkPink },
                      ]}>
                      {post.type === 'sell'
                        ? 'Cancel Order'
                        : post.type === 'service'
                        ? 'Cancel Request'
                        : null}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            {post.type === 'sell' &&
              ((orderData.status === 'confirmed' &&
                orderData.payment_method === 'cash') ||
                (orderData.status === 'paid' &&
                  paymentData?.status === 'paid')) && (
                <View style={{ padding: normalize(16) }}>
                  <>
                    {orderData.shipping_method === 'delivery' &&
                      ((orderData.status === 'confirmed' &&
                        orderData.payment_method === 'cash') ||
                        (orderData.status === 'paid' &&
                          orderData.payment_method !== 'cash')) && (
                        <Button
                          type="primary"
                          onPress={() => setConfirmDeliveryModalVisible(true)}
                          label="Confirm for Delivery"
                        />
                      )}
                    {orderData.shipping_method === 'pickup' &&
                      ((orderData.status === 'confirmed' &&
                        orderData.payment_method === 'cash') ||
                        (orderData.status === 'paid' &&
                          orderData.payment_method !== 'cash')) && (
                        <Button
                          type="primary"
                          onPress={() => setPickupOrderModalVisible(true)}
                          label="Confirm for Pick Up"
                        />
                      )}
                  </>
                </View>
              )}

            {post.type === 'service' &&
              ![
                'completed',
                'cancelled',
                'declined',
                'pending',
                'paid',
              ].includes(orderData.status) && (
                <>
                  <View style={{ padding: normalize(16) }}>
                    {(orderData.status === 'confirmed' &&
                      orderData.payment_method === 'cash') ||
                    (orderData.status === 'paid' &&
                      paymentData?.status === 'paid' &&
                      orderData.payment_method !== 'cash') ? (
                      <Button
                        type="primary"
                        onPress={() => setCompleteOrderModalVisible(true)}
                        label="Order Completed"
                        style={{ marginBottom: normalize(16) }}
                      />
                    ) : null}
                    {![
                      'completed',
                      'cancelled',
                      'declined',
                      'pending',
                      'paid',
                      'payment processing',
                    ].includes(orderData.status) && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setCancelOrderModalVisible(true)}
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          padding: normalize(12),
                        }}>
                        <Text
                          style={[
                            typography.body1,
                            typography.medium,
                            { color: Colors.secondaryBrinkPink },
                          ]}>
                          Cancel Request
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

            {post.type === 'sell' &&
              (['delivering', 'pickup'].includes(orderData.status) ||
                (!orderData.shipping_method &&
                  orderData.status === 'confirmed')) && (
                <View style={{ padding: normalize(16) }}>
                  <Button
                    type="primary"
                    onPress={() => setCompleteOrderModalVisible(true)}
                    label="Complete Order"
                  />
                </View>
              )}

            {post.type === 'service' && orderData.status === 'paid' && (
              <View style={{ padding: normalize(16) }}>
                <Button
                  type="primary"
                  onPress={() => setCompleteOrderModalVisible(true)}
                  label="Booking Complete"
                />
              </View>
            )}

            {post.type === 'need' && orderData.status === 'cancelled' && (
              <View style={{ padding: normalize(16) }}>
                <Button
                  type="primary"
                  onPress={navigation.goBack}
                  label="Done"
                />
              </View>
            )}

            {post.type === 'need' &&
              ((orderData.status === 'paid' &&
                paymentData?.status === 'paid') ||
                (orderData.payment_method === 'cash' &&
                  orderData.status === 'confirmed')) && (
                <View style={{ padding: normalize(16) }}>
                  <Button
                    type="primary"
                    onPress={() => setCompleteOrderModalVisible(true)}
                    label="Complete Offer"
                  />
                </View>
              )}
          </>
        )}
      </View>
    )
  }

  const renderBuyerNote = () => {
    if (userType !== 'buyer' || (userType === 'buyer' && post.type === 'need'))
      return

    if (!paymentData?.date_paid || orderData.payment_method === 'cash') return

    const handleOnEmailUsPress = () => {
      Linking.openURL('mailto:help@servbees.com')
    }

    const rawSeconds = paymentData?.date_paid?._seconds + 86400 * 3
    const now = new Date()
    const currentSeconds = Math.round(now.getTime() / 1000)

    if (rawSeconds < currentSeconds) return

    const cutOffDate = format(
      new Date(rawSeconds * 1000),
      `MMM${new Date().getMonth() === 4 ? '' : '.'} dd, yyyy hh:mmaa`
    )

    return (
      <View style={styles.buyerNote}>
        <View style={[utilStyles.row, utilStyles.alignCenter]}>
          <Images.HelpCenter style={{ marginRight: normalize(8) }} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              { color: Colors.primaryMidnightBlue },
            ]}>
            Not satisfied with your order?
          </Text>
        </View>
        <Text style={[typography.caption, { marginTop: normalize(4) }]}>
          If you have problems with your order, email us with the order ID and
          details of your order until{' '}
          <Text style={typography.medium}>{cutOffDate}</Text>
        </Text>

        <TouchableOpacity
          style={{ marginTop: normalize(16) }}
          activeOpacity={0.7}
          onPress={handleOnEmailUsPress}>
          <Text style={[typography.body2, typography.medium, typography.link]}>
            Email Us
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderNotesSection = () => {
    if (!orderData?.notes?.length) return

    return (
      <>
        <View style={styles.sectionLabelWrapper}>
          <Icons.Page style={styles.sectionIcon} {...iconSize(16)} />
          <Text style={[typography.body2, typography.medium]}>
            Additional Notes
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={typography.body2}>{orderData.notes}</Text>
        </View>
      </>
    )
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="#EDF0F8"
      />
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'order-tracker')}
      />
      <View style={styles.wrapper}>
        <TransitionIndicator loading={isLoading} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate('TabStack', {
                    screen: 'Servbees',
                  })
            }>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>{title}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollWrapper}
          refreshControl={
            <RefreshControl
              style={{ zIndex: 1 }}
              refreshing={isRefreshing}
              titleColor={Colors.primaryMidnightBlue}
              tintColor={Colors.primaryYellow}
              onRefresh={handleRefresh}
            />
          }>
          <View style={styles.headerBackground} />
          {renderStatusSection()}
          {renderMessageSection()}
          {renderShippingDetails()}
          {renderOfferDetailsSection()}
          {renderOrderDetailsSection()}
          {renderPaymentInformationSection()}
          {renderNotesSection()}
          {renderSummarySection()}
          {renderBuyerNote()}
        </ScrollView>

        {renderActionButtons()}

        <ModalComponent
          isVisible={cancelOrderModalVisible}
          setIsVisible={setCancelOrderModalVisible}>
          <Dialog
            title={
              post.type === 'sell'
                ? 'Cancel Order'
                : post.type === 'service'
                ? 'Cancel Booking'
                : 'Cancel Offer'
            }
            description={
              post.type === 'sell'
                ? 'Oh wait, sure you don’t want to proceed?'
                : post.type === 'service'
                ? 'Oh no! Sure you want to cancel?'
                : 'Oh wait, sure you want to cancel?'
            }>
            <Button
              label="No"
              type="primary"
              style={styles.primaryButton}
              onPress={() => setCancelOrderModalVisible(false)}
            />
            <Button
              label="Yes"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => {
                setCancelOrderModalVisible(false)

                navigation.navigate('orders', {
                  screen: 'cancel-order',
                  params: { handleCancel },
                })
              }}
            />
          </Dialog>
        </ModalComponent>

        <ModalComponent
          isVisible={declineOrderModalVisible}
          setIsVisible={setDeclineOrderModalVisible}>
          <Dialog
            title={
              post.type === 'sell'
                ? 'Decline Order'
                : post.type === 'service'
                ? 'Decline Booking'
                : 'Decline Offer'
            }
            description={
              post.type === 'need'
                ? 'Oh wait, sure you want to decline? You won’t be able to accept this offer anymore.'
                : 'Oh wait, sure you don’t want to accept?'
            }>
            <Button
              label="No"
              type="primary"
              style={styles.primaryButton}
              onPress={() => setDeclineOrderModalVisible(false)}
            />
            <Button
              label="Yes"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => {
                setDeclineOrderModalVisible(false)
                handleStatusChange('declined')
              }}
            />
          </Dialog>
        </ModalComponent>

        <ModalComponent
          isVisible={confirmOrderModalVisible}
          setIsVisible={setConfirmOrderModalVisible}>
          <Dialog
            title={
              post.type === 'sell'
                ? 'Confirm Order'
                : post.type === 'need'
                ? 'Accept Offer'
                : 'Confirm Booking'
            }
            description={
              post.type === 'sell'
                ? 'Yay! Ready to proceed?'
                : post.type === 'need'
                ? 'Yay! Sure with this one? Once accepted, all other offers will be declined.'
                : 'Agree with the schedule? If not, message the customer to rebook on your available time.'
            }>
            <Button
              label="Yes"
              type="primary"
              style={styles.primaryButton}
              onPress={() => {
                handleStatusChange('confirmed')
                setConfirmOrderModalVisible(false)
              }}
            />
            <Button
              label="No"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => setConfirmOrderModalVisible(false)}
            />
          </Dialog>
        </ModalComponent>

        <ModalComponent
          isVisible={confirmDeliveryModalVisible}
          setIsVisible={setConfirmDeliveryModalVisible}>
          <Dialog
            title="Ready to Deliver?"
            description="Pzzt... Make sure order is prepared and good to go!">
            <Button
              label="Yes"
              type="primary"
              style={styles.primaryButton}
              onPress={() => {
                handleStatusChange('delivering')
                setConfirmDeliveryModalVisible(false)
              }}
            />
            <Button
              label="No"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => setConfirmDeliveryModalVisible(false)}
            />
          </Dialog>
        </ModalComponent>

        <ModalComponent
          isVisible={pickupOrderModalVisible}
          setIsVisible={setPickupOrderModalVisible}>
          <Dialog
            title="Ready for Pick-up?"
            description="Pzzt... Make sure order is prepared and good to go!">
            <Button
              label="Yes"
              type="primary"
              style={styles.primaryButton}
              onPress={() => {
                handleStatusChange('pickup')
                setPickupOrderModalVisible(false)
              }}
            />
            <Button
              label="No"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => setPickupOrderModalVisible(false)}
            />
          </Dialog>
        </ModalComponent>

        <ModalComponent
          isVisible={completeOrderModalVisible}
          setIsVisible={setCompleteOrderModalVisible}>
          <Dialog
            title={
              post.type === 'sell'
                ? 'Order Complete?'
                : post.type === 'service'
                ? 'Complete Booking'
                : 'Complete Offer?'
            }
            description={
              post.type === 'sell'
                ? 'Pzzt… Make sure you only confirm once customer receives the order.'
                : post.type === 'service'
                ? 'Good job! Sure all service inclusions are done?'
                : 'Is your transaction settled and complete?'
            }>
            <Button
              label="Yes"
              type="primary"
              style={styles.primaryButton}
              onPress={() => {
                handleStatusChange('completed')
                setCompleteOrderModalVisible(false)
              }}
            />
            <Button
              label="No"
              type="primary-outline"
              style={styles.outlineButton}
              onPress={() => setCompleteOrderModalVisible(false)}
            />
          </Dialog>
        </ModalComponent>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  activeStatusText: {
    marginLeft: normalize(16),
  },
  avatarImageWrapper: {
    borderRadius: 35 / 2,
  },
  deliverFrom: {
    flexDirection: 'row',
    paddingBottom: normalize(16),
    borderBottomColor: Colors.Gainsboro,
    borderBottomWidth: normalize(1),
  },
  deliverTo: {
    flexDirection: 'row',
    paddingTop: normalize(10),
  },
  gradient: {
    backgroundColor: 'transparent',
    height: 60,
    left: 0,
    position: 'absolute',
    width: 12,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#EDF0F8',
    height: normalize(120),
    opacity: 1,
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
    backgroundColor: '#fff',
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
    color: Colors.icon,
    marginRight: normalize(8),
  },
  statusAnimation: {
    flexBasis: 120,
    height: 60,
    position: 'relative',
  },
  statusDescription: {
    marginTop: normalize(2),
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
    backgroundColor: '#EDF0F8',
    marginTop: getStatusBarHeight(),
  },
  itemQuantity: {
    color: Colors.contentPlaceholder,
    marginRight: normalize(10),
  },
  summary: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gainsboro,
    paddingBottom: normalize(16),
  },
  shippingInfoIcon: {
    marginRight: normalize(8),
    marginTop: normalize(4),
    color: Colors.icon,
  },
  shippingInfoWrapper: {
    flexDirection: 'row',
  },
  shippingInfo: {
    flex: 1,
  },
  sectionLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    marginVertical: normalize(14),
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#EDF0F8',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  buyerNote: {
    margin: normalize(24),
    marginTop: 0,
    padding: normalize(16),
    backgroundColor: Colors.secondarySolitude,
    borderRadius: normalize(8),
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonsWrapper: {
    backgroundColor: '#fff',
  },

  primaryButton: {
    marginBottom: normalize(15),
  },
  outlineButton: {
    borderWidth: normalize(1),
    borderColor: Colors.contentEbony,
  },
  shippingInfoAddress: {
    marginTop: normalize(4),
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
})

export default OrderTrackerScreen
