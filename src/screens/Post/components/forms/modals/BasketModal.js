import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
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
} from '@/assets/images/icons'

import ChangeDeliveryMethodModal from './ChangeDeliveryMethodModal'
import ChangePaymentMethodModal from './ChangePaymentMethodModal'
import AddNoteModal from './AddNoteModal'
import TrackerModal from './TrackerModal'

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
  const [orderID, setOrderID] = useState()
  const [userData, setUserData] = useState({})
  const [attachedPostData, setAttachedPostData] = useState()

  const {
    deliveryMethod,
    setDeliveryMethod,
    userCart,
    setUserCart,
  } = useContext(Context)
  const { userInfo, user } = useContext(UserContext)
  const { addresses } = userInfo

  // MAP
  Geocoder.init(Config.apiKey)
  const [newCoords] = useState(
    userInfo.addresses
      ? {
          latitude: addresses.find(address => address.default).latitude,
          longitude: addresses.find(address => address.default).longitude,
        }
      : { latitude: 14.5831, longitude: 120.9794 }
  )
  const [changeMapAddress, setChangeMapAddress] = useState('')
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  })

  const onRegionChange = region => {
    getStringAddress(region, null)
  }

  const getStringAddress = (location, strAddress) => {
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        const stringMapDrag = json.results[1].formatted_address
        const arrayToExtract =
          json.results.length < 8 ? 2 : json.results.length - 5
        setChangeMapAddress(strAddress ? strAddress : stringMapDrag)
        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: location.latitude,
            longitude: location.longitude,
            city: json.results[arrayToExtract].address_components[0].long_name,
            province:
              json.results[arrayToExtract].address_components[1].long_name,
            country: 'Philippines',
          },
        })
      })
      .catch(error => console.warn(error))
  }
  //MAP END

  const computedTotal = () => {
    let computedPrice = 0

    if (userCart.length > 0)
      userCart.map(item => {
        computedPrice += item.price * item.quantity
      })

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
    showTrackerModal(true)
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
            title={postType === 'need' ? 'Offer Summary' : 'My Basket'}
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
              <AppText textStyle="body1medium">{postData.title}</AppText>
              {/* <View style={{ flexDirection: 'row', marginLeft: normalize(10) }}>
                <StarRating />
                <AppText
                  textStyle="body1"
                  customStyle={{ marginLeft: normalize(5) }}>
                  4.5
                </AppText>
              </View> */}
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
            {userCart.map((item, k) => {
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
                    ₱{item.price * item.quantity}
                  </AppText>
                </View>
              )
            })}
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
                    ? deliveryMethod !== 'delivery'
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
            {deliveryMethod === 'delivery' || deliveryMethod === 'service' ? (
              <>
                <View
                  style={{
                    top: 0,
                    height: normalize(125),
                    width: '100%',
                    marginBottom: 8,
                  }}>
                  <MapComponent
                    latitude={
                      addresses.find(address => address.default).latitude
                    }
                    longitude={
                      addresses.find(address => address.default).longitude
                    }
                    reCenter={newCoords}
                    onRegionChange={region => {
                      onRegionChange(region)
                    }}
                    withCurrentMarker={false}
                  />
                </View>
                <View style={{ paddingTop: normalize(10) }}>
                  <AppText textStyle="body1medium">Home</AppText>
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginVertical: normalize(10) }}>
                    {addresses.find(address => address.default).full_address}
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
                  }}>
                  <MapComponent
                    latitude={
                      addresses.find(address => address.default).latitude
                    }
                    longitude={
                      addresses.find(address => address.default).longitude
                    }
                    reCenter={newCoords}
                    onRegionChange={region => {
                      onRegionChange(region)
                    }}
                    withCurrentMarker={false}
                  />
                </View>
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
                  ? deliveryMethod === 'delivery'
                    ? 'Add delivery notes'
                    : 'Add pick-up notes'
                  : postType === 'service'
                  ? 'Add notes'
                  : null}
              </AppText>
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              paddingTop: normalize(20),
              paddingHorizontal: normalize(20),
              backgroundColor: 'white',
              borderRadius: 8,
              marginBottom: normalize(10),
              display:
                postType === 'sell'
                  ? deliveryMethod === 'delivery'
                    ? 'flex'
                    : 'none'
                  : 'none',
            }}>
            <View style={styles.caption}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DeliveryVan width={normalize(20)} height={normalize(20)} />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Delivery Fee
                </AppText>
              </View>
              <AppText textStyle="body1">₱75</AppText>
            </View>
          </View> */}
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
                  Payment Method
                </AppText>
              </View>
              <TouchableOpacity onPress={() => showChangePaymentModal(true)}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  Change
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2">Cash, change ₱500</AppText>
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
              <TouchableOpacity onPress={closeModal}>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText textStyle="body2">Extra gravy</AppText>
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
            } else showTrackerModal(true)
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
                {postType === 'need' ? 'Send Offer' : 'Place order'}
              </AppText>
              <AppText textStyle="body1">
                {postType === 'need' ? `₱${offerData?.price}` : '₱0.00'}
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
          closeModal={() => showChangePaymentModal(false)}
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
          closeModal={() => showTrackerModal(false)}
          postType={postType}
          postData={postData}
          orderID={orderID}
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
})

export default BasketModal
