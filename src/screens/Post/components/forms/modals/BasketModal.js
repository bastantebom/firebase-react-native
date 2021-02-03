import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native'

import Modal from 'react-native-modal'
import Geocoder from 'react-native-geocoding'
import Geolocation from '@react-native-community/geolocation'
import Post from '@/components/Post/Post'

import { AppText, ScreenHeaderTitle, MapComponent } from '@/components'
import Config from '@/services/Config'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import Api from '@/services/Api'
import { normalize, Colors } from '@/globals'
import moment from 'moment'

import {
  PostNote,
  PostBox,
  PostCash,
  Send,
  Cash,
  CreditCard,
  GCash,
  GrabPay,
  CashActive,
  CreditCardActive,
  GCashActive,
  GrabPayActive,
  PaypalActive,
  Paypal,
  InfoSmall,
  PinBeeAlt,
  Icons,
} from '@/assets/images/icons'
import { BeeResponsible } from '@/assets/images'

import ChangeDeliveryMethodModal from './ChangeDeliveryMethodModal'
import ChangePaymentMethodModal from './ChangePaymentMethodModal'
import AddNoteModal from './AddNoteModal'
import OrderNotesModal from './OrderNotesModal'
import ServiceSchedule from './ServiceSchedule'
import { useNavigation } from '@react-navigation/native'
import { commaSeparate, isEmpty } from '@/globals/Utils'
import Privacy from '@/screens/Authentication/SignUp/components/PrivacyPolicy'
import TermsOfUse from '@/screens/Authentication/SignUp/components/TermsOfUse'

const BasketModal = ({
  closeModal,
  postType,
  postData,
  offerData,
  selectedPostDetails,
}) => {
  const [scheduleModal, showScheduleModal] = useState(false)
  const [changeDeliveryModal, showChangeDeliveryModal] = useState(false)
  const [changePaymentModal, showChangePaymentModal] = useState(false)
  const [addNoteModal, showAddNoteModal] = useState(false)
  const [orderNotes, showOrderNotes] = useState(false)
  const [fromEdit, setFromEdit] = useState(false)
  const [editOrderId, setEditOrderId] = useState()
  const [orderedCart, setOrderedCart] = useState()
  const [serviceSchedule, setServiceSchedule] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false)
  const [isTermsVisible, setIsTermsVisible] = useState(false)

  const [orderID, setOrderID] = useState()
  const [userData, setUserData] = useState({})
  const [attachedPostData, setAttachedPostData] = useState()

  const { userCart, setUserCart } = useContext(Context)
  const { userInfo, user } = useContext(UserContext)
  const { addresses } = userInfo

  const navigation = useNavigation()

  const {
    is_multiple,
    title,
    price,
    cover_photos,
    items,
    description,
    payment,
    delivery_methods,
    user: { display_name },
    store_details: {
      location: { latitude, longitude, full_address },
    },
  } = postData

  const [deliveryChoice, setDeliveryChoice] = useState(
    !isEmpty(delivery_methods.delivery) ? 'delivery' : 'pickup'
  )

  const [paymentChoice, setPaymentChoice] = useState(payment)
  const [notes, setNotes] = useState()
  const [paymentMethod, setPaymentMethod] = useState('')

  // MAP
  Geocoder.init(Config.apiKey)

  const address = addresses.find(address => address.default)

  const [addressData, setAddressData] = useState(address)
  const [mapInitialized, setMapInitialized] = useState(false)

  const [mapCoords, setMapCoords] = useState({})

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

  const handleRegionChange = async region => {
    const { latitude, longitude } = region
    const { results } = await Geocoder.from(latitude, longitude)

    const addressComponents = results[0].address_components || []

    setAddressData({
      ...addressData,
      longitude,
      latitude,
      city: getLocationName(addressComponents, 'locality'),
      province:
        getLocationName(addressComponents, 'administrative_area_level_2') ||
        getLocationName(addressComponents, 'administrative_area_level_1') ||
        '',
      country: getLocationName(addressComponents, 'country'),
      full_address: results[0].formatted_address,
    })
  }

  const initializeMap = async () => {
    try {
      setMapCoords(
        deliveryChoice === 'delivery'
          ? {
              lat: addresses.find(address => address.default).latitude,
              lng: addresses.find(address => address.default).longitude,
              latitudeDelta: 0.0045,
              longitudeDelta: 0.0045,
            }
          : {
              lat: latitude,
              lng: longitude,
              latitudeDelta: 0.0045,
              longitudeDelta: 0.0045,
            }
      )
      setMapInitialized(true)
    } catch (error) {
      const { results } = await Geocoder.from('Manila')
      const { lat, lng } = results[0].geometry.location
      setMapCoords({
        lat,
        lng,
      })
      setMapInitialized(true)
    }
  }

  useEffect(() => {
    initializeMap()
  }, [deliveryChoice])

  //MAP END

  const computedTotal = () => {
    if (!fromEdit) {
      if (userCart.length > 0 && is_multiple)
        return userCart.reduce(
          (total, item) =>
            total +
            +(parseFloat((item.price + '').replace(/,/g, '')) * item.quantity),
          0
        )

      if (!is_multiple) {
        return items[0].price
      }
    } else {
      return orderedCart.reduce(
        (total, item) =>
          total +
          +(parseFloat((item.price + '').replace(/,/g, '')) * item.quantity),
        0
      )
    }
  }

  const sendOfferHandler = async () => {
    setIsSubmitting(true)
    const parameters = {
      uid: user.uid,
      body: {
        post_id: postData?.id,
        price: offerData?.price,
        message: offerData?.message,
      },
    }

    const editParameters = {
      id: editOrderId,
      uid: user.uid,
      body: {
        price: Number(offerData?.price),
        message: offerData?.message,
        status: 'pending',
      },
    }

    try {
      const response = await (!fromEdit
        ? Api.createOrder(parameters)
        : Api.updateOrder(editParameters))

      if (!response.success) throw new Error(response.message)
      const orderID = !fromEdit ? response.order_id : editOrderId
      setOrderID(!fromEdit ? response.order_id : editOrderId)
      closeModal()
      navigation.navigate('orders', {
        screen: 'order-tracker',
        params: {
          post: postData,
          orderID,
        },
      })
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
      setIsSubmitting(false)
    }
  }

  const editOrder = id => {
    setFromEdit(true)
    setEditOrderId(id)
  }

  const placeOrderHandler = async () => {
    setIsSubmitting(true)

    const itemsToSave = !is_multiple
      ? [
          {
            id: items[0].id,
            title: title,
            description: description,
            quantity: 1,
            price: items[0].price,
            image: cover_photos ? cover_photos[0] : '',
          },
        ]
      : fromEdit
      ? orderedCart
      : userCart

    const parameters = {
      uid: user.uid,
      body: {
        items: itemsToSave,
        post_id: postData?.id,
        delivery_method: deliveryChoice,
        payment_method: paymentMethod,
        notes: notes,
        schedule:
          postType === 'service'
            ? moment(serviceSchedule, 'MMMM D, YYYY @h:mm a').toDate()
            : '',
      },
    }

    const editParameters = {
      id: editOrderId,
      uid: user.uid,
      body: {
        items: itemsToSave,
        notes: notes,
        status: 'pending',
      },
    }

    try {
      const response = await (!fromEdit
        ? Api.createOrder(parameters)
        : Api.updateOrder(editParameters))

      if (!response.success) throw new Error(response.message)
      const orderID = !fromEdit ? response.order_id : editOrderId
      closeModal()
      navigation.navigate('orders', {
        screen: 'order-tracker',
        params: {
          post: postData,
          orderID,
        },
      })
      setOrderID(orderID)
      setOrderedCart(userCart)
      setIsSubmitting(false)
      setUserCart([])
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
      Alert.alert('Error', 'Oops, something went wrong')
    }
  }

  useEffect(() => {
    if (selectedPostDetails?.id) {
      getUserData()
    }
  }, [])

  const getUserData = async () => {
    const response = await Api.getUser({ uid: selectedPostDetails.uid })

    const { data, success } = response

    const userObject = { user: { ...data } }

    if (success) {
      return setAttachedPostData({
        ...selectedPostDetails,
        ...userObject,
      })
    }
  }

  const AttachedPost = () => {
    if (selectedPostDetails?.id && attachedPostData) {
      return (
        <Post
          data={attachedPostData}
          type={'need'}
          selectNeedFunction={() => null}
          isLoading={false}
        />
      )
    }

    return <></>
  }

  const OrderSummary = () => {
    if (is_multiple) {
      if (!fromEdit)
        return userCart.map((item, k) => {
          return (
            <View
              key={k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: normalize(10),
                display: postType !== 'need' ? 'flex' : 'none',
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: 16,
                  maxWidth: '70%',
                }}>
                <AppText textStyle="body1">{item.quantity}x</AppText>
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: normalize(10),
                  }}>
                  <AppText textStyle="body1medium">{item.name}</AppText>
                  {item.note && (
                    <AppText textStyle="body2">{item.note}</AppText>
                  )}
                </View>
              </View>
              <AppText textStyle="body1">
                ₱
                {commaSeparate(
                  parseFloat((item.price + '').replace(/,/g, '')) *
                    item.quantity
                )}
              </AppText>
            </View>
          )
        })
      else {
        return orderedCart.map((item, k) => {
          return (
            <View
              key={k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: normalize(10),
                display: postType !== 'need' ? 'flex' : 'none',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText textStyle="body1">{item.quantity}x</AppText>
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: normalize(10),
                  }}>
                  <AppText textStyle="body1medium">{item.name}</AppText>
                  {item.note && (
                    <AppText textStyle="body2">{item.note}</AppText>
                  )}
                </View>
              </View>
              <AppText textStyle="body1">
                ₱{commaSeparate(item.price * item.quantity)}
              </AppText>
            </View>
          )
        })
      }
    } else
      return (
        <View style={{ marginVertical: 12 }}>
          <AppText textStyle="body3">{title}</AppText>
        </View>
      )
  }

  const ImportantNotes = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', marginLeft: 12 }}>
          <InfoSmall width={normalize(16)} height={normalize(16)} />
          <AppText textStyle="caption" customStyle={{ marginLeft: 8 }}>
            Please wait for the seller to confirm your order before proceeding
            with the payment.
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 12, marginTop: 16 }}>
          <InfoSmall width={normalize(16)} height={normalize(16)} />
          <View>
            <AppText textStyle="caption" customStyle={{ marginLeft: 8 }}>
              Before you continue, kindly review our{' '}
            </AppText>
            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsPrivacyVisible(true)
                }}>
                <AppText color={Colors.contentOcean}>Privacy Policy </AppText>
              </TouchableOpacity>
              <AppText textStyle="caption">and </AppText>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsTermsVisible(true)
                }}>
                <AppText color={Colors.contentOcean}>Terms of Use.</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          isVisible={isTermsVisible}
          animationIn="slideInRight"
          animationInTiming={450}
          animationOut="slideOutRight"
          animationOutTiming={450}
          onBackButtonPress={() => setIsTermsVisible(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <TermsOfUse onClose={() => setIsTermsVisible(false)} />
        </Modal>
        <Modal
          isVisible={isPrivacyVisible}
          animationIn="slideInRight"
          animationInTiming={450}
          animationOut="slideOutRight"
          animationOutTiming={450}
          onBackButtonPress={() => setIsPrivacyVisible(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <Privacy onClose={() => setIsPrivacyVisible(false)} />
        </Modal>

        <View
          style={{
            backgroundColor: Colors.secondarySolitude,
            padding: 16,
            borderRadius: 8,
            marginTop: 24,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BeeResponsible width={normalize(40)} height={normalize(40)} />
            <AppText customStyle={{ marginLeft: 8 }} textStyle="body2medium">
              Bee Responsible
            </AppText>
          </View>
          <View style={{ marginTop: 4 }}>
            <AppText textStyle="caption">
              Pranking or cheating a seller, a customer, and delivery personnel
              is an act punishable by law. Let's keep this community a safe hive
              for everyone.
            </AppText>
          </View>
        </View>
      </View>
    )
  }

  const ServiceAddress = () => {
    const buyerAddress = userInfo.addresses.filter(
      address => address.default
    )[0]

    let sellerAddress = postData.store_details?.location

    const getAddress = () => {
      if (deliveryChoice === 'delivery') {
        return sellerAddress?.full_address
      } else {
        return buyerAddress?.full_address
      }
    }

    const getAddressName = () => {
      if (deliveryChoice === 'delivery') {
        return `Service's Location: ${sellerAddress?.name ?? 'Home (Default)'}`
      } else {
        return `Your Location: ${buyerAddress?.name ?? 'Home (Default)'}`
      }
    }

    return (
      <View>
        <AppText textStyle="body2medium">{getAddressName()}</AppText>
        <AppText
          textStyle="body2"
          customStyle={{ marginVertical: normalize(10) }}>
          {getAddress()}
        </AppText>
      </View>
    )
  }

  const SubmitButton = () => {
    return (
      <TouchableOpacity
        disabled={!paymentMethod && postType !== 'need' && !isSubmitting}
        onPress={() => {
          if (postType === 'need') {
            sendOfferHandler()
          } else {
            placeOrderHandler()
          }
        }}>
        <View
          style={
            styles[
              !!paymentMethod || postType === 'need'
                ? 'buyButtonContainer'
                : 'disabledBuyButtonContainer'
            ]
          }>
          {!isSubmitting ? (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: normalize(16),
              }}>
              {fromEdit ? (
                <AppText textStyle="body1medium">
                  {postType === 'need' ? 'Update Offer' : 'Update'}
                </AppText>
              ) : (
                <AppText textStyle="body1medium">
                  {postType === 'need' ? 'Send Offer' : 'Continue'}
                </AppText>
              )}
              <AppText textStyle="body1">
                {postType === 'need'
                  ? `₱${commaSeparate(offerData?.price)}`
                  : `₱${commaSeparate(computedTotal())}`}
              </AppText>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: normalize(16),
              }}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const DeliveryMethod = () => {
    const deliveryDataMap = {
      delivery: {
        icon: (
          <Icons.BasketDelivery width={normalize(24)} height={normalize(24)} />
        ),
        text: 'Delivery',
      },
      pickup: {
        icon: (
          <Icons.BasketPickup width={normalize(24)} height={normalize(24)} />
        ),
        text: 'Pick-up',
      },
      appointment: {
        icon: (
          <Icons.BasketSchedule width={normalize(24)} height={normalize(24)} />
        ),
        text: 'Appointment',
      },
      walkIn: {
        icon: (
          <Icons.BasketWalkIn width={normalize(24)} height={normalize(24)} />
        ),
        text: 'Walk-In',
      },
    }

    const delivery = () => {
      if (postType !== 'sell') {
        if (deliveryChoice === 'delivery') {
          return deliveryDataMap.walkIn
        } else {
          return deliveryDataMap.appointment
        }
      }
      return deliveryDataMap[deliveryChoice]
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {delivery().icon}
        <AppText
          textStyle="body1medium"
          customStyle={{ marginLeft: normalize(10) }}>
          {delivery().text}
        </AppText>
      </View>
    )
  }

  const DeliveryAddress = () => {
    const buyerAddress =
      userInfo.addresses.filter(address => address.default)[0] ?? {}

    let sellerAddress =
      delivery_methods.pickup?.location ??
      postData.store_details?.location ??
      {}

    const getAddress = () => {
      if (deliveryChoice === 'pickup') {
        return sellerAddress.full_address
      } else {
        return buyerAddress.full_address
      }
    }

    const getAddressName = () => {
      if (deliveryChoice === 'pickup') {
        return `Seller's Location: ${sellerAddress?.name ?? 'Home (Default)'}`
      } else {
        return `Your Location: ${buyerAddress?.name ?? 'Home (Default)'}`
      }
    }

    return (
      <View>
        <AppText textStyle="body2medium">{getAddressName()}</AppText>
        <AppText
          textStyle="body2"
          customStyle={{ marginVertical: normalize(10) }}>
          {/* Display name of address */}
          {getAddress()}
        </AppText>
      </View>
    )
  }

  const DeliveryNotes = () => {
    const byCourier = delivery_methods.delivery?.nationwide?.notes || ''
    const bySeller = delivery_methods.delivery?.radius?.notes || ''

    return (
      <View>
        {byCourier != 0 && bySeller != 0 && (
          <View>
            <AppText textStyle="body2medium">Seller's Delivery Notes</AppText>
            {byCourier.length != 0 && (
              <>
                <AppText textStyle="body2" customStyle={{ marginTop: 8 }}>
                  Ship via local or third party couriers
                </AppText>
                <AppText textStyle="body2" customStyle={{ marginTop: 4 }}>
                  {byCourier}
                </AppText>
              </>
            )}

            {bySeller.length != 0 && (
              <>
                <AppText textStyle="body2" customStyle={{ marginTop: 8 }}>
                  Delivery by seller
                </AppText>
                <AppText textStyle="body2" customStyle={{ marginTop: 4 }}>
                  {bySeller}
                </AppText>
              </>
            )}
          </View>
        )}
        <View
          style={{
            backgroundColor: Colors.secondarySolitude,
            padding: 16.5,
            borderRadius: 8,
            marginBottom: 16,
            marginTop: 16,
          }}>
          <AppText textStyle="caption" customStyle={{ paddingBottom: 16 }}>
            For this transaction, kindly agree with the seller how delivery will
            be made (i.e. Grab, Lalamove, etc.). At the moment, Servbees does
            not cover this feature. Rest assured, this will be made available to
            you soon.
          </AppText>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingVertical: normalize(30),
        }}>
        <View style={{ paddingHorizontal: normalize(16) }}>
          <ScreenHeaderTitle
            close={closeModal}
            title={
              postType === 'need'
                ? 'Offer Summary'
                : is_multiple
                ? 'My Basket'
                : 'Order Summary'
            }
          />
        </View>
        <View style={{ backgroundColor: '#F2F4F6' }}>
          <View
            style={{
              padding: normalize(20),
              backgroundColor: 'white',
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              marginBottom: normalize(10),
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: normalize(20),
                justifyContent: 'center',
              }}>
              <AppText textStyle="body1medium">{display_name}</AppText>
            </View>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons.BasketSummary
                  width={normalize(24)}
                  height={normalize(24)}
                />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  {postType === 'sell'
                    ? 'Order Summary'
                    : postType === 'service'
                    ? 'Service Summary'
                    : 'Your Offer'}
                </AppText>
              </View>
              {postType !== 'need' ? (
                <TouchableOpacity onPress={closeModal}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              ) : (
                <AppText textStyle="body1">
                  ₱
                  {postType === 'need' && offerData?.price
                    ? commaSeparate(offerData?.price)
                    : ''}
                </AppText>
              )}
            </View>

            <OrderSummary />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: normalize(15),
                borderTopColor: '#DADCE0',
                borderTopWidth: 1,
                display: postType !== 'need' ? 'flex' : 'none',
              }}>
              <AppText textStyle="body1medium">Total</AppText>
              <AppText textStyle="body1medium">
                ₱{commaSeparate(computedTotal())}
              </AppText>
            </View>
          </View>
          <View
            style={{
              padding: normalize(20),
              backgroundColor: 'white',
              borderRadius: 8,
              marginBottom: normalize(10),
              display: postType === 'service' ? 'flex' : 'none',
            }}>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PostCash width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Service Schedule
                </AppText>
              </View>
              {postType !== 'service' && (
                <TouchableOpacity onPress={() => showScheduleModal(true)}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    Change
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
            {/* <AppText textStyle="body2">{serviceSchedule}</AppText> */}
            {postType === 'service' && (
              <>
                {userCart.map((item, i) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: userCart.length - 1 === i ? 0 : 8,
                      }}>
                      <AppText textStyle="body2" customStyle={{ flex: 1 }}>
                        {item.name}
                      </AppText>
                      <AppText textStyle="body2" customStyle={{ flex: 2 }}>{`${
                        item.date
                      } ${item.time ? `@ ${item.time}` : ''}`}</AppText>
                    </View>
                  )
                })}
              </>
            )}
          </View>
          {postType !== 'need' ? (
            <View
              style={{
                padding: normalize(20),
                backgroundColor: 'white',
                borderRadius: 8,
                marginBottom: normalize(10),
              }}>
              <View style={styles.caption}>
                <DeliveryMethod />

                <TouchableOpacity onPress={() => showChangeDeliveryModal(true)}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    Change
                  </AppText>
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: normalize(10) }}>
                {postType !== 'service' ? (
                  <DeliveryAddress />
                ) : (
                  <ServiceAddress />
                )}
              </View>

              <>
                <View
                  pointerEvents="none"
                  style={{
                    top: 0,
                    height: normalize(125),
                    width: '100%',
                    marginBottom: 8,
                  }}>
                  {!mapInitialized ? (
                    <View style={[styles.loader]}>
                      <ActivityIndicator
                        color="#3781FC"
                        size="large"
                        animating={true}
                      />
                    </View>
                  ) : (
                    <MapComponent
                      latitude={mapCoords.lat}
                      longitude={mapCoords.lng}
                      reCenter={mapCoords}
                      onRegionChange={handleRegionChange}
                      customDelta={0.002}
                      customMarker={
                        <View
                          style={{
                            marginTop: normalize(25),
                          }}>
                          <PinBeeAlt
                            width={normalize(45)}
                            height={normalize(45)}
                          />
                        </View>
                      }
                    />
                  )}
                </View>
              </>
              <DeliveryNotes />

              {/* Hide for now 01-19 */}
              {/* <TouchableOpacity onPress={() => showAddNoteModal(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  {postType === 'sell'
                    ? deliveryChoice === 'delivery'
                      ? 'Add delivery notes'
                      : 'Add pick-up notes'
                    : postType === 'service'
                    ? 'Add notes'
                    : null}
                </AppText>
              </TouchableOpacity> */}
            </View>
          ) : null}
          <View
            style={{
              padding: normalize(20),
              backgroundColor: 'white',
              borderRadius: 8,
              marginBottom: normalize(10),
              display: postType !== 'need' ? 'flex' : 'none',
            }}>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons.BasketPayment
                  width={normalize(24)}
                  height={normalize(24)}
                />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Select Payment Method
                </AppText>
              </View>
            </View>
            {payment.includes('cash') && (
              <TouchableOpacity
                onPress={() => setPaymentMethod('cash')}
                style={[
                  styles.paymentBtn,
                  {
                    borderColor:
                      paymentMethod === 'cash' ? '#000' : Colors.neutralGray,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {paymentMethod === 'cash' ? <CashActive /> : <Cash />}
                  <AppText
                    textStyle={
                      paymentMethod === 'cash' ? 'body2medium' : 'body2'
                    }
                    customStyle={{ marginLeft: normalize(10) }}>
                    {postType === 'service'
                      ? 'Cash'
                      : 'Cash on Delivery / Pick up'}
                  </AppText>
                </View>
              </TouchableOpacity>
            )}
            {payment.includes('card') && (
              <TouchableOpacity
                onPress={() => setPaymentMethod('card')}
                style={[
                  styles.paymentBtn,
                  {
                    borderColor:
                      paymentMethod === 'card' ? '#000' : Colors.neutralGray,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {paymentMethod === 'card' ? (
                    <CreditCardActive />
                  ) : (
                    <CreditCard />
                  )}
                  <AppText
                    textStyle={
                      paymentMethod === 'card' ? 'body2medium' : 'body2'
                    }
                    customStyle={{ marginLeft: normalize(10) }}>
                    Visa / Mastercard
                  </AppText>
                  <AppText
                    textStyle="caption"
                    color={'#91919C'}
                    customStyle={{ marginLeft: 10 }}>
                    For orders ₱100 up
                  </AppText>
                </View>
              </TouchableOpacity>
            )}
            {payment.includes('gcash') && (
              <TouchableOpacity
                onPress={() => setPaymentMethod('gcash')}
                style={[
                  styles.paymentBtn,
                  {
                    borderColor:
                      paymentMethod === 'gcash' ? '#000' : Colors.neutralGray,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {paymentMethod === 'gcash' ? <GCashActive /> : <GCash />}
                  <AppText
                    textStyle={
                      paymentMethod === 'gcash' ? 'body2medium' : 'body2'
                    }
                    customStyle={{ marginLeft: normalize(10) }}>
                    GCash
                  </AppText>
                  <AppText
                    textStyle="caption"
                    color={'#91919C'}
                    customStyle={{ marginLeft: 10 }}>
                    For orders ₱100 up
                  </AppText>
                </View>
                {paymentMethod === 'gcash' && (
                  <View style={{ marginTop: 10 }}>
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 8 }}>
                      Choose this to pay with your available balance.
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {payment.includes('grabpay') && (
              <TouchableOpacity
                onPress={() => setPaymentMethod('grabpay')}
                style={[
                  styles.paymentBtn,
                  {
                    borderColor:
                      paymentMethod === 'grabpay' ? '#000' : Colors.neutralGray,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {paymentMethod === 'grabpay' ? (
                    <GrabPayActive />
                  ) : (
                    <GrabPay />
                  )}
                  <AppText
                    textStyle={
                      paymentMethod === 'grabpay' ? 'body2medium' : 'body2'
                    }
                    customStyle={{ marginLeft: normalize(10) }}>
                    GrabPay
                  </AppText>
                  <AppText
                    textStyle="caption"
                    color={'#91919C'}
                    customStyle={{ marginLeft: 10 }}>
                    For orders ₱100 up
                  </AppText>
                </View>
                {paymentMethod === 'grabpay' && (
                  <View style={{ marginTop: 10 }}>
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 8 }}>
                      Choose this to pay with your GrabPay balance.
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {payment.includes('paypal') && (
              <TouchableOpacity
                onPress={() => setPaymentMethod('paypal')}
                style={[
                  styles.paymentBtn,
                  {
                    borderColor:
                      paymentMethod === 'paypal' ? '#000' : Colors.neutralGray,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {paymentMethod === 'paypal' ? <PaypalActive /> : <Paypal />}
                  <AppText
                    textStyle={
                      paymentMethod === 'paypal' ? 'body2medium' : 'body2'
                    }
                    customStyle={{ marginLeft: normalize(10) }}>
                    Paypal
                  </AppText>
                  <AppText
                    textStyle="caption"
                    color={'#91919C'}
                    customStyle={{ marginLeft: 10 }}>
                    For orders ₱100 up
                  </AppText>
                </View>
                {paymentMethod === 'paypal' && (
                  <View style={{ marginTop: 10 }}>
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 8 }}>
                      Choose this to pay with your PayPal balance.
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              padding: normalize(20),
              backgroundColor: 'white',
              borderRadius: 8,
              marginBottom: normalize(10),
              display: postType === 'need' ? 'flex' : 'none',
            }}>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PostCash width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Message
                </AppText>
              </View>
              <TouchableOpacity onPress={closeModal}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2">
              {postType === 'need' && offerData?.message
                ? offerData?.message
                : 'No message'}
            </AppText>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(20),
              paddingTop: normalize(20),
              paddingBottom: normalize(40),
              backgroundColor: 'white',
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              marginBottom: 10,
              display: postType !== 'need' ? 'flex' : 'none',
            }}>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icons.BasketAdditionalNotes
                  width={normalize(24)}
                  height={normalize(24)}
                />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Additional Notes
                </AppText>
              </View>
              <TouchableOpacity onPress={() => showOrderNotes(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  {notes ? 'Edit' : 'Add'}
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2" customStyle={{ marginBottom: 24 }}>
              {notes}
            </AppText>
            <ImportantNotes />
          </View>
          {attachedPostData && (
            <View
              style={{
                paddingHorizontal: normalize(20),
                paddingTop: normalize(20),
                paddingBottom: normalize(40),
                backgroundColor: 'white',
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                display: postType === 'need' ? 'flex' : 'none',
              }}>
              <View style={styles.caption}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {postType === 'need' ? (
                    <Send width={normalize(24)} height={normalize(24)} />
                  ) : (
                    <PostCash width={normalize(24)} height={normalize(24)} />
                  )}
                  <AppText
                    textStyle="body1medium"
                    customStyle={{ marginLeft: normalize(10) }}>
                    Attached Post
                  </AppText>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    Change
                  </AppText>
                </TouchableOpacity>
              </View>
              <AttachedPost />
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: normalize(16),
          paddingVertical: normalize(24),
        }}>
        {paymentMethod === 'cash' || paymentMethod === '' ? null : (
          <AppText
            textStyle="caption"
            customStyle={{ marginBottom: 10, textAlign: 'center' }}>
            Please wait for the seller to confirm your order before proceeding
            with the payment.
          </AppText>
        )}

        <SubmitButton />
      </View>
      <Modal
        isVisible={changeDeliveryModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showChangeDeliveryModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChangeDeliveryMethodModal
          type={postType}
          deliveryChoice={deliveryChoice}
          setDeliveryChoice={choice => setDeliveryChoice(choice)}
          availableDeliveryMethods={delivery_methods}
          closeModal={() => showChangeDeliveryModal(false)}
        />
      </Modal>
      <Modal
        isVisible={changePaymentModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showChangePaymentModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChangePaymentMethodModal
          availablePaymentMethods={payment}
          closeModal={() => showChangePaymentModal(false)}
          setPaymentChoice={choice => setPaymentChoice(choice)}
          paymentChoice={paymentChoice}
        />
      </Modal>
      <Modal
        isVisible={addNoteModal}
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
        <AddNoteModal closeModal={() => showAddNoteModal(false)} />
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
        <ServiceSchedule
          close={() => showScheduleModal(false)}
          setServiceSchedule={text => setServiceSchedule(text)}
        />
      </Modal>

      <Modal
        isVisible={orderNotes}
        animationIn="slideInUp"
        animationInTiming={300}
        animationOut="slideOutDown"
        animationOutTiming={250}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showOrderNotes(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <OrderNotesModal
          close={() => showOrderNotes(false)}
          setNotes={notes => setNotes(notes)}
          notes={notes}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  caption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
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
  paymentBtn: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 4,
  },
  paymentBtnDisabled: {
    backgroundColor: '#fbfbfb',
    borderWidth: 0,
  },
})

export default BasketModal
