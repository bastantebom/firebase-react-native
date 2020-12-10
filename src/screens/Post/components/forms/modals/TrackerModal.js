import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
} from 'react-native'

import Modal from 'react-native-modal'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import {
  AppText,
  PaddingView,
  ScreenHeaderTitle,
  Notification,
  AppButton,
  CacheableImage,
  TransitionIndicator,
} from '@/components'

import { normalize, Colors, GlobalStyle } from '@/globals'
import moment from 'moment'

import {
  Chat,
  ChevronRight,
  TrackerIllustration,
  OrangeDot,
  BlueDot,
  GreenDot,
  RedDot,
  ChevronUp,
  ChevronDown,
  LocationContactUs,
  PostBox,
  PostCash,
  PostNote,
  Note,
  CircleTick,
  CircleTickWhite,
  ChevronRightGray,
  CashActive,
  CreditCardActive,
  GCashActive,
  GrabPayActive,
  PaypalActive,
  VisaActive,
  MasterCardActive,
  ProfileImageDefault,
} from '@/assets/images/icons'
import CancelOrder from './CancelOrder'
import DeclineOrder from './DeclineOrder'
import MoreActions from './MoreActions'
import DeclineRequest from './DeclineRequest'
import CreditCardModal from './CreditCardModal'
import GCashModal from './GCashModal'
import GrabPayModal from './GrabPayModal'
import PaypalModal from './PaypalModal'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { Delivering } from '@/assets/images'
import Api from '@/services/Api'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'

const TrackerModal = ({
  closeModal,
  postType,
  postData,
  orderID,
  editOrder,
}) => {
  const { openNotification, closeNotification } = useContext(Context)
  const { user, userInfo } = useContext(UserContext)
  const navigation = useNavigation()

  const [buyer, setBuyer] = useState(false)
  const [seller, setSeller] = useState(false)
  const [pickup, setPickup] = useState(false)
  const [delivery, setDelivery] = useState(true)

  const [message, showMessage] = useState(false)

  const [cancelOrder, setCancelOrder] = useState(false)
  const [declineOrder, setDeclineOrder] = useState(false)
  const [moreActions, setMoreActions] = useState(false)
  const [declineRequest, setDeclineRequest] = useState(false)
  const [creditCardModal, showCreditCardModal] = useState(false)
  const [gCashModal, showGcashModal] = useState(false)
  const [grabPayModal, showGrabPayModal] = useState(false)
  const [paypalModal, showPaypalModal] = useState(false)

  const [status, setStatus] = useState('pending')
  const [statusHeader, setStatusHeader] = useState('')
  const [messageHeader, setMessageHeader] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [orderDetails, setOrderDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    return firestore()
      .doc(`orders/${orderID}`)
      .onSnapshot(async snap => {
        if (snap?.data() && user) {
          setIsLoading(true)
          let data = snap.data()
          data = {
            ...data,
            otherUserData: await getOtherUserData(data.buyer_id),
            sellerData: await getOtherUserData(data.seller_id),
          }
          setOrderDetails(data)
          setBuyer(user.uid === data.buyer_id)
          setSeller(user.uid === data.seller_id)
          setStatus(data.status)
          setDelivery(data.delivery_method === 'delivery')
          setPickup(data.delivery_method === 'pickup')
          setPaymentMethod(data.payment_method)
          setOrderId(data.id)
          setIsLoading(false)
        }
      })
  }, [])

  const [orderList, setOrderList] = useState([])

  useEffect(() => {
    if (!orderList.length) {
      if (!postData?.is_multiple) {
        setOrderList([
          {
            id: 'idsingle',
            quantity: 1,
            name: postData?.title,
            price: postData?.items?.[0]?.price,
          },
        ])
      } else if (Array.isArray(orderDetails.items)) {
        setOrderList(orderDetails.items)
      }
    }
  })

  useEffect(() => {
    computedTotalPrice()
  }, [orderList])

  const getOtherUserData = async userUID => {
    const userData = await Api.getUser({
      uid: userUID,
    })
    if (userData.success) return userData.data
  }

  const CoverPhoto = () => {
    return postData?.cover_photos?.length > 0 ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{ uri: postData?.cover_photos[0] }}
      />
    ) : postData.type === 'service' ? (
      <DefaultService width={normalize(64)} height={normalize(72)} />
    ) : postData.type === 'need' ? (
      <DefaultNeed width={normalize(64)} height={normalize(72)} />
    ) : (
      <DefaultSell width={normalize(64)} height={normalize(72)} />
    )
  }

  const AvatarPhoto = ({ size }) => {
    return orderDetails?.otherUserData?.profile_photo ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: orderDetails?.otherUserData?.profile_photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }
  const computedTotalPrice = () => {
    return orderList.reduce(
      (total, item) => total + +(item.price * item.quantity),
      0
    )
  }

  const orderStatus = (status, postType) => {
    if (buyer) {
      switch (postType) {
        case 'sell':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Your order is now being prepared...')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              if (orderDetails.payment_method === 'cash') {
                setStatusHeader('Order Confirmed')
                setMessageHeader('Yay! Your order is confirmed by the seller.')
                setStatusMessage('<Confirmed copy>')
              } else {
                setStatusHeader('Order Confirmed')
                setMessageHeader('Order confirmed! Continue to payment...')
                setStatusMessage('<Processing message here>')
              }
              break
            case 'paid':
              setStatusHeader('Processing')
              setMessageHeader('Preparing the Order')
              setStatusMessage('<Confirmed copy>')
              break
            case 'delivering':
              setStatusHeader('Delivering')
              setMessageHeader('Your order is ready for delivery...')
              setStatusMessage('<Delivering message here>')
              break
            case 'pickup':
              setStatusHeader('Pick up')
              setMessageHeader('Your order is ready for pickup...')
              setStatusMessage('<Processing message here>')
              break
            case 'ready':
              setStatusHeader('Pick up')
              setMessageHeader(
                'Your order is ready! You can now pickup your order.'
              )
              setStatusMessage('<Ready for pick up message here>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader('Order completed!')
              setStatusMessage('<Completed message here>')
              break
            case 'cancelled':
              setStatusHeader('Cancelled')
              setMessageHeader('Order Cancelled')
              setStatusMessage('<Order Cancelled copy>')
              break
            default:
              null
          }
          break
        case 'service':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              setStatusHeader('Scheduled confirmed')
              setMessageHeader('Scheduled')
              setStatusMessage('<Schedule confirmed copy>')
              break
            case 'cancelled':
              setStatusHeader('Service Cancelled')
              setMessageHeader(null)
              setStatusMessage(null)
              break
            case 'ongoing':
              setStatusHeader('Ongoing')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing copy>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader(null)
              setStatusMessage(null)
              break
            default:
              null
          }
          break
        case 'need':
          switch (status) {
            case 'ongoing':
              setStatusHeader('In Progress')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing Confirmation copy>')
              break
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')

              break
            case 'confirmed':
              setStatusHeader('Offer Accepted')
              setMessageHeader('Your offer is accepted')
              setStatusMessage('<Offer accepted copy>')
              break
            case 'declined':
              setStatusHeader('Offer declined')
              setMessageHeader('Your offer is declined')
              setStatusMessage('<Offer declined copy>')
              break
            case 'completed':
              setStatusHeader('Completed!')
              setMessageHeader('Completed!')
              setStatusMessage('<Completed message here>')
              break
            default:
              null
          }
          break
        default:
          null
      }
    } else {
      switch (postType) {
        case 'sell':
          switch (status) {
            case 'pending':
              setStatusHeader('Requesting...')
              setMessageHeader('Confirm or decline an order...')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              if (orderDetails.payment_method === 'cash') {
                setStatusHeader('Processing')
                setMessageHeader('Preparing the order...')
                setStatusMessage('<Processing message here>')
              } else {
                setStatusHeader('Awaiting Payment')
                setMessageHeader('Waiting for Payment...')
                setStatusMessage('<Processing message here>')
              }
              break
            case 'paid':
              setStatusHeader('Processing')
              setMessageHeader('Preparing the order...')
              setStatusMessage('<Processing message here>')
              break
            case 'delivering':
              setStatusHeader('Delivering')
              setMessageHeader('Order is ready for delivery...')
              setStatusMessage('<Delivering message here>')
              break
            case 'pickup':
              setStatusHeader('Pick up')
              setMessageHeader('Order is ready for pickup...')
              setStatusMessage('<Pick Up message here>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader('Order completed!')
              setStatusMessage('<Completed message here>')
              break
            case 'cancelled':
              setStatusHeader('Cancelled')
              setMessageHeader('Cancelled by Customer')
              setStatusMessage('<Cancelled message here>')
              break
            case 'declined':
              setStatusHeader('Order Declined')
              setMessageHeader('Declined by Customer')
              setStatusMessage('<Declined message here>')
              break
            default:
              null
          }
          break
        case 'service':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              if (orderDetails.payment_method === 'cash') {
                setStatusHeader('Schedule Confirmed')
                setMessageHeader('Your schedule is confirmed...')
                setStatusMessage('<Schedule confirmed copy>')
              } else {
                setStatusHeader('Awaiting Payment')
                setMessageHeader('Waiting for payment...')
                setStatusMessage('<Schedule confirmed copy>')
              }
              break
            case 'paid':
              setStatusHeader('Schedule Confirmed')
              setMessageHeader('Your schedule is confirmed...')
              setStatusMessage('<Schedule confirmed copy>')
              break
            case 'ongoing':
              setStatusHeader('Ongoing')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing copy>')
              break
            case 'declined':
              setStatusHeader('Declined')
              setMessageHeader('Declined')
              setStatusMessage('<Declined copy>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader('Completed')
              setStatusMessage('<Completed copy>')
              break
            case 'cancelled':
              setStatusHeader('Cancelled')
              setMessageHeader('Cancelled by customer')
              setStatusMessage('<Cancelled copy>')
              break
            default:
              null
          }
          break

        case 'need':
          switch (status) {
            case 'ongoing':
              setStatusHeader('In Progress')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing Confirmation copy>')
              break
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')

              break
            case 'confirmed':
              setStatusHeader('Offer Accepted')
              setMessageHeader('Your offer is accepted')
              setStatusMessage('<Offer accepted copy>')
              break
            case 'declined':
              setStatusHeader('Offer declined')
              setMessageHeader('Your offer is declined')
              setStatusMessage('<Offer declined copy>')
              break
            case 'completed':
              setStatusHeader('Completed!')
              setMessageHeader('Completed!')
              setStatusMessage('<Completed message here>')
              break
            default:
              null
          }
          break
        default:
          null
      }
    }
  }

  const title = () => {
    if (postType === 'sell' && status === 'completed') {
      return 'Order Completed'
    } else if (
      (buyer && postType === 'sell' && status === 'pending') ||
      (buyer && postType === 'sell' && status === 'processing') ||
      (buyer && postType === 'sell' && status === 'confirmed')
    ) {
      return 'Order Status'
    } else if (buyer && postType === 'sell' && status === 'declined') {
      return 'Order Declined'
    } else if (buyer && postType === 'sell' && status === 'cancelled') {
      return 'Order Cancelled'
    } else if (seller && postType === 'sell' && status === 'declined') {
      return 'Order Declined'
    } else if (
      (buyer && postType === 'service' && status === 'pending') ||
      (buyer && postType === 'service' && status === 'ongoing') ||
      (buyer && postType === 'service' && status === 'confirmed')
    ) {
      return 'Status'
    } else if (buyer && postType === 'service' && status === 'cancelled') {
      return 'Service Declined'
    } else if (buyer && postType === 'service' && status === 'completed') {
      return 'Completed'
    } else if (seller && postType === 'service' && status === 'completed') {
      return 'Completed'
    } else if (seller && postType === 'service' && status === 'cancelled') {
      return 'Service Cancelled'
    } else if (seller && postType === 'service') {
      return 'Service Request'
    } else {
      return 'Order Request'
    }
  }

  const handlePayment = paymentMethod => {
    switch (paymentMethod) {
      case 'cash':
        null
        break
      case 'card':
        showCreditCardModal(true)
        break
      case 'gcash':
        showGcashModal(true)
        break
      case 'grabpay':
        showGrabPayModal(true)
        break
      case 'paypal':
        showPaypalModal(true)
        break
      default:
        null
    }
  }

  const editOrderHandler = id => {
    editOrder(id)
  }

  useEffect(() => {
    orderStatus(status, postType)
  }, [postType, status])

  const [notif, showNotif] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      showNotif(false)
    }, 5000)
  }, [])

  const handleChatPress = async () => {
    let channel
    try {
      if (!user?.uid) return
      const otherUID = seller ? orderDetails.buyer_id : orderDetails.seller_id
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [user.uid]: true,
          [otherUID]: true,
        })
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')
        const { id } = await ref.add({
          members: {
            [user.uid]: true,
            [otherUID]: true,
          },
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }
      closeModal()
      navigation.navigate('Chat', { user, channel })
    } catch (error) {
      console.log(error)
    }
  }

  const statusChangedHandler = async status => {
    const parameters = {
      id: orderID,
      uid: user.uid,
      body: {
        status,
      },
    }
    try {
      const response = await Api.updateOrder(parameters)
      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error || error.message)
    }
  }

  return (
    <>
      <View
        style={{
          backgroundColor: '#EDF0F8',
          height: normalize(170),
          width: '100%',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          opacity: 1,
          zIndex: -1,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TransitionIndicator loading={isLoading} />
        <ScreenHeaderTitle
          close={closeModal}
          title={title()}
          paddingSize={3}
          iconSize={normalize(16)}
        />
        {notif && (
          <Notification
            onClose={() => showNotif(false)}
            type="success"
            icon={<CircleTickWhite />}>
            <AppText
              textStyle="body2"
              customStyle={{ marginLeft: 14 }}
              color={Colors.neutralsWhite}>
              {postType === 'sell'
                ? 'Order Sent!'
                : postType === 'service'
                ? 'Request Sent!'
                : 'Offer Sent!'}
            </AppText>
          </Notification>
        )}
        <ScrollView>
          <PaddingView paddingSize={2}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.section,
                {
                  display:
                    (buyer &&
                      postType === 'service' &&
                      status === 'completed') ||
                    (buyer &&
                      postType === 'service' &&
                      status === 'cancelled') ||
                    status === 'declined'
                      ? 'none'
                      : 'flex',
                  paddingVertical: normalize(20),
                },
              ]}
              onPress={() => {
                showMessage(!message)
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    maxWidth: '60%',
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      top: normalize(6),
                    }}>
                    {status === 'pending' ||
                    (buyer && status === 'cancelled') ||
                    (status === 'ongoing' && postType === 'need') ? (
                      <OrangeDot />
                    ) : [
                        'confirmed',
                        'delivering',
                        'processing',
                        'read',
                        'ongoing',
                        'paid',
                      ].includes(status) ? (
                      <GreenDot />
                    ) : status === 'cancelled' || status === 'declined' ? (
                      <RedDot />
                    ) : (
                      <BlueDot />
                    )}
                  </View>
                  <View>
                    <AppText
                      textStyle="body2medium"
                      customStyle={{
                        marginLeft: normalize(15),
                        marginBottom: 5,
                      }}
                      color={Colors.primaryMidnightBlue}>
                      {statusHeader}
                    </AppText>
                    <AppText textStyle="caption">{messageHeader}</AppText>
                  </View>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: normalize(20),
                  }}>
                  <Delivering width={normalize(100)} height={normalize(80)} />
                </View>
                {message ? (
                  <ChevronUp width={normalize(13)} height={normalize(12)} />
                ) : (
                  <ChevronDown width={normalize(13)} height={normalize(12)} />
                )}
              </View>
              {message && (
                <AppText
                  textStyle="caption"
                  customStyle={{ marginTop: normalize(8) }}>
                  {statusMessage}
                </AppText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: 'relative', width: '100%' }}
              activeOpacity={0.7}
              onPress={handleChatPress}>
              <View style={[styles.section, styles.messageContainer]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {buyer && (
                    <View style={styles.postImageContainer}>
                      <CoverPhoto />
                    </View>
                  )}
                  {seller && (
                    <View style={styles.userInfoImageContainer}>
                      <AvatarPhoto size={35} />
                    </View>
                  )}
                  <View>
                    <AppText
                      textStyle="body2medium"
                      customStyle={{ marginBottom: 5 }}>
                      {buyer &&
                        (orderDetails?.sellerData?.display_name
                          ? orderDetails?.sellerData?.display_name
                          : orderDetails?.sellerData?.full_name)}

                      {seller &&
                        (orderDetails?.otherUserData?.display_name
                          ? orderDetails?.otherUserData?.display_name
                          : orderDetails?.otherUserData?.full_name)}
                    </AppText>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Chat width={normalize(18)} height={normalize(18)} />
                      {buyer && (
                        <AppText
                          textStyle="caption"
                          customStyle={{ marginLeft: normalize(5) }}>
                          {postType === 'sell'
                            ? 'Message seller'
                            : postType === 'service'
                            ? 'Message service provider'
                            : `Message`}
                        </AppText>
                      )}
                      {seller && (
                        <AppText
                          textStyle="caption"
                          customStyle={{ marginLeft: normalize(5) }}>
                          {postType === 'sell'
                            ? 'Message customer'
                            : postType === 'service'
                            ? 'Message customer'
                            : `Message`}
                        </AppText>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ position: 'absolute', right: 10 }}>
                  <ChevronRightGray
                    width={normalize(13)}
                    height={normalize(12)}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.section,
                { display: postType !== 'need' ? 'flex' : 'none' },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: normalize(10),
                  display: postType !== 'sell' ? 'none' : 'flex',
                }}>
                <LocationContactUs
                  width={normalize(20)}
                  height={normalize(20)}
                />
                <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                  {pickup ||
                    (delivery && (
                      <AppText textStyle="body1">
                        From{' '}
                        <AppText textStyle="body1medium">
                          {orderDetails?.sellerData?.display_name
                            ? orderDetails?.sellerData?.display_name
                            : orderDetails?.sellerData?.full_name}
                        </AppText>
                      </AppText>
                    ))}

                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    {postData?.store_details?.location?.full_address}
                  </AppText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: postType !== 'sell' ? 0 : normalize(10),
                  display: pickup && postType === 'sell' ? 'none' : 'flex',
                  borderTopWidth: postType === 'service' ? 0 : 1,
                  borderTopColor: '#E5E5E5',
                }}>
                <PostBox width={normalize(20)} height={normalize(20)} />
                <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                  <AppText
                    textStyle="body1medium"
                    customStyle={{ marginRight: normalize(5) }}>
                    {delivery && postType === 'sell'
                      ? 'Deliver to'
                      : pickup && postType === 'sell'
                      ? 'Pickup at'
                      : postType === 'service' && status !== 'ongoing'
                      ? 'Service at'
                      : postType === 'service' && status === 'ongoing'
                      ? 'Servicing at'
                      : null}
                    &nbsp;
                    <AppText textStyle="body1medium">
                      {orderDetails?.otherUserData?.addresses.find(
                        address => address.default
                      ).name
                        ? orderDetails?.otherUserData?.addresses.find(
                            address => address.default
                          ).name
                        : 'Home (default)'}
                    </AppText>
                  </AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    {
                      orderDetails?.otherUserData?.addresses.find(
                        address => address.default
                      ).full_address
                    }
                  </AppText>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.section,
                { display: postType === 'service' ? 'flex' : 'none' },
              ]}>
              <View style={{ flexDirection: 'row' }}>
                <PostCash width={normalize(20)} height={normalize(20)} />
                <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                  <AppText textStyle="body1medium">
                    Service requested on{' '}
                    {moment(orderDetails?.schedule).format('MMMM D, YYYY')}
                  </AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    at {moment(orderDetails?.schedule).format('h:mm a')}
                  </AppText>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={{ flexDirection: 'row' }}>
                <PostCash width={normalize(20)} height={normalize(20)} />
                <View style={{ marginLeft: normalize(10) }}>
                  <AppText textStyle="body1medium">
                    {postType !== 'need' ? 'Payment Method' : 'Your offer'}
                  </AppText>
                </View>
              </View>
              {(postType === 'service' || postType === 'sell') && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 16,
                  }}>
                  {orderDetails.payment_method === 'cash' ? (
                    <>
                      <CashActive />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        Cash on Delivery / Pick up
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'card' ? (
                    <>
                      <CreditCardActive />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        Visa / Mastercard
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'gcash' ? (
                    <>
                      <GCashActive />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        GCash
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'grabpay' ? (
                    <>
                      <GrabPayActive />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        GrabPay
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'paypal' ? (
                    <>
                      <PaypalActive />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        PayPal
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'visa' ? (
                    <>
                      <VisaActive
                        width={normalize(30)}
                        height={normalize(30)}
                      />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        •••• 2111
                      </AppText>
                    </>
                  ) : orderDetails.payment_method === 'mastercard' ? (
                    <>
                      <MasterCardActive
                        width={normalize(30)}
                        height={normalize(30)}
                      />
                      <AppText
                        textStyle={'body2medium'}
                        customStyle={{ marginLeft: normalize(10) }}>
                        •••• 2110
                      </AppText>
                    </>
                  ) : null}
                </View>
              )}
              {postType === 'need' && (
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  {orderDetails?.price}
                </AppText>
              )}
            </View>
            <View
              style={[
                styles.section,
                { display: postType !== 'need' ? 'flex' : 'none' },
              ]}>
              <View>
                <View style={{ position: 'absolute', top: normalize(3) }}>
                  <PostNote width={normalize(20)} height={normalize(20)} />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E5E5',
                    paddingBottom: normalize(10),
                  }}>
                  <AppText
                    textStyle="body1medium"
                    customStyle={{
                      marginLeft: normalize(30),
                      marginBottom: normalize(7),
                    }}>
                    {postType === 'sell'
                      ? 'Order Summary'
                      : postType === 'service'
                      ? 'Service Summary'
                      : null}
                  </AppText>
                  {orderList.map((item, k) => {
                    return (
                      <View
                        key={k}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: normalize(10),
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                          <AppText
                            textStyle="body1"
                            color={Colors.secondaryLavenderBlue}>
                            {item.quantity}x
                          </AppText>
                          <View style={{ marginLeft: normalize(10) }}>
                            <AppText textStyle="body1medium">
                              {item.name}
                            </AppText>
                            {item.note && (
                              <AppText textStyle="caption">{item.note}</AppText>
                            )}
                          </View>
                        </View>
                        <AppText
                          textStyle="body1"
                          color={Colors.contentPlaceholder}>
                          ₱{item.price * item.quantity}
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
                    ₱{computedTotalPrice()}
                  </AppText>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.section,
                {
                  display:
                    postType === 'need'
                      ? 'flex'
                      : postType === 'service' && status === 'cancelled'
                      ? 'flex'
                      : 'none',
                },
              ]}>
              <View style={{ flexDirection: 'row' }}>
                {postType === 'need' ? (
                  <Note width={normalize(18)} height={normalize(18)} />
                ) : (
                  <PostCash width={normalize(24)} height={normalize(24)} />
                )}
                <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                  <AppText textStyle="body1medium">Notes</AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    {orderDetails?.message}
                  </AppText>
                </View>
              </View>
            </View>
          </PaddingView>
        </ScrollView>

        {buyer && (
          <>
            <View
              style={{
                display: status === 'pending' ? 'flex' : 'none',
              }}>
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
                    postType === 'sell' ||
                    (postType === 'service' && status === 'pending')
                      ? 'space-between'
                      : 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCancelOrder(true)}
                  style={{ width: '50%' }}>
                  <AppText
                    textStyle="button2"
                    color={Colors.secondaryBrinkPink}>
                    {postType === 'sell'
                      ? 'Cancel Order'
                      : postType === 'service'
                      ? 'Cancel Request'
                      : 'Cancel Offer'}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => editOrderHandler(orderDetails.id)}
                  style={{ width: '50%', alignItems: 'flex-end' }}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    {postType === 'sell'
                      ? 'Edit Order'
                      : postType === 'service'
                      ? 'Edit Request'
                      : 'Edit Offer'}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                display: status === 'cancelled' ? 'flex' : 'none',
                padding: normalize(16),
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelOrder(true)}
                style={{ width: '50%' }}>
                <AppText textStyle="button2" color={Colors.secondaryBrinkPink}>
                  {postType === 'sell' ? 'Cancel Order' : null}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => editOrderHandler(orderDetails.id)}
                style={{ width: '50%' }}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  {postType === 'sell'
                    ? 'Edit Order'
                    : postType === 'need'
                    ? 'Edit Offer'
                    : null}
                </AppText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.btnPrimary,
                {
                  display:
                    (postType === 'service' || postType === 'sell') &&
                    status === 'confirmed' &&
                    orderDetails.payment_method !== 'cash'
                      ? 'flex'
                      : 'none',
                },
              ]}
              onPress={() => handlePayment(orderDetails.payment_method)}>
              <AppText textStyle="body2medium">Continue to Payment</AppText>
              <AppText textStyle="body2">₱{computedTotalPrice()}</AppText>
            </TouchableOpacity>

            <View
              style={{
                display:
                  status === 'confirmed' &&
                  postType === 'service' &&
                  orderDetails.payment_method === 'cash'
                    ? 'flex'
                    : 'none',
                padding: normalize(16),
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelOrder(true)}
                style={{ width: '100%', alignItems: 'center' }}>
                <AppText textStyle="button2" color={Colors.secondaryBrinkPink}>
                  Cancel Request
                </AppText>
              </TouchableOpacity>
            </View>
          </>
        )}

        {seller && (
          <>
            <View
              style={{
                display: status === 'pending' ? 'flex' : 'none',
              }}>
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
                    onPress={() => setDeclineOrder(true)}
                  />
                </View>
                <View style={{ width: '55%' }}>
                  <AppButton
                    type="primary"
                    onPress={() => statusChangedHandler('confirmed')}
                    text={
                      postType === 'sell' ? 'Confirm Order' : 'Confirm Request'
                    }
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                display:
                  postType === 'sell' &&
                  status === 'confirmed' &&
                  orderDetails.payment_method !== 'cash'
                    ? 'flex'
                    : 'none',
                padding: normalize(16),
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelOrder(true)}
                style={{ justifyContent: 'center', alignItems: 'center' }}>
                <AppText textStyle="button2" color={Colors.secondaryBrinkPink}>
                  {postType === 'sell'
                    ? 'Cancel Order'
                    : postType === 'service'
                    ? 'Cancel Request'
                    : null}
                </AppText>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: postType === 'sell' ? 'flex' : 'none',
              }}>
              <View
                style={{
                  padding: normalize(15),
                }}>
                {delivery &&
                  ((status === 'confirmed' &&
                    orderDetails.payment_method === 'cash') ||
                    (status === 'paid' &&
                      orderDetails.payment_method !== 'cash')) && (
                    <AppButton
                      type="primary"
                      onPress={() => statusChangedHandler('delivering')}
                      text="Confirm for Delivery"
                    />
                  )}
                {pickup &&
                  ((status === 'confirmed' &&
                    orderDetails.payment_method === 'cash') ||
                    (status === 'paid' &&
                      orderDetails.payment_method !== 'cash')) && (
                    <AppButton
                      type="primary"
                      onPress={() => statusChangedHandler('pickup')}
                      text="Confirm for Pick Up"
                    />
                  )}
              </View>
            </View>

            <View
              style={{
                display: postType === 'service' ? 'flex' : 'none',
                padding: normalize(16),
              }}>
              {(status === 'confirmed' &&
                orderDetails.payment_method === 'cash') ||
              (status === 'paid' && orderDetails.payment_method !== 'cash') ? (
                <AppButton
                  type="primary"
                  onPress={() => statusChangedHandler('completed')}
                  text="Request Completed"
                  customStyle={{ marginBottom: 16 }}
                />
              ) : null}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelOrder(true)}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  display:
                    status !== 'completed' &&
                    status !== 'cancelled' &&
                    status !== 'declined' &&
                    status !== 'pending'
                      ? 'flex'
                      : 'none',
                }}>
                <AppText textStyle="button2" color={Colors.secondaryBrinkPink}>
                  Cancel Request
                </AppText>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display:
                  postType === 'sell' &&
                  (status === 'delivering' || status === 'pickup')
                    ? 'flex'
                    : 'none',
              }}>
              <View
                style={{
                  padding: normalize(15),
                }}>
                <AppButton
                  type="primary"
                  onPress={() => statusChangedHandler('completed')}
                  text="Order Completed"
                />
              </View>
            </View>

            <View
              style={{
                display:
                  postType === 'need' && status === 'confirmed'
                    ? 'flex'
                    : 'none',
              }}>
              <View
                style={{
                  padding: normalize(15),
                }}>
                <AppButton
                  type="primary"
                  onPress={() => statusChangedHandler('completed')}
                  text="Order Completed"
                />
              </View>
            </View>

            <View
              style={{
                display:
                  status === 'completed' ||
                  status === 'cancelled' ||
                  status === 'declined'
                    ? 'flex'
                    : 'none',
              }}>
              <View
                style={{
                  padding: normalize(15),
                }}>
                <AppButton
                  type="primary"
                  onPress={() => closeModal()}
                  text="Done"
                />
              </View>
            </View>

            <View
              style={{
                display: buyer && status === 'ongoing' ? 'flex' : 'none',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: normalize(25),
                  paddingHorizontal: normalize(35),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ width: '50%' }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setMoreActions(true)}>
                    <AppText textStyle="button2" color={Colors.contentOcean}>
                      More Actions
                    </AppText>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '50%' }}>
                  <AppButton
                    type="primary"
                    text="Complete"
                    disabled
                    customStyle={{
                      backgroundColor: '#E9EDF1',
                      borderColor: '#E9EDF1',
                    }}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <Modal
          isVisible={cancelOrder}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{ margin: 0, justifyContent: 'flex-end' }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={() => setCancelOrder(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <CancelOrder
            orderDetails={orderDetails}
            userId={user.uid}
            goBack={() => setCancelOrder(false)}
            postType={postType}
          />
        </Modal>
        <Modal
          isVisible={declineOrder}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{ margin: 0, justifyContent: 'flex-end' }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={() => setDeclineOrder(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <DeclineOrder
            goBack={() => setDeclineOrder(false)}
            postType={postType}
            declineOrderFunction={() => statusChangedHandler('declined')}
          />
        </Modal>
        <Modal
          isVisible={moreActions}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{ margin: 0, justifyContent: 'flex-end' }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={() => setMoreActions(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <MoreActions
            goBack={() => setMoreActions(false)}
            postType={postType}
          />
        </Modal>
        <Modal
          isVisible={declineRequest}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{ margin: 0, justifyContent: 'flex-end' }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={() => setDeclineRequest(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <DeclineRequest
            goBack={() => setDeclineRequest(false)}
            postType={postType}
            declineOrderFunction={() => statusChangedHandler('declined')}
          />
        </Modal>
        <Modal
          isVisible={creditCardModal}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          style={{
            margin: 0,
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            height: Dimensions.get('window').height,
          }}>
          <CreditCardModal
            orderDetails={{ id: orderId, totalPrice: computedTotalPrice() }}
            closeModal={() => showCreditCardModal(false)}
          />
        </Modal>
        <Modal
          isVisible={gCashModal}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          style={{
            margin: 0,
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            height: Dimensions.get('window').height,
          }}>
          <GCashModal
            orderDetails={{ id: orderId, totalPrice: computedTotalPrice() }}
            closeModal={() => showGcashModal(false)}
          />
        </Modal>
        <Modal
          isVisible={grabPayModal}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          style={{
            margin: 0,
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            height: Dimensions.get('window').height,
          }}>
          <GrabPayModal
            orderDetails={{ id: orderId, totalPrice: computedTotalPrice() }}
            closeModal={() => showGrabPayModal(false)}
          />
        </Modal>
        <Modal
          isVisible={paypalModal}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          style={{
            margin: 0,
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            height: Dimensions.get('window').height,
          }}>
          <PaypalModal
            orderDetails={{ id: orderId, totalPrice: computedTotalPrice() }}
            closeModal={() => showPaypalModal(false)}
          />
        </Modal>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FF',
    borderColor: '#F2F7FF',
  },
  image: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 4,
    marginRight: normalize(12),
  },
  status: {
    position: 'absolute',
    zIndex: 1,
    width: normalize(220),
    height: normalize(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E05454',
  },
  section: {
    padding: normalize(16),
    borderColor: '#DADCE0',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: normalize(10),
    backgroundColor: Colors.neutralsWhite,
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
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
    marginRight: normalize(10),
  },

  postImageContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: normalize(10),
  },
})

export default TrackerModal
