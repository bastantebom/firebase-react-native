import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import ToggleSwitch from '@/components/toggle'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useContext, useState } from 'react'
import TextInput from '@/components/textinput'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  UIManager,
  LayoutAnimation,
  StatusBar,
  Platform,
} from 'react-native'
import Checkbox from '@/components/checkbox'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} ShippingMethodsScreenProps
 * @property {any} data
 * @property {function} onSubmit
 */

/**
 * @typedef {object} RootProps
 * @property {ShippingMethodsScreenProps} ShippingMethodsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ShippingMethodsScreen'>} param0 */
const ShippingMethodsScreen = ({ navigation, route }) => {
  const { data, onSubmit } = route.params
  const { userInfo } = useContext(UserContext)

  const [shippingMethods, setShippingMethods] = useState({
    pickup: {
      enabled: !!data.pickup,
      location:
        data.pickup?.location ||
        userInfo?.addresses?.find(address => address.default) ||
        null,
      notes: data.pickup?.notes || '',
    },
    delivery: {
      enabled: !!data.delivery,
      courier: !!data.delivery?.courier,
      ownDelivery: !!data.delivery?.ownDelivery,
      courierNotes: data.delivery?.courierNotes || '',
      ownDeliveryNotes: data.delivery?.ownDeliveryNotes || '',
    },
  })

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

  const handleMethodPress = method => {
    configureAnimation()
    setShippingMethods(methods => ({
      ...methods,
      [method]: { ...methods[method], enabled: !methods[method].enabled },
    }))
  }

  const handleSubmit = () => {
    const data = {}

    if (shippingMethods.pickup.enabled) data.pickup = shippingMethods.pickup
    if (shippingMethods.delivery.enabled)
      data.delivery = shippingMethods.delivery
    delete shippingMethods.pickup.enabled
    delete shippingMethods.delivery.enabled

    onSubmit(data)
  }

  const renderDeliveryMethods = () => {
    const address =
      shippingMethods.pickup.location ||
      userInfo?.addresses?.find(address => address.default) ||
      {}

    const setPickupNotes = notes => {
      setShippingMethods(methods => ({
        ...methods,
        pickup: {
          ...methods.pickup,
          notes,
        },
      }))
    }

    const setDeliveryNotes = (method, notes) => {
      setShippingMethods(methods => ({
        ...methods,
        delivery: {
          ...methods.delivery,
          [method + 'Notes']: notes,
        },
      }))
    }

    const toggleDeliveryMethod = method => {
      configureAnimation()
      setShippingMethods(methods => ({
        ...methods,
        delivery: {
          ...methods.delivery,
          [method]: !methods.delivery[method],
        },
      }))
    }

    const handleLocationPress = () => {
      navigation.navigate('post-location', {
        addresses: userInfo.addresses || [],
        onPress: location => {
          setShippingMethods(methods => ({
            ...methods,
            pickup: {
              ...methods.pickup,
              location,
            },
          }))
        },
      })
    }

    return (
      <View style={styles.deliveryMethods}>
        <View style={styles.shippingMethod}>
          <ToggleSwitch
            onPress={() => handleMethodPress('pickup')}
            value={shippingMethods.pickup.enabled}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Pickup
              </Text>
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.contentPlaceholder,
                    marginTop: normalize(4),
                  },
                ]}>
                Orders can be picked up at your specified address.
              </Text>
            </View>
          </ToggleSwitch>
          {shippingMethods.pickup.enabled && (
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.location}
                onPress={handleLocationPress}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.body1narrow, typography.medium]}>
                    {address.name || 'Home'} {!!address.default && '(Default)'}
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      {
                        color: Colors.contentPlaceholder,
                        marginTop: normalize(8),
                      },
                    ]}
                    numberOfLines={1}>
                    {address.full_address}
                  </Text>
                </View>
                <Icons.ChevronRight style={{ color: Colors.icon }} />
              </TouchableOpacity>
              <TextInput
                value={shippingMethods.pickup.notes}
                onChangeText={setPickupNotes}
                placeholder="Are there additional notes for the customer? e.g. place order at least 30 minutes before pick-up schedule (Optional)"
                placeholderTextColor="#A8AAB7"
                multiline={true}
                numberOfLines={5}
                containerStyle={{ height: 'auto' }}
                inputStyle={styles.textArea}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
        <View style={[styles.shippingMethod, { borderBottomWidth: 0 }]}>
          <ToggleSwitch
            onPress={() => handleMethodPress('delivery')}
            value={shippingMethods.delivery.enabled}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Delivery
              </Text>
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.contentPlaceholder,
                    marginTop: normalize(4),
                  },
                ]}>
                Orders can be shipped nationwide or within your specified area.
              </Text>
            </View>
          </ToggleSwitch>
          {shippingMethods.delivery.enabled && (
            <View style={{ marginTop: normalize(16) }}>
              <Checkbox
                containerStyle={{ marginBottom: normalize(16) }}
                checked={shippingMethods.delivery.courier}
                onPress={() => toggleDeliveryMethod('courier')}>
                <Text
                  style={[typography.caption, { marginLeft: normalize(10) }]}>
                  Ship your products via local courier or third party couriers
                  (e.g. Lalamove, LBC, Grab Delivery)
                </Text>
              </Checkbox>
              {shippingMethods.delivery.courier && (
                <View style={{ marginBottom: normalize(16) }}>
                  <TextInput
                    value={shippingMethods.delivery.courierNotes}
                    onChangeText={notes => setDeliveryNotes('courier', notes)}
                    placeholder="Are there additional delivery fees and options? (Optional)"
                    placeholderTextColor="#A8AAB7"
                    multiline={true}
                    numberOfLines={5}
                    containerStyle={{ height: 'auto' }}
                    inputStyle={styles.textArea}
                    textAlignVertical="top"
                  />
                </View>
              )}

              <Checkbox
                checked={shippingMethods.delivery.ownDelivery}
                onPress={() => toggleDeliveryMethod('ownDelivery')}>
                <Text
                  style={[typography.caption, { marginLeft: normalize(10) }]}>
                  Deliver your products in person via your own vehicle or your
                  delivery employees
                </Text>
              </Checkbox>
              {shippingMethods.delivery.ownDelivery && (
                <View style={{ marginTop: normalize(16) }}>
                  <TextInput
                    value={shippingMethods.delivery.ownDeliveryNotes}
                    onChangeText={notes =>
                      setDeliveryNotes('ownDelivery', notes)
                    }
                    placeholder="Which areas will you offer delivery? e.g. Marikina City, Quezon City. Also add if there are additional delivery fees. (Optional)"
                    placeholderTextColor="#A8AAB7"
                    multiline={true}
                    numberOfLines={5}
                    containerStyle={{ height: 'auto' }}
                    inputStyle={styles.textArea}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Shipping Methods</Text>
          </View>
        </View>
        <KeyboardAwareScrollView>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.contentTitle]}>
              Set the shipping options you offer
            </Text>

            {renderDeliveryMethods()}
          </View>
          <View style={styles.buttonWrapper}>
            <Button label="Save" type="primary" onPress={handleSubmit} />
          </View>
        </KeyboardAwareScrollView>
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
    padding: normalize(24),
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
    marginTop: normalize(16),
  },
  buttonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  shippingMethods: {},
  shippingMethod: {
    paddingVertical: normalize(16),
    borderBottomColor: Colors.Gainsboro,
    borderBottomWidth: normalize(1),
  },
  location: {
    padding: normalize(12),
    borderRadius: normalize(8),
    borderWidth: normalize(1),
    borderColor: Colors.Gainsboro,
    marginVertical: normalize(16),
    flexDirection: 'row',
  },
  textArea: {
    height: normalize(20 * 6),
    paddingTop: normalize(4),
    fontSize: normalize(14),
  },
})

export default ShippingMethodsScreen
