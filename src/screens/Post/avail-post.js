import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  UIManager,
  Text,
  Alert,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import { Images } from '@/assets/images'
import typography from '@/globals/typography'
import { getCurrentPosition, iconSize } from '@/globals/Utils'
import Avatar from '@/components/Avatar/avatar'
import utilStyles from '@/globals/util-styles'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'
import Modal from 'react-native-modal'
import PostCard from './components/post-card'
import { Context } from '@/context'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import Loader from '@/components/loader'
import { CommonActions } from '@react-navigation/native'
import ChangeShippingMethodModal from './modals/change-shipping-method'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} AvailPostScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {AvailPostScreenProps} AvailPostScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AvailPostScreen'>} param0 */
const AvailPostScreen = ({ navigation, route }) => {
  const { post, callbacks, onBackPress } = route.params

  const isMounted = useRef(true)
  const [currentLocation, setCurrentLocation] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { basket, setBasket } = useContext(Context)
  const { user, userInfo } = useContext(UserContext)
  const [shippingMethodModalVisible, setShippingMethodModalVisible] = useState(
    false
  )
  const [initialRegion, setInitialRegion] = useState(null)

  const title = (() => {
    switch (post.type) {
      case 'sell':
        return 'Order Summary'
      case 'service':
        return 'Booking Summary'
      case 'need':
        return 'Offer Summary'
    }
  })()

  const mapViewRef = useRef()

  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      let body
      if (post.type === 'need') {
        const {
          message,
          attachedPost,
          offer,
          paymentMethod: payment_method,
        } = basket

        body = {
          message,
          offer,
          post_id: post.id,
          attached_post: attachedPost?.id,
          payment_method,
        }
      } else if (post.type === 'sell') {
        const {
          items,
          shippingMethod,
          shippingAddress,
          schedule,
          paymentMethod,
          notes,
        } = basket

        body = {
          post_id: post.id,
          items,
          shipping_method: shippingMethod,
          shipping_address:
            shippingAddress ||
            userInfo.addresses.find(address => address.default),
          payment_method: paymentMethod,
          notes,
        }
        if (schedule) body.schedule = schedule.toString()
      } else if (post.type === 'service') {
        const { items, bookingMethod, schedule, paymentMethod, notes } = basket
        body = {
          post_id: post.id,
          items,
          booking_method: bookingMethod,
          payment_method: paymentMethod,
          notes,
        }
        if (schedule) body.schedule = schedule.toString()
      }

      const response = await Api.createOrder({
        uid: user.uid,
        body,
      })

      if (!response.success) throw new Error(response.message)
      const { order_id: orderID } = response

      navigation.removeListener('beforeRemove', backPressHandler)
      setBasket({})

      const state = navigation.dangerouslyGetState()
      const publishedPostIndex = state.routes.findIndex(
        route => route.name === 'published-post'
      )

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [...state.routes.slice(0, publishedPostIndex + 1)],
        })
      )
      navigation.navigate({
        name: 'orders',
        params: {
          screen: 'order-tracker',
          params: { orderID },
        },
      })
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsLoading(false)
  }

  const handleOnAddNotesPress = () => {
    navigation.navigate('additional-notes', {
      notes: basket.notes,
      description: 'Any instructions or notes you would like to add?',
      onSubmit: notes => {
        setBasket(basket => ({ ...basket, notes }))
      },
    })
  }

  const handleOnPaymentMethodPress = method => {
    if (basket.paymentMethod === method.value) return
    configureAnimation()
    setBasket(basket => ({
      ...basket,
      paymentMethod: method.value,
    }))
  }

  const handleOnChangeDeliveryAdderssPress = () => {
    navigation.navigate('post-location', {
      addresses: userInfo.addresses || [],
      onPress: location => {
        setBasket(basket => ({
          ...basket,
          shippingAddress: location,
        }))
      },
    })
  }

  const backPressHandler = event => {
    if (onBackPress && navigation.isFocused()) {
      event.preventDefault()
      navigation.removeListener('beforeRemove', backPressHandler)
      onBackPress()
    }
  }

  useEffect(() => {
    if (typeof onBackPress === 'function') {
      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.addListener('beforeRemove', backPressHandler)

      return () => navigation.removeListener('beforeRemove', backPressHandler)
    }
  }, [navigation])

  const canSubmit = () => {
    return !!basket.paymentMethod
  }

  const initLocation = async () => {
    try {
      const result = await getCurrentPosition()
      if (!isMounted.current) return

      setCurrentLocation(result)
    } catch {}
  }

  useEffect(() => {
    initLocation()

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    let location
    if (post.type === 'sell') {
      location =
        basket.shippingMethod === 'pickup'
          ? post.shipping_methods.pickup?.location
          : basket.shippingAddress ||
            userInfo.addresses.find(address => address.default)
    } else if (post.type === 'service') {
      location = post.location
    }
    if (location) {
      setInitialRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0025,
        longitudeDelta: 0.0025,
      })
    }
  }, [basket.shippingMethod, basket.shippingAddress])

  useEffect(() => {
    !!initialRegion &&
      mapViewRef.current?.animateToRegion({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: 0.0025,
        longitudeDelta: 0.0025,
      })
  }, [initialRegion])

  const getTotal = () =>
    (basket.items || []).reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    )

  const renderTopSection = () => {
    return (
      <View style={[styles.section, styles.topSection]}>
        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <Avatar
              style={styles.avatar}
              path={post.user.profile_photo}
              size="64x64"
            />
          </View>
          <View style={styles.userInfo}>
            <View style={[utilStyles.row, utilStyles.alignCenter]}>
              <Text style={[typography.body2, typography.medium]}>
                {post.user.full_name}
              </Text>
              {!!post.user.account_verified && (
                <Icons.Verified style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={[typography.body2, styles.username]}>
              @{post.user.username}
            </Text>
          </View>

          <Icons.ChevronRight
            style={{ color: Colors.icon }}
            {...iconSize(24)}
          />
        </View>

        {post.type === 'need' && (
          <View style={styles.offer}>
            <View style={styles.sectionLabel}>
              <Icons.Cash style={styles.labelIcon} {...iconSize(16)} />
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  utilStyles.flex1,
                ]}>
                Your Offer
              </Text>
              <TouchableOpacity
                onPress={() => callbacks?.onEditPress?.()}
                activeOpacity={0.7}
                style={styles.linkWrapper}>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    typography.link,
                  ]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                typography.body1narrow,
                typography.medium,
                styles.offerAmount,
              ]}>
              ₱
              {formatNumber(basket.offer, {
                separator: '.',
                precision: 2,
                delimiter: ',',
              })}
            </Text>
          </View>
        )}

        {['sell', 'service'].includes(post.type) && (
          <View style={styles.orderSummary}>
            <View style={styles.sectionLabel}>
              <Icons.File style={styles.labelIcon} {...iconSize(16)} />
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  utilStyles.flex1,
                ]}>
                {title}
              </Text>
            </View>
            <View style={styles.summaryItems}>
              {basket.items?.map((item, index) => {
                return (
                  <View key={item.id || index} style={styles.summaryItem}>
                    <Text style={[typography.body1, typography.light]}>
                      {item.quantity || 1}x
                    </Text>
                    <View style={styles.itemDetailsWrapper}>
                      <Text style={[typography.body2, typography.medium]}>
                        {item.name}
                      </Text>
                      {!!item.notes?.length && (
                        <Text style={[typography.body2, styles.itemNotes]}>
                          {item.notes}
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={navigation.goBack}
                        activeOpacity={0.7}
                        style={styles.linkWrapper}>
                        <Text
                          style={[
                            typography.caption,
                            typography.medium,
                            typography.link,
                            { marginTop: normalize(8) },
                          ]}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={typography.body2}>
                      ₱
                      {formatNumber(item.price * (item.quantity || 1), {
                        separator: '.',
                        precision: 2,
                        delimiter: ',',
                      })}
                    </Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.totalWrapper}>
              <Text style={[typography.body1narrow, typography.medium]}>
                Total
              </Text>
              <Text style={[typography.body1narrow, typography.medium]}>
                ₱
                {formatNumber(getTotal(), {
                  separator: '.',
                  precision: 2,
                  delimiter: ',',
                })}
              </Text>
            </View>
          </View>
        )}
      </View>
    )
  }

  const renderMessageSection = () => {
    if (post.type !== 'need') return null

    return (
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          <Icons.Chat style={styles.labelIcon} {...iconSize(16)} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              utilStyles.flex1,
            ]}>
            Message
          </Text>
          <TouchableOpacity
            onPress={() => callbacks?.onEditPress?.()}
            activeOpacity={0.7}
            style={styles.linkWrapper}>
            <Text
              style={[typography.body2, typography.medium, typography.link]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        {!!basket.message?.length && (
          <View>
            <Text style={typography.body2}>{basket.message}</Text>
          </View>
        )}
      </View>
    )
  }

  const renderShippingMethodsSection = () => {
    if (post.type === 'need') return null
    const methodLabels = {
      pickup: 'Pick up',
      delivery: 'Delivery',
      walkin: 'Walk-in',
      appointment: 'By Appointment',
    }

    const label =
      methodLabels[
        post.type === 'service' ? basket.bookingMethod : basket.shippingMethod
      ]

    const icon =
      post.type === 'service' ? (
        basket.bookingMethod === 'walkin' ? (
          <Icons.Store style={styles.labelIcon} {...iconSize(16)} />
        ) : (
          <Icons.Appointment style={styles.labelIcon} {...iconSize(16)} />
        )
      ) : basket.shippingMethod === 'pickup' ? (
        <Icons.Pickup style={styles.labelIcon} {...iconSize(16)} />
      ) : (
        <Icons.Truck style={styles.labelIcon} {...iconSize(16)} />
      )

    const location =
      post.type === 'service'
        ? post.location
        : basket.shippingMethod === 'pickup'
        ? post.shipping_methods.pickup?.location
        : basket.shippingAddress ||
          userInfo.addresses.find(address => address.default)

    const notes = []
    if (
      basket.shippingMethod === 'delivery' &&
      post.shipping_methods?.delivery?.courier?.notes?.length
    )
      notes.push({
        label: 'Ship via local or third party couriers',
        note: post.shipping_methods.delivery.courier.notes,
      })

    if (
      basket.shippingMethod === 'delivery' &&
      post.shipping_methods?.delivery?.own_delivery?.notes?.length
    )
      notes.push({
        label: 'Deliver by seller',
        note: post.shipping_methods.delivery.own_delivery.notes,
      })

    if (
      basket.shippingMethod === 'pickup' &&
      post.shipping_methods?.pickup?.notes?.length
    )
      notes.push({
        note: post.shipping_methods.pickup.notes,
      })

    if (
      basket.bookingMethod === 'walkin' &&
      post.booking_methods?.walkin?.notes?.length
    ) {
      notes.push({
        note: post.booking_methods.walkin.notes,
      })
    }

    if (
      basket.bookingMethod === 'appointment' &&
      post.booking_methods?.appointment?.notes?.length
    ) {
      notes.push({
        note: post.booking_methods.appointment.notes,
      })
    }

    let notesLabel
    if (basket.shippingMethod === 'delivery')
      notesLabel = "Seller's Delivery Notes"
    else if (basket.shippingMethod === 'pickup')
      notesLabel = "Seller's Pick-up Notes"
    else if (basket.bookingMethod === 'walkin')
      notesLabel = "Seller's Walk-in Notes"
    else if (basket.bookingMethod === 'appointment')
      notesLabel = "Seller's Appointment Notes"

    return (
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          {icon}
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              utilStyles.flex1,
            ]}>
            {label}
          </Text>
          {Object.keys(post.shipping_methods).length > 1 && (
            <TouchableOpacity
              onPress={() => setShippingMethodModalVisible(true)}
              activeOpacity={0.7}
              style={styles.linkWrapper}>
              <Text
                style={[typography.body2, typography.medium, typography.link]}>
                Change
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            utilStyles.row,
            utilStyles.justifySpaceBetween,
            { alignItems: 'flex-start' },
          ]}>
          <View
            style={[styles.location, { flex: 1, paddingRight: normalize(8) }]}>
            <Text style={[typography.body2, typography.medium]}>
              {basket.shippingMethod === 'pickup' ? 'Seller' : 'Buyer'}
              {"'s Address"}
            </Text>
            <Text
              style={[
                typography.caption,
                { marginTop: normalize(4), color: Colors.contentPlaceholder },
              ]}>
              {location.full_address}
            </Text>
          </View>
          {basket.shippingMethod === 'delivery' && (
            <TouchableOpacity
              onPress={handleOnChangeDeliveryAdderssPress}
              activeOpacity={0.7}
              style={[styles.linkWrapper, { paddingTop: normalize(14) }]}>
              <Text
                style={[typography.body2, typography.medium, typography.link]}>
                Change
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!!initialRegion && (
          <View style={styles.mapViewWrapper}>
            <MapView
              ref={mapViewRef}
              style={styles.mapView}
              provider={PROVIDER_GOOGLE}
              initialRegion={initialRegion}
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
              scrollEnabled={false}>
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}>
                <Images.PinBee {...iconSize(56)} />
              </Marker>
            </MapView>
          </View>
        )}

        {!!notes.length && (
          <View style={styles.deliveryNotes}>
            <Text style={[typography.body1, typography.medium]}>
              {notesLabel}
            </Text>

            {notes.map((note, index) => (
              <View key={note.label || index} style={styles.deliveryNote}>
                <Icons.Page
                  style={{
                    color: Colors.link,
                    marginRight: normalize(10),
                    marginTop: normalize(2),
                  }}
                  {...iconSize(16)}
                />

                <View>
                  {!!note.label?.length && (
                    <Text style={[typography.body2, typography.medium]}>
                      {note.label}
                    </Text>
                  )}
                  <Text
                    style={[
                      typography.body2,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    {note.note}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {basket.shippingMethod === 'delivery' && (
          <>
            <View style={styles.notesInfo}>
              <Text style={typography.caption}>
                For this transaction, kindly agree with the seller how delivery
                will be made (i.e. Grab, Lalamove, etc.). At the moment,
                Servbees does not cover this feature. Rest assured, this will be
                made available to you soon.
              </Text>
            </View>
          </>
        )}
      </View>
    )
  }

  const renderPaymentMethodsSection = () => {
    const total = post.type === 'need' ? basket.offer : getTotal()

    const methods = [
      {
        renderActiveIcon: () => <Icons.CashPaymentActive />,
        renderInactiveIcon: () => <Icons.CashPayment />,
        label: 'Cash on Delivery / Pick up',
        value: 'cash',
        renderContent: () => null,
      },
      {
        renderActiveIcon: () => <Icons.PayPalPaymentActive />,
        renderInactiveIcon: () => <Icons.PayPalPayment />,
        renderDisabledIcon: () => <Icons.PayPalPaymentDisabled />,
        label: 'PayPal',
        value: 'paypal',
        content: 'Choose this to pay with your PayPal balance.',
        info: 'For orders ₱100 up',
        disabled: total < 100,
      },
      {
        renderActiveIcon: () => <Icons.GCashPaymentActive />,
        renderInactiveIcon: () => <Icons.GCashPayment />,
        renderDisabledIcon: () => <Icons.GCashDisabled />,
        label: 'GCash',
        value: 'gcash',
        content: 'Choose this to pay with your available balance.',
        info: 'For orders ₱100 up',
        disabled: total < 100,
      },
      {
        renderActiveIcon: () => <Icons.CardPaymentActive />,
        renderInactiveIcon: () => <Icons.CardPayment />,
        renderDisabledIcon: () => <Icons.CardDisabled />,
        label: 'Visa/Mastercard',
        value: 'card',
        info: 'For orders ₱100 up',
        disabled: total < 100,
      },
      {
        renderActiveIcon: () => <Icons.GrabPayPaymentActive />,
        renderInactiveIcon: () => <Icons.GrabPayPayment />,
        renderDisabledIcon: () => <Icons.GrabPayDisabled />,
        label: 'GrabPay',
        value: 'grabpay',
        content: 'Choose this to pay with your GrabPay credits.',
        info: 'For orders ₱100 up',
        disabled: total < 100,
      },
    ]

    const paymentMethods = post.payment_methods.map(method =>
      methods.find(_method => _method.value === method)
    )

    return (
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          <Icons.Cash style={styles.labelIcon} {...iconSize(16)} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              utilStyles.flex1,
            ]}>
            Select Payment Method
          </Text>
        </View>

        <View style={styles.paymentMethods}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                basket.paymentMethod === method.value
                  ? { borderColor: Colors.contentEbony }
                  : {},
              ]}
              disabled={method.disabled}
              key={method.value}
              activeOpacity={0.7}
              onPress={() => handleOnPaymentMethodPress(method)}>
              <View style={[utilStyles.row, utilStyles.alignCenter]}>
                {method.disabled
                  ? method.renderDisabledIcon()
                  : basket.paymentMethod === method.value
                  ? method.renderActiveIcon()
                  : method.renderInactiveIcon()}
                <Text style={[typography.body2, styles.paymentMethodLabel]}>
                  {method.label}
                </Text>
                {!!method.content?.length && (
                  <Text
                    style={[
                      typography.caption,
                      { color: Colors.neutralsMischka },
                    ]}>
                    {method.info}
                  </Text>
                )}
              </View>
              {basket.paymentMethod === method.value &&
                !!method.content?.length && (
                  <View style={styles.paymentMethodContent}>
                    <Text
                      style={[
                        typography.caption,
                        { color: Colors.contentPlaceholder },
                      ]}>
                      {method.content}
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const renderAdditionalNotesSection = () => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionLabel}>
          <Icons.Page style={styles.labelIcon} {...iconSize(16)} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              utilStyles.flex1,
            ]}>
            Additional Notes
          </Text>
          <TouchableOpacity
            onPress={handleOnAddNotesPress}
            activeOpacity={0.7}
            style={styles.linkWrapper}>
            <Text
              style={[typography.body2, typography.medium, typography.link]}>
              {basket.notes?.length ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
        {!!basket.notes?.length && (
          <Text style={[typography.body2, { marginTop: normalize(4) }]}>
            {basket.notes}
          </Text>
        )}
      </View>
    )
  }

  const renderSubmitButton = () => {
    const label = (() => {
      if (post.type === 'need')
        return (
          <View style={styles.buttonLabelWrapper}>
            <Text style={[typography.body1narrow, typography.medium]}>
              Send Offer
            </Text>
            <Text style={typography.subtitle1}>
              ₱
              {formatNumber(basket.offer, {
                separator: '.',
                precision: 2,
                delimiter: ',',
              })}
            </Text>
          </View>
        )
      else if (['sell', 'service'].includes(post.type)) {
        return (
          <View style={styles.buttonLabelWrapper}>
            <Text style={[typography.body1narrow, typography.medium]}>
              Place Order
            </Text>
            <Text style={typography.subtitle1}>
              ₱
              {formatNumber(getTotal(), {
                separator: '.',
                precision: 2,
                delimiter: ',',
              })}
            </Text>
          </View>
        )
      }
    })()

    return (
      <View style={styles.buttonsWrapper}>
        <Button
          style={utilStyles.row}
          type={!canSubmit() ? 'disabled' : 'primary'}
          disabled={!canSubmit()}
          onPress={handleOnSubmit}>
          {label}
        </Button>
      </View>
    )
  }

  const renderAttachedPost = () => {
    return (
      <>
        <View style={styles.sectionLabel}>
          <Icons.Clip style={styles.labelIcon} {...iconSize(16)} />
          <Text
            style={[
              typography.body1narrow,
              typography.medium,
              utilStyles.flex1,
            ]}>
            Attached Post
          </Text>
          <TouchableOpacity
            onPress={() => callbacks?.onEditPress?.()}
            activeOpacity={0.7}
            style={styles.linkWrapper}>
            <Text
              style={[typography.body2, typography.medium, typography.link]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postCardWrapper}>
          <PostCard
            post={basket.attachedPost}
            currentLocation={currentLocation}
            thumbnailStyle={{ ...iconSize(80) }}
          />
        </View>
      </>
    )
  }

  const renderInfoSection = () => {
    if (post.type === 'need') return null

    const handleOnPrivacyPolicyPress = () => {
      navigation.navigate('webview', {
        uri: 'https://servbees.com/privacy/',
        title: 'Privacy Policy',
      })
    }

    const handleOnTermsPress = () => {
      navigation.navigate('webview', {
        uri: 'https://servbees.com/terms/',
        title: 'Terms of Use',
      })
    }

    return (
      <>
        <View style={styles.info}>
          <Icons.InfoCircle style={styles.infoIcon} {...iconSize(16)} />
          <Text style={styles.infoLabel}>
            Please wait for the seller to confirm your order before proceeding
            with the payment.
          </Text>
        </View>
        <View style={styles.info}>
          <Icons.InfoCircle style={styles.infoIcon} {...iconSize(16)} />
          <Text style={styles.infoLabel}>
            By continuing, you are agreeing to our{' '}
            <Text style={typography.link} onPress={handleOnPrivacyPolicyPress}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text style={typography.link} onPress={handleOnTermsPress}>
              Terms of Use
            </Text>
            .
          </Text>
        </View>

        <View style={[styles.notesInfo, { marginBottom: normalize(24) }]}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Images.PoliceBeebo
              style={{ marginBottom: normalize(4), marginRight: normalize(8) }}
              {...iconSize(40)}
            />
            <Text
              style={[
                typography.body1narrow,
                typography.medium,
                { color: Colors.primaryMidnightBlue },
              ]}>
              Bee Responsible
            </Text>
          </View>
          <Text style={typography.caption}>
            Pranking or cheating a seller, a customer, or delivery personnel is
            an act punishable by law. Let's keep this community a safe hive for
            everyone.
          </Text>
        </View>
      </>
    )
  }

  const renderBottomSection = () => {
    return (
      <View style={[styles.section, styles.bottomSection]}>
        {post.type === 'need' && !!basket.attachedPost && renderAttachedPost()}
        {renderInfoSection()}
        {renderSubmitButton()}
      </View>
    )
  }

  const renderChangeShippingMethodModal = () => {
    if (post.type === 'need') return null

    return (
      <Modal
        isVisible={shippingMethodModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setShippingMethodModalVisible(false)}
        propagateSwipe
        onBackButtonPress={() => setShippingMethodModalVisible(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setShippingMethodModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ChangeShippingMethodModal
          close={() => setShippingMethodModalVisible(false)}
          post={post}
        />
      </Modal>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader visible={isLoading} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#fff',
            flexGrow: 1,
          }}>
          <View style={styles.content}>
            {renderTopSection()}
            {renderMessageSection()}
            {renderShippingMethodsSection()}
            {renderPaymentMethodsSection()}
            {renderAdditionalNotesSection()}
            {renderBottomSection()}
            {renderChangeShippingMethodModal()}
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
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
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
  },
  avatarWrapper: {
    height: normalize(42),
    width: normalize(42),
    marginRight: normalize(8),
    borderRadius: normalize(21),
    overflow: 'hidden',
    marginRight: normalize(8),
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  section: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  topSection: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: normalize(16),
    paddingBottom: normalize(24),
  },
  username: {
    color: Colors.contentPlaceholder,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  verifiedIcon: {
    marginLeft: normalize(6),
  },
  userInfo: {
    flex: 1,
  },
  labelIcon: {
    color: Colors.neutralsMischka,
    marginRight: normalize(8),
  },
  offer: {
    marginTop: normalize(8),
    paddingHorizontal: normalize(8),
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
  },
  offerAmount: {
    marginTop: normalize(8),
  },
  bottomSection: {
    marginBottom: 0,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  buttonLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  paymentMethods: {
    marginTop: normalize(16),
  },
  paymentMethod: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(16),
    borderWidth: normalize(1),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    marginBottom: normalize(16),
  },
  paymentMethodLabel: {
    marginRight: normalize(8),
    marginLeft: normalize(10),
  },
  postCardWrapper: {
    padding: normalize(12),
    borderRadius: normalize(8),
    backgroundColor: '#fff',
    borderWidth: normalize(1),
    borderColor: Colors.neutralsZircon,
    marginBottom: normalize(16),
  },
  summaryItems: {
    marginTop: normalize(16),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.Gainsboro,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: normalize(16),
  },
  itemDetailsWrapper: {
    marginLeft: normalize(12),
    flex: 1,
  },
  itemNotes: {
    marginTop: normalize(4),
  },
  totalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(16),
    paddingBottom: normalize(8),
  },
  notesInfo: {
    backgroundColor: Colors.secondarySolitude,
    padding: normalize(16),
    borderRadius: normalize(8),
  },
  location: {
    paddingBottom: normalize(24),
    paddingTop: normalize(16),
  },
  deliveryNotes: {
    marginBottom: normalize(24),
  },
  deliveryNote: {
    flexDirection: 'row',
    marginTop: normalize(16),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  info: {
    flexDirection: 'row',
    marginBottom: normalize(16),
  },
  infoIcon: {
    color: Colors.icon,
    marginRight: normalize(10),
    transform: [{ rotate: '180deg' }],
  },
  infoLabel: {
    flex: 1,
    ...typography.caption,
  },
  mapViewWrapper: {
    height: normalize(120),
    width: '100%',
    borderRadius: normalize(4),
    overflow: 'hidden',
    marginBottom: normalize(24),
  },
  mapView: {
    height: '100%',
    width: '100%',
  },
  paymentMethodContent: {
    marginTop: normalize(12),
  },
})

export default AvailPostScreen
