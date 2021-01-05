import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

/*Map Essentials*/
// import {ArrowRight, Public, ArrowDown} from '@/assets/images/icons';
import Geocoder from 'react-native-geocoding'
import Config from '@/services/Config'
import Modal from 'react-native-modal'
import StoreLocation from '../StoreLocation'
import moment from 'moment'
/*Map Essentials*/

import {
  AppInput,
  Validator,
  valueHandler,
  PriceInput,
} from '@/components/AppInput'
import {
  ArrowRight,
  Public,
  ArrowDown,
  MenuInfo,
  PostInfo,
  PostAdd,
  FormArrowRight,
  MoreOptions,
} from '@/assets/images/icons'
import {
  AppText,
  Switch,
  AppButton,
  CacheableImage,
  TransitionIndicator,
  AppRadio,
  AppCheckbox,
  ItemCategory,
  BottomSheetHeader,
} from '@/components'
import { normalize, Colors, GlobalStyle } from '@/globals'
import { PostService, ImageUpload, MapService } from '@/services'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { PostImageUpload } from '../PostImageUpload'
import AddItemModal from './modals/AddItemModal'
import PrivacyModal from './modals/PrivacyModal'
import PaymentMethodModal from './modals/PaymentMethodModal'
import ShippingMethodModal from './modals/ShippingMethodModal'
import PostExpiryModal from './modals/PostExpiryModal'
import StoreLocationModal from './modals/StoreLocationModal'
import ScheduleModal from './modals/ScheduleModal'
import BookingMethodModal from './modals/BookingMethodModal'
import MoreOptionsModal from './modals/MoreOptions'
import CoverPhotoGuidelinesModal from './modals/CoverPhotoGuidelines'
import AdditionalNotesModal from './modals/AdditionalNotesModal'

const SellPostForm = ({
  navToPost,
  togglePostModal,
  formState,
  initialData,
  activeScreen,
}) => {
  const sellForm = {
    type: 'sell',
    privacy: false,
    location: true,
    schedule: false,
    multipleItems: true,
    multipleService: false,
    budgetRange: false,
    payment: true,
    shipping: true,
    moreOptions: true,
    expiry: false,
    booking: false,
    additionalNotes: false,
  }

  const needForm = {
    type: 'need',
    privacy: false,
    location: true,
    schedule: false,
    multipleItems: false,
    multipleService: false,
    budgetRange: true,
    payment: true,
    shipping: false,
    moreOptions: true,
    expiry: false,
    booking: false,
    additionalNotes: false,
  }

  const serviceForm = {
    type: 'service',
    privacy: false,
    location: true,
    schedule: false,
    multipleItems: false,
    multipleService: true,
    budgetRange: false,
    payment: true,
    shipping: false,
    moreOptions: true,
    expiry: false,
    booking: true,
    additionalNotes: false,
  }

  useEffect(() => {
    if (activeScreen === 'post') setActiveForm(needForm)
    if (activeScreen === 'sell') setActiveForm(sellForm)
    if (activeScreen === 'need') setActiveForm(serviceForm)
  }, [activeScreen])

  const [activeForm, setActiveForm] = useState(sellForm)

  const {
    coverPhoto,
    setNeedsRefresh,
    setCoverPhoto,
    setLibImages,
    setCameraImage,
    setSingleCameraImage,
    setSelected,
    setImageCurrent,
    items,
  } = useContext(Context)
  const { user, userInfo, setUserInfo } = useContext(UserContext)
  const [buttonEnabled, setButtonEnabled] = useState(false)

  // Converting to route
  const navigation = useNavigation()

  /*MAP Essentials */
  const [map, setMap] = useState(false)
  const { addresses } = userInfo
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  })
  const [budgetRange, setBudgetRange] = useState(false)
  const [budgetMinimum, setBudgetMinimum] = useState(
    initialData?.price_range?.min
  )
  const [budgetMaximum, setBudgetMaximum] = useState(
    initialData?.price_range?.max
  )
  const [bookingMethods, setBookingMethods] = useState(false)

  const [showLocation, setShowLocation] = useState(false)
  const [stringAddress, setStringAddress] = useState('')
  const [moreOptions, showMoreOptions] = useState(false)
  const [addItemModal, showAddItemModal] = useState(false)
  const [privacyModal, showPrivacyModal] = useState(false)
  const [paymentMethodModal, showPaymentMethodModal] = useState(false)
  const [shippingMethodModal, showShippingMethodModal] = useState(false)
  const [postExpiryModal, showPostExpiryModal] = useState(false)
  const [scheduleModal, showScheduleModal] = useState(false)
  const [bookingMethodModal, showBookingMethodModal] = useState(false)
  const [coverPhotoGuidelines, showCoverPhotoGuidelines] = useState(false)
  const [additionalNotes, showAdditionalNotes] = useState(false)
  const [storeSchedule, setStoreSchedule] = useState([])
  const [schedule, setSchedule] = useState()

  const [data, setData] = useState([])

  const [pickupAddress, setPickupAddress] = useState(
    initialData?.delivery_methods?.pickup?.location
      ? initialData?.delivery_methods?.pickup?.location
      : addresses.find(address => address.default)
  )

  const [storeAddress, setStoreAddress] = useState(
    initialData?.store_details?.location
      ? initialData?.store_details?.location
      : addresses.find(address => address.default)
  )

  const {
    title,
    setTitle,
    images,
    price,
    setPrice,
    description,
    setDescription,
    pickupState,
    setPickupState,
    deliveryState,
    setDeliveryState,
    storeLocation,
    setStoreLocation,
    paymentMethod,
    setPaymentMethod,
    listAsSingle,
    setListAsSingle,
    listAsMultiple,
    setListAsMultiple,
    freeCheckbox,
    setFreeCheckbox,
    setPostInStore,
    postInStore,
    paymentMethods,
    setPaymentMethods,
    postExpiry,
    setPostExpiry,
    allowContact,
    setAllowContact,
  } = formState

  const togglePickupState = () => {
    setPickupState(!pickupState)
  }

  const toggleDeliveryState = () => {
    setDeliveryState(!deliveryState)
  }

  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const clearForm = () => {
    setTitle('')
    setPrice('')
    setDescription('')
    setPickupState(false)
    setDeliveryState(false)
    setStoreLocation('')
    setPaymentMethod('')
  }

  useEffect(() => {
    checkFormContent()
  })

  useEffect(() => {
    if (listAsMultiple) RadioStateHandler('multiple')
    else if (listAsSingle) RadioStateHandler('single')

    setCoverPhoto(images)
  }, [])

  const checkFormContent = () => {
    const paymentListValues = Object.values(paymentMethods)

    // Required fields for sell form
    if (
      activeForm.type === 'sell' &&
      title &&
      (price || listAsMultiple) &&
      (pickupState || deliveryState) &&
      paymentListValues.includes(true)
    )
      return setButtonEnabled(false)

    // Required fields for need form
    if (
      activeForm.type === 'need' &&
      title &&
      budgetMaximum &&
      budgetMinimum &&
      paymentListValues.includes(true)
    )
      return setButtonEnabled(false)

    // Required fields for service form
    if (
      activeForm.type === 'service' &&
      title &&
      (price || listAsMultiple) &&
      (pickupState || deliveryState) &&
      paymentListValues.includes(true)
    )
      return setButtonEnabled(false)

    return setButtonEnabled(true)
  }

  const publish = async () => {
    setLoadingSubmit(true)

    try {
      let paymentMethodsList = []

      for (const [key, value] of Object.entries(paymentMethods)) {
        if (value === true) {
          paymentMethodsList.push(key)
        }
      }

      const priceRange =
        activeForm.type === 'need'
          ? {
              price_range: {
                min: budgetMinimum,
                max: budgetMaximum,
              },
            }
          : {}

      const itemsToSave = listAsMultiple
        ? await Promise.all(
            items.map(async item => {
              return {
                category: item.categoryName,
                image: await ImageUpload.upload(item.itemImage?.uri, user.uid),
                name: item.title,
                description: item.description,
                price: item.price,
              }
            })
          )
        : [
            {
              price: price,
            },
          ]

      const data = {
        type: activeForm.type,
        privacy: 'public',
        title: title,
        description: description,
        cover_photos: await Promise.all(
          coverPhoto?.map?.(
            async image => await ImageUpload.upload(image, user.uid)
          ) || []
        ),
        items: itemsToSave,
        is_multiple: listAsMultiple,
        delivery_methods: {
          pickup: { ...pickupState?.pickup },
          delivery: { ...deliveryState?.delivery },
        },
        payment: paymentMethodsList,
        store_details: {
          location: storeAddress,
          schedule: schedule,
        },
        expiry: postExpiry,
        availability: true,
        allow_contact: allowContact,
        ...priceRange,
      }

      if (initialData.id) {
        const res = await PostService.editPost(initialData.id, data)
        navToPost({
          ...res,
          viewing: false,
          created: false,
          edited: true,
        })
      } else {
        const res = await PostService.createPost(data)
        navToPost({
          ...res,
          viewing: false,
          created: true,
          edited: false,
        })
      }

      togglePostModal?.()
      setNeedsRefresh(true)
      setCoverPhoto([])
      setLibImages([])
      setCameraImage([])
      setSingleCameraImage([])
      setSelected([])
      setImageCurrent('')
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.')
      console.log(error.message || error)
    }

    setLoadingSubmit(false)
  }

  const RadioStateHandler = val => {
    if (val === 'single') {
      setListAsMultiple(false)
      setListAsSingle(true)
      showSingle()
      hideMultiple()
    }
    if (val === 'multiple') {
      setListAsMultiple(true)
      setListAsSingle(false)
      hideSingle()
      showMultiple()
    }
    if (val === 'public') {
      setPublicPost(true)
    }
  }

  /**FOR ANIMATION */
  const [singleActiveHeight] = useState(new Animated.Value(0))
  const [singleActiveOpacity] = useState(new Animated.Value(0))
  const [multipleActiveHeight] = useState(new Animated.Value(0))
  const [multipleActiveOpacity] = useState(new Animated.Value(0))

  let multipleActiveStyle = {
    height: multipleActiveHeight,
    opacity: multipleActiveOpacity,
  }

  let singleActiveStyle = {
    height: singleActiveHeight,
    opacity: singleActiveOpacity,
  }

  const showSingle = async () => {
    Animated.sequence([
      Animated.timing(singleActiveHeight, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(singleActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const hideSingle = async () => {
    Animated.sequence([
      Animated.timing(singleActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(singleActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const showMultiple = async () => {
    Animated.sequence([
      Animated.timing(multipleActiveHeight, {
        toValue: 54,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(multipleActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const hideMultiple = async () => {
    Animated.sequence([
      Animated.timing(multipleActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(multipleActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }

  /**FOR ANIMATION */

  const SelectedPaymentMethods = () => {
    let paymentMethodList = []
    for (const [key, value] of Object.entries(paymentMethods)) {
      if (value === true) {
        if (key === 'onlineBanking') {
          paymentMethodList.push('Online Banking')
        } else {
          paymentMethodList.push(key)
        }
      }
    }

    const display = paymentMethodList.join(', ')

    if (display)
      return (
        <AppText
          textStyle="body2"
          customStyle={{ textTransform: 'capitalize' }}>
          {display}
        </AppText>
      )
    else {
      return <></>
    }
  }

  const setMoreOptions = opt => {
    setActiveForm({
      ...activeForm,
      [opt]: true,
    })
  }

  const postDescriptionPlaceholder = {
    sell:
      'Let your customers know what you offer. Make your post attractive and easier to find by adding descriptions and hashtags. e.g. #Food #Dessert (Optional)',
    need:
      'Attract people that can supply your specific needs by adding descriptions and hashtags here. e.g. #electrician #plumber (Optional)',
    service:
      'Let your customers know more about your service. Add details that will help them understand what you offer. You can also add hashtags to make it easier for others to find your post. e.g. #pasabuy (Optional)',
  }

  const postTitlePlaceholder = {
    sell: 'e.g. iPhone, Macbook',
    need: 'e.g. Looking for an electrician',
    service: 'e.g. Online Tutor, Maintenance',
  }

  const handleOnAddMobileNumberPress = () => {
    navigation.navigate('Verification', {
      screen: 'phone-verification',
    })
  }

  const renderAllowContact = () => {
    if (userInfo.phone_number) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setAllowContact(!allowContact)}
          style={styles.allowContactWrapper}>
          <AppText textStyle="body2" customStyle={{ maxWidth: '87%' }}>
            Display my mobile number and allow customers to contact me via call
            or text.
          </AppText>
          <AppCheckbox
            value={allowContact}
            valueChangeHandler={() => setAllowContact(!allowContact)}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.noNumber}>
          <AppText textStyle="body2medium" customStyle={styles.noNumberTitle}>
            No mobile number added
          </AppText>
          <AppText textStyle="eyebrow2" customStyle={styles.noNumberMessage}>
            Add your mobile number to ensure customer service.
          </AppText>
          <TouchableOpacity onPress={handleOnAddMobileNumberPress}>
            <AppText
              textStyle="body2medium"
              customStyle={styles.noNumberAction}>
              Add and verify mobile number
            </AppText>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          marginBottom: 8,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          paddingBottom: 32,
        }}>
        {activeForm.privacy && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="caption" customStyle={{ fontSize: 16 }}>
              Who can see your post?*
            </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => showPrivacyModal(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.checkboxBorderDefault,
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}>
                <Public />
                <AppText
                  customStyle={{ paddingLeft: 4 }}
                  color={Colors.checkboxBorderDefault}
                  textStyle="caption">
                  Public
                </AppText>
                <View style={{ paddingLeft: 12 }}>
                  <ArrowDown />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <PostImageUpload />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => showCoverPhotoGuidelines(true)}
          style={{ marginBottom: 16 }}>
          <AppText textStyle="caption" color={Colors.contentOcean}>
            Cover Photo Guidelines
          </AppText>
        </TouchableOpacity>
        <Modal
          isVisible={coverPhotoGuidelines}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          onBackButtonPress={() => setMap(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <CoverPhotoGuidelinesModal
            close={() => showCoverPhotoGuidelines(false)}
          />
        </Modal>

        <AppInput
          style={{ marginBottom: 16 }}
          label="Title"
          placeholder={postTitlePlaceholder[activeForm.type]}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <View>
          <AppText
            textStyle="body2"
            customStyle={{ position: 'absolute', left: 16, top: 8 }}>
            Description
          </AppText>
          <TextInput
            value={description}
            multiline={true}
            placeholder={postDescriptionPlaceholder[activeForm.type]}
            numberOfLines={Platform.OS === 'ios' ? null : 6}
            minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
            style={{
              color: Colors.contentEbony,
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(16),
              letterSpacing: 0.5,
              borderColor: Colors.neutralGray,
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 16,
              paddingTop: 32,
              paddingBottom: 8,
              marginBottom: 16,
              textAlign: 'left',
            }}
            onChangeText={text => setDescription(text)}
            underlineColorAndroid={'transparent'}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </View>
        {renderAllowContact()}
      </View>

      {/* LOCATION SECTION */}
      {activeForm.location && (
        <Section>
          <TouchableOpacity
            onPress={() => setMap(true)}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText textStyle="body3">Location</AppText>
            <FormArrowRight />
          </TouchableOpacity>
          <AppText textStyle="body3" customStyle={{ marginTop: 4 }}>
            {storeAddress.name} {storeAddress.default ? '(Default)' : ''}{' '}
          </AppText>
          <AppText textStyle="body2">{storeAddress.full_address}</AppText>
        </Section>
      )}

      <Modal
        isVisible={map}
        animationIn="slideInRight"
        animationInTiming={300}
        animationOut="slideOutRight"
        animationOutTiming={250}
        onBackButtonPress={() => setMap(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <StoreLocationModal
          close={() => setMap(false)}
          pickupAddress={storeAddress}
          setPickupAddress={setStoreAddress}
        />
      </Modal>

      {activeForm.schedule && (
        <Section>
          <TouchableOpacity
            onPress={() => showScheduleModal(true)}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText textStyle="body3">Schedule</AppText>
            <FormArrowRight />
          </TouchableOpacity>
          {storeSchedule.map(schedule => {
            return (
              <View style={{ flexDirection: 'row' }}>
                <AppText
                  textStyle="body2"
                  customStyle={{
                    textTransform: 'capitalize',
                    marginRight: 8,
                    flex: 1,
                  }}>
                  {schedule.day}
                </AppText>
                <AppText customStyle={{ flex: 2 }} textStyle="body2">
                  {schedule.time}
                </AppText>
              </View>
            )
          })}
        </Section>
      )}
      <Modal
        isVisible={scheduleModal}
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
        <ScheduleModal
          close={() => showScheduleModal(false)}
          setStoreSchedule={schedule => setStoreSchedule(schedule)}
          setSchedule={schedule => setSchedule(schedule)}
          schedule={schedule}
        />
      </Modal>

      {activeForm.multipleItems && (
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            paddingVertical: 32,
            borderRadius: 4,
            marginBottom: 8,
          }}>
          <AppRadio
            label="List as Single Item"
            value={listAsSingle}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('single')}
          />

          <Animated.View style={[singleActiveStyle]}>
            <AppInput
              customStyle={{ marginBottom: 16 }}
              label="Price"
              value={price}
              onChangeText={text => setPrice(text)}
            />
          </Animated.View>

          <Divider style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]} />

          <AppRadio
            label="List as Multiple Items"
            value={listAsMultiple}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('multiple')}
          />
          <AppText textStyle="caption" color={Colors.contentPlaceholder}>
            You can add more products and categories.
          </AppText>

          {/* IF statement here where we show the added items */}

          {items.length > 0 ? (
            <View>
              <ItemCategory items={items} />
            </View>
          ) : (
            <></>
          )}

          <Animated.View style={[multipleActiveStyle]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddItemScreen')
              }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 24,
              }}>
              <PostAdd width={normalize(24)} height={normalize(24)} />
              <AppText customStyle={{ paddingLeft: 8 }} textStyle="body2">
                Add an Item
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* MULTIPLE SERVICE */}
      {activeForm.multipleService && (
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            paddingVertical: 32,
            borderRadius: 4,
            marginBottom: 8,
          }}>
          <AppRadio
            label="List as Single Service"
            value={listAsSingle}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('single')}
          />

          <Animated.View style={[singleActiveStyle]}>
            <AppInput
              customStyle={{ marginBottom: 16 }}
              label="Price"
              value={price}
              onChangeText={text => setPrice(text)}
            />
          </Animated.View>

          <Divider style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]} />

          <AppRadio
            label="List as Multiple Services"
            value={listAsMultiple}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('multiple')}
          />
          <AppText textStyle="caption" color={Colors.contentPlaceholder}>
            You can add more products and categories.
          </AppText>

          {/* IF statement here where we show the added items */}

          {items.length > 0 ? (
            <View>
              <ItemCategory items={items} />
            </View>
          ) : (
            <></>
          )}

          <Animated.View style={[multipleActiveStyle]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddItemScreen')
              }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 24,
              }}>
              <PostAdd width={normalize(24)} height={normalize(24)} />
              <AppText customStyle={{ paddingLeft: 8 }} textStyle="body2">
                Add a Service
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      {/* MULTIPLE SERVICE */}

      {activeForm.budgetRange && (
        <Section>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="body3">What is your budget?</AppText>
          </View>
          <AppText textStyle="body2" color={Colors.contentPlaceholder}>
            Attract Buzzybees by adding a price range.
          </AppText>

          <>
            <PriceInput
              style={{ marginTop: 16 }}
              value={budgetMinimum}
              keyboardType="number-pad"
              onChangeText={text => setBudgetMinimum(text)}
              placeholder="00"
              label="Minimum"
            />

            <PriceInput
              style={{ marginTop: 16 }}
              value={budgetMaximum}
              keyboardType="number-pad"
              onChangeText={text => setBudgetMaximum(text)}
              placeholder="00"
              label="Maximum"
            />
          </>
        </Section>
      )}

      {activeForm.payment && (
        <Section>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => showPaymentMethodModal(true)}>
            <AppText textStyle="body3">Payment Methods*</AppText>
            <FormArrowRight />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <SelectedPaymentMethods />
          </View>
        </Section>
      )}

      <Modal
        isVisible={paymentMethodModal}
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
        <PaymentMethodModal
          parentPaymentMethod={paymentMethods}
          setParentPaymentMethods={setPaymentMethods}
          close={() => showPaymentMethodModal(false)}
        />
      </Modal>

      {activeForm.shipping && (
        <Section>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              showShippingMethodModal(true)
              // navigation.navigate('ShippingMethodScreen')
            }}>
            <AppText textStyle="body3">Shipping Methods*</AppText>
            <FormArrowRight />
          </TouchableOpacity>

          {pickupState ? (
            Object.keys(pickupState).length === 0 ? (
              <></>
            ) : (
              <AppText textStyle="body3" customStyle={{ marginTop: 4 }}>
                Pick Up
              </AppText>
            )
          ) : (
            <></>
          )}
          {pickupState ? (
            pickupState?.location?.name ? (
              <>
                <AppText textStyle="body3">
                  {pickupState?.location?.name}{' '}
                  {pickupState?.location?.default ? '(Default)' : ''}{' '}
                </AppText>
                <AppText textStyle="body2">
                  {pickupState?.location?.full_address}
                </AppText>
              </>
            ) : (
              <AppText textStyle="body2">{pickupAddress.full_address}</AppText>
            )
          ) : (
            <></>
          )}
          {deliveryState ? (
            Object.keys(deliveryState).length === 0 ? (
              <></>
            ) : (
              <AppText textStyle="body3" customStyle={{ marginTop: 4 }}>
                Delivery
              </AppText>
            )
          ) : (
            <></>
          )}
          {deliveryState?.nationwide ? (
            <AppText textStyle="body2">
              {deliveryState?.nationwide?.notes}
            </AppText>
          ) : (
            <></>
          )}
          {deliveryState?.radius?.notes ? (
            <AppText textStyle="body2">
              {deliveryState?.radius?.notes} {deliveryState?.radius?.distance}
            </AppText>
          ) : (
            <></>
          )}
        </Section>
      )}
      <Modal
        isVisible={shippingMethodModal}
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
        <ShippingMethodModal
          close={() => showShippingMethodModal(false)}
          setPickupState={setPickupState}
          pickupState={pickupState}
          deliveryState={deliveryState}
          setDeliveryState={setDeliveryState}
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
        />
      </Modal>

      {activeForm.booking && (
        <Section>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              showBookingMethodModal(true)
            }}>
            <AppText textStyle="body3">Booking Methods*</AppText>
            <FormArrowRight />
          </TouchableOpacity>
          {pickupState ? (
            <AppText textStyle="body2">By Appointment</AppText>
          ) : (
            <></>
          )}
          {deliveryState ? (
            Object.keys(deliveryState).length === 0 ? (
              <></>
            ) : (
              <AppText textStyle="body2" customStyle={{ marginTop: 4 }}>
                Walk-In
              </AppText>
            )
          ) : (
            <></>
          )}
        </Section>
      )}
      <Modal
        isVisible={bookingMethodModal}
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
        <BookingMethodModal
          close={() => showBookingMethodModal(false)}
          setPickupState={setPickupState}
          pickupState={pickupState}
          deliveryState={deliveryState}
          setDeliveryState={setDeliveryState}
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
        />
      </Modal>

      {/* POST EXPIRY SECTION */}
      {activeForm.expiry && (
        <Section>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              onPress={() => {
                showPostExpiryModal(true)
              }}>
              <AppText textStyle="body3">Cut-off Time</AppText>

              <FormArrowRight />
            </TouchableOpacity>
            {true && (
              <AppText>
                {moment(postExpiry).format('MMMM D, YYYY @h:mm:ss a')}
              </AppText>
            )}
          </View>
        </Section>
      )}

      <Modal
        isVisible={postExpiryModal}
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
        <PostExpiryModal
          close={() => showPostExpiryModal(false)}
          postExpiry={postExpiry}
          setPostExpiry={text => setPostExpiry(text)}
        />
      </Modal>

      {activeForm.additionalNotes && (
        <Section>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => showAdditionalNotes(true)}>
            <AppText textStyle="body3">Additional Notes*</AppText>
            <FormArrowRight />
          </TouchableOpacity>
        </Section>
      )}

      <Modal
        isVisible={additionalNotes}
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
        <AdditionalNotesModal close={() => showAdditionalNotes(false)} />
      </Modal>

      {/* POST EXPIRY SECTION */}

      {/* <Section>
        <AppText textStyle="subtitle2" customStyle={{marginBottom: 16}}>
          Delivery/Pick up Method
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <AppText textStyle="body2">Pickup</AppText>
          <Switch value={pickupState} onValueChange={togglePickupState} />
        </View>
        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => toggleMap()}>
            <AppInput
              label="Location Address"
              customStyle={{marginBottom: 16}}
              value={stringAddress}
              //onChangeText={(text) => setStoreLocation(text)}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                right: 12,
              }}>
              <ArrowRight height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText textStyle="body2">Offer Delivery</AppText>
          <Switch value={deliveryState} onValueChange={toggleDeliveryState} />
        </View>
      </Section> */}

      <Section>
        {activeForm.type !== 'need' && (
          <TouchableOpacity
            onPress={() => showMoreOptions(true)}
            activeOpacity={0.7}
            style={{
              marginBottom: 40,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MoreOptions />
            <AppText
              customStyle={{ marginLeft: 8 }}
              textStyle="body2medium"
              color={Colors.contentOcean}>
              More Options
            </AppText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={publish}
          activeOpacity={0.7}
          disabled={buttonEnabled || loadingSubmit}
          style={{
            backgroundColor: buttonEnabled
              ? Colors.neutralsGainsboro
              : Colors.primaryYellow,
            paddingVertical: 12,
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
          }}>
          {loadingSubmit ? (
            <ActivityIndicator />
          ) : (
            <AppText textStyle="button2">
              {initialData.post_id ? 'Update' : 'Publish'}
            </AppText>
          )}
        </TouchableOpacity>
      </Section>

      <Modal
        isVisible={moreOptions}
        animationIn="slideInUp"
        animationInTiming={300}
        animationOut="slideOutDown"
        animationOutTiming={250}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showMoreOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <MoreOptionsModal
          close={() => showMoreOptions(false)}
          setMoreOptions={setMoreOptions}
          type={activeForm.type}
        />
      </Modal>

      <TransitionIndicator loading={loadingSubmit} />

      <Modal
        isVisible={addItemModal}
        animationIn="slideInRight"
        animationInTiming={300}
        animationOut="slideOutLeft"
        animationOutTiming={250}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <AddItemModal
          setData={setData}
          data={data}
          closeModal={() => showAddItemModal(false)}
        />
      </Modal>

      <Modal
        isVisible={privacyModal}
        animationIn="slideInUp"
        animationInTiming={300}
        animationOut="slideOutDown"
        animationOutTiming={250}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => showPrivacyModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <PrivacyModal closeModal={() => showPrivacyModal(false)} />
      </Modal>
    </>
  )
}

const Section = ({ children, style }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 24,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        paddingVertical: 32,
        borderRadius: 4,
        marginBottom: 8,
        ...style,
      }}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  allowContactWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  noNumber: {
    borderRadius: normalize(8),
    backgroundColor: Colors.secondarySolitude,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(4),
  },
  noNumberTitle: {
    color: Colors.primaryMidnightBlue,
    lineHeight: normalize(18),
  },
  noNumberMessage: {
    color: '#2e3034',
    lineHeight: normalize(18),
  },
  noNumberAction: {
    color: Colors.contentOcean,
    paddingVertical: normalize(6),
  },
})

export default SellPostForm
