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
} from 'react-native'

import Modal from 'react-native-modal'
import Geocoder from 'react-native-geocoding'
import Geolocation from '@react-native-community/geolocation'
import Post from '@/components/Post/Post'
import API from '@/services/Api'

import { AppText, ScreenHeaderTitle, MapComponent } from '@/components'
import Config from '@/services/Config'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import Api from '@/services/Api'
import { normalize, Colors } from '@/globals'

import {
  PostNote,
  PostBox,
  PostCash,
  StarRating,
  DeliveryVan,
  Send,
  Cash,
  CreditCard,
  GCash,
  GrabPay,
  NavigationPinAlt,
  CashActive,
  CreditCardActive,
  GCashActive,
  GrabPayActive,
  PaypalActive,
  Paypal,
} from '@/assets/images/icons'

import ChangeDeliveryMethodModal from './ChangeDeliveryMethodModal'
import ChangePaymentMethodModal from './ChangePaymentMethodModal'
import AddNoteModal from './AddNoteModal'
import TrackerModal from './TrackerModal'
import OrderNotesModal from './OrderNotesModal'
import CreditCardModal from './CreditCardModal'
import GCashModal from './GCashModal'
import GrabPayModal from './GrabPayModal'
import PaypalModal from './PaypalModal'

const BasketModal = ({
  closeModal,
  postType,
  postData,
  offerData,
  selectedPostDetails,
}) => {
  const [changeDeliveryModal, showChangeDeliveryModal] = useState(false)
  const [changePaymentModal, showChangePaymentModal] = useState(false)
  const [addNoteModal, showAddNoteModal] = useState(false)
  const [trackerModal, showTrackerModal] = useState(false)
  const [orderNotes, showOrderNotes] = useState(false)

  const [creditCardModal, showCreditCardModal] = useState(false)
  const [gCashModal, showGcashModal] = useState(false)
  const [grabPayModal, showGrabPayModal] = useState(false)
  const [paypalModal, showPaypalModal] = useState(false)
  const [orderID, setOrderID] = useState()
  const [userData, setUserData] = useState({})
  const [attachedPostData, setAttachedPostData] = useState()

  const { userCart, setUserCart } = useContext(Context)
  const { userInfo, user } = useContext(UserContext)
  const { addresses } = userInfo

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
  } = postData

  const [deliveryChoice, setDeliveryChoice] = useState(
    delivery_methods.delivery ? 'delivery' : 'pickup'
  )
  const [paymentChoice, setPaymentChoice] = useState(payment[0])
  const [notes, setNotes] = useState()
  const [paymentMethod, setPaymentMethod] = useState('')

  const goToPayment = paymentMethod => {
    switch (paymentMethod) {
      case 'cash':
        null
        break
      case 'credit':
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
      province: getLocationName(
        addressComponents,
        'administrative_area_level_2'
      ),
      country: getLocationName(addressComponents, 'country'),
      full_address: results[0].formatted_address,
    })
  }

  const initializeMap = async () => {
    try {
      setMapCoords({
        lat: addresses.find(address => address.default).latitude,
        lng: addresses.find(address => address.default).longitude,
      })
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
  }, [])

  //MAP END

  const computedTotal = () => {
    let computedPrice = 0

    if (userCart.length > 0 && is_multiple)
      userCart.map(item => {
        computedPrice += item.price * item.quantity
      })

    if (!is_multiple) {
      computedPrice = price
    }

    return computedPrice
  }

  const sendOfferHandler = async () => {
    const parameters = {
      uid: user.uid,
      body: {
        post_id: postData?.post_id,
        price: Number(offerData?.price),
        message: offerData?.message,
      },
    }

    const response = await Api.createOrder(parameters)

    if (response.success) {
      setOrderID(response.order_id)
      showTrackerModal(true)
    } else {
      alert('Creating offer failed.')
    }
  }

  const placeOrderHandler = async () => {
    const itemsToSave = !is_multiple
      ? [
          {
            id: items[0].id,
            title: title,
            description: description,
            quantity: 1,
            price: items[0].id,
            image: cover_photos ? cover_photos[0] : '',
          },
        ]
      : userCart

    const parameters = {
      uid: user.uid,
      body: {
        items: itemsToSave,
        post_id: postData?.id,
        delivery_method: deliveryChoice,
        payment_method: paymentChoice,
        notes: notes,
      },
    }

    const response = await Api.createOrder(parameters)

    if (response.success) {
      setOrderID(response.order_id)
      showTrackerModal(true)

      setUserCart([])
    } else {
      console.log(response)
      alert('Creating offer failed.')
    }
  }

  useEffect(() => {
    if (selectedPostDetails?.id) {
      getUserData()
    }
  }, [])

  const getUserData = async () => {
    const response = await API.getUser({ uid: selectedPostDetails.uid })

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
    if (is_multiple)
      return userCart.map((item, k) => {
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
                {item.note && <AppText textStyle="body2">{item.note}</AppText>}
              </View>
            </View>
            <AppText textStyle="body1">₱{item.price * item.quantity}</AppText>
          </View>
        )
      })
    else
      return (
        <View style={{ marginVertical: 12 }}>
          <AppText textStyle="body3">{title}</AppText>
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
            iconSize={normalize(16)}
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
                <PostNote width={normalize(24)} height={normalize(24)} />
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
                    Change
                  </AppText>
                </TouchableOpacity>
              ) : (
                <AppText textStyle="body1">
                  ₱
                  {postType === 'need' && offerData?.price
                    ? offerData?.price
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
              <AppText textStyle="body1medium">₱{computedTotal()}</AppText>
            </View>
          </View>
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
                <PostBox width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  {postType === 'service'
                    ? 'Service Location'
                    : postType === 'sell'
                    ? deliveryChoice !== 'delivery'
                      ? 'Pick-up'
                      : 'Delivery'
                    : null}
                </AppText>
              </View>
              <TouchableOpacity onPress={() => showChangeDeliveryModal(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  Change
                </AppText>
              </TouchableOpacity>
            </View>
            {deliveryChoice === 'delivery' || deliveryChoice === 'service' ? (
              <>
                <View
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
                      withCurrentMarker
                      customMarker={
                        <View
                          style={{
                            marginTop: normalize(25),
                            marginLeft: normalize(9),
                          }}>
                          <NavigationPinAlt
                            width={normalize(30)}
                            height={normalize(30)}
                          />
                        </View>
                      }
                    />
                  )}
                </View>
                <View style={{ paddingTop: normalize(10) }}>
                  <AppText textStyle="body1medium">Home</AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginVertical: normalize(10) }}>
                    {addressData.full_address}
                  </AppText>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    top: 0,
                    height: normalize(125),
                    width: '100%',
                    marginBottom: 8,
                  }}></View>
                <View style={{ paddingTop: normalize(10) }}>
                  <AppText textStyle="body1medium">
                    Wayne’s Burgers and Smoothies
                  </AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginVertical: normalize(10) }}>
                    Hon. B. Solivena Avenue corner 32nd St Pasig City
                  </AppText>
                </View>
              </>
            )}
            <TouchableOpacity onPress={() => showAddNoteModal(true)}>
              <AppText textStyle="button2" color={Colors.contentOcean}>
                {postType === 'sell'
                  ? deliveryChoice === 'delivery'
                    ? 'Add delivery notes'
                    : 'Add pick-up notes'
                  : postType === 'service'
                  ? 'Add notes'
                  : null}
              </AppText>
            </TouchableOpacity>
          </View>
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
                <PostCash width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Select Payment Method
                </AppText>
              </View>
            </View>
            {/* <AppText
              textStyle="body2"
              customStyle={{ textTransform: 'capitalize' }}>
              {paymentChoice}
            </AppText> */}
            <TouchableOpacity
              onPress={() => setPaymentMethod('cash')}
              style={styles.paymentBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {paymentMethod === 'cash' ? <CashActive /> : <Cash />}
                <AppText
                  textStyle={paymentMethod === 'cash' ? 'body2medium' : 'body2'}
                  customStyle={{ marginLeft: normalize(10) }}>
                  Cash on Delivery / Pick up
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod('credit')}
              style={styles.paymentBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {paymentMethod === 'credit' ? (
                  <CreditCardActive />
                ) : (
                  <CreditCard />
                )}
                <AppText
                  textStyle={
                    paymentMethod === 'credit' ? 'body2medium' : 'body2'
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
            <TouchableOpacity
              onPress={() => setPaymentMethod('gcash')}
              style={styles.paymentBtn}>
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod('grabpay')}
              style={styles.paymentBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {paymentMethod === 'grabpay' ? <GrabPayActive /> : <GrabPay />}
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod('paypal')}
              style={styles.paymentBtn}>
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
            </TouchableOpacity>
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
              <TouchableOpacity onPress={() => showChangePaymentModal(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  Change
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2">September 29, 2020 at 10:00AM</AppText>
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
                <PostCash width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Notes
                </AppText>
              </View>
              <TouchableOpacity onPress={() => showOrderNotes(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  {notes ? 'Edit' : 'Add Notes'}
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2">{notes}</AppText>
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
        <TouchableOpacity
          onPress={() => {
            if (postType === 'need') {
              sendOfferHandler()
            } else {
              goToPayment(paymentMethod)
              // placeOrderHandler()
            }
          }}>
          <View style={styles.buyButtonContainer}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: normalize(16),
              }}>
              <AppText textStyle="body1medium">
                {postType === 'need' ? 'Send Offer' : 'Continue'}
              </AppText>
              <AppText textStyle="body1">
                {postType === 'need'
                  ? `₱${offerData?.price}`
                  : `₱${computedTotal()}`}
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
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
        isVisible={trackerModal}
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
        <TrackerModal
          closeModal={() => {
            showTrackerModal(false)
            closeModal()
          }}
          postType={postType}
          postData={postData}
          orderID={orderID}
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

      <Modal
        isVisible={creditCardModal}
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
        <CreditCardModal
          closeModal={() => showCreditCardModal(false)}
          placeOrder={() => placeOrderHandler()}
        />
      </Modal>
      <Modal
        isVisible={gCashModal}
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
        <GCashModal closeModal={() => showGcashModal(false)} />
      </Modal>
      <Modal
        isVisible={grabPayModal}
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
        <GrabPayModal closeModal={() => showGrabPayModal(false)} />
      </Modal>
      <Modal
        isVisible={paypalModal}
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
        <PaypalModal closeModal={() => showPaypalModal(false)} />
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
    borderColor: Colors.neutralGray,
    borderRadius: 4,
  },
})

export default BasketModal
