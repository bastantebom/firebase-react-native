import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
} from 'react-native'

import Slider from '@react-native-community/slider'
import Modal from 'react-native-modal'

import LocationModal from './LocationModal'
import {
  AppText,
  AppCheckbox,
  Switch,
  ScreenHeaderTitle,
  PaddingView,
} from '@/components'

import { ArrowRight } from '@/assets/images/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Colors, normalize } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import { RangeSlider } from '@/components/Slider/RangeSlider'

const ShippingMethodModal = ({
  close,
  deliveryState,
  setDeliveryState,
  pickupState,
  setPickupState,
  setPickupAddress,
  pickupAddress,
}) => {
  const navigation = useNavigation()
  const [pickUp, setPickUp] = useState(
    pickupState ? (Object.keys(pickupState).length === 0 ? false : true) : false
  )

  const [delivery, setDelivery] = useState(
    deliveryState
      ? Object.keys(deliveryState).length === 0
        ? false
        : true
      : false
  )
  const [nationwide, setNationwide] = useState(
    deliveryState?.delivery?.nationwide ? true : false
  )
  const [within, setWithin] = useState(
    deliveryState?.delivery?.radius ? true : false
  )
  const [nationwideNotes, setNationwideNotes] = useState(
    deliveryState?.delivery?.nationwide?.notes || ''
  )
  const [withinNotes, setWithinNotes] = useState(
    deliveryState?.delivery?.radius?.notes || ''
  )

  const [showNationwideNotes, setShowNationwideNotes] = useState(false)
  const [showWithinNotes, setShowWithinNotes] = useState(false)

  const [rangeValue, setRangeValue] = useState(
    deliveryState?.radius?.distance || 0
  )

  const CheckboxStateHandler = val => {
    if (val === 'nationwide') {
      setNationwide(!nationwide)
      setRangeValue(0)
      setDeliveryState({
        delivery: {
          ...deliveryState.delivery,
          nationwide: {},
        },
      })
    }
    if (val === 'within') {
      setWithin(!within)
      setDeliveryState({
        delivery: {
          ...deliveryState.delivery,
          radius: {},
        },
      })
    }
  }

  const [locationModal, showLocationModal] = useState(false)

  const openLocationHandler = () => {
    showLocationModal(true)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 8 }}>
      <ScreenHeaderTitle
        close={close}
        title="Shipping Methods"
        paddingSize={3}
      />
      <KeyboardAwareScrollView>
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <AppText textStyle="body1" color={Colors.primaryMidnightBlue}>
            How do you deliver your products?
          </AppText>
          <AppText textStyle="caption" customStyle={{ marginTop: 4 }}>
            Select the shipping options that you want to offer.
          </AppText>
          <View style={styles.withBorder}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText textStyle="body3">Pick up</AppText>
              <Switch
                value={pickUp}
                onValueChange={() => {
                  if (pickUp) {
                    setPickupState({})
                    setPickUp(false)
                  } else {
                    setPickupState({
                      location: pickupAddress,
                    })
                    setPickUp(true)
                  }
                }}
              />
            </View>
            <AppText textStyle="body2" color={Colors.contentPlaceholder}>
              Orders can be picked up at your specified address.
            </AppText>
            {pickUp && (
              <TouchableOpacity
                onPress={openLocationHandler}
                style={styles.btn}>
                <View style={{ flex: 0.75 }}>
                  {pickupAddress.name && (
                    <View style={{ flexDirection: 'row' }}>
                      <AppText textStyle="body2">{pickupAddress.name}</AppText>
                      {pickupAddress.default && (
                        <AppText
                          textStyle="body3"
                          customStyle={{ marginLeft: normalize(5) }}>
                          (Default)
                        </AppText>
                      )}
                    </View>
                  )}
                  <Text
                    style={{
                      fontFamily: 'RoundedMplus1c-Regular',
                      fontSize: 15,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {pickupAddress.full_address
                      ? pickupAddress.full_address
                      : pickupAddress}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.25,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <ArrowRight />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ paddingVertical: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText textStyle="body3">Delivery</AppText>
              <Switch
                value={delivery}
                onValueChange={() => {
                  if (delivery) {
                    setDeliveryState({})
                    setDelivery(false)
                  } else {
                    setDeliveryState({
                      delivery: {
                        nationwide: {
                          notes: '',
                        },
                        radius: {
                          notes: '',
                          distance: 0,
                        },
                      },
                    })
                    setDelivery(true)
                  }
                }}
              />
            </View>
            <AppText
              textStyle="body2"
              customStyle={{ marginTop: 4 }}
              color={Colors.contentPlaceholder}>
              Orders can be shipped nationwide or within your specified area.
            </AppText>
            {delivery && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: normalize(20),
                  }}>
                  <AppCheckbox
                    style={{ paddingLeft: 0 }}
                    value={nationwide}
                    valueChangeHandler={() => {
                      CheckboxStateHandler('nationwide')
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText textStyle="caption">
                      Ship via local or third party couriers
                    </AppText>
                  </View>
                </View>
                <View style={styles.shippingNotes}>
                  <AppText
                    textStyle="caption"
                    customStyle={{ marginBottom: 8 }}>
                    You or your customer may book third party couriers such as
                    Lalamove, LBC, Grab Delivery, or HappyMove to pick-up the
                    confirmed order and deliver it to your customer. This way,
                    both of you will be able to track the order in real-time.
                  </AppText>
                  {showNationwideNotes && (
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      Please note that we’re currently working on adding the
                      delivery fee/s in the order. For the meantime, delivery
                      fees will be arranged with the seller using chat or
                      outside the Servbees app.
                    </AppText>
                  )}
                  <TouchableOpacity
                    style={{ paddingBottom: 4 }}
                    onPress={() =>
                      setShowNationwideNotes(!showNationwideNotes)
                    }>
                    <AppText
                      textStyle="body2medium"
                      color={Colors.contentOcean}>
                      {showNationwideNotes ? 'Show Less' : 'Read More'}
                    </AppText>
                  </TouchableOpacity>
                </View>
                {nationwide && (
                  <TextInput
                    value={nationwideNotes}
                    multiline={true}
                    placeholder="Are there additional delivery fees and options? (Optional)"
                    placeholderTextColor={Colors.contentPlaceholder}
                    numberOfLines={Platform.OS === 'ios' ? null : 6}
                    minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                    style={{
                      color: Colors.contentEbony,
                      fontFamily: 'RoundedMplus1c-Regular',
                      fontSize: normalize(14),
                      letterSpacing: 0.5,
                      borderColor: Colors.neutralGray,
                      borderWidth: 1,
                      borderRadius: 4,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      marginBottom: 16,
                      textAlign: 'left',
                    }}
                    onChangeText={text => {
                      setNationwideNotes(text)
                      setDeliveryState({
                        delivery: {
                          ...deliveryState.delivery,
                          nationwide: {
                            notes: text,
                          },
                        },
                      })
                    }}
                    underlineColorAndroid={'transparent'}
                    textAlignVertical="top"
                    scrollEnabled={false}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 24,
                  }}>
                  <AppCheckbox
                    style={{ paddingLeft: 0 }}
                    value={within}
                    valueChangeHandler={() => CheckboxStateHandler('within')}
                  />
                  <AppText textStyle="caption">Deliver your products</AppText>
                </View>
                <View style={styles.shippingNotes}>
                  <AppText
                    textStyle="caption"
                    customStyle={{ marginBottom: 8 }}>
                    You may deliver your products if you have your own vehicle
                    or delivery service
                  </AppText>
                  {showWithinNotes && (
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      Currently working on adding the delivery fee/s in the
                      orders. For the meantime, delivery fees will be arranged
                      using chat or outside the Servbees app.
                    </AppText>
                  )}
                  <TouchableOpacity
                    style={{ paddingBottom: 4 }}
                    onPress={() => setShowWithinNotes(!showWithinNotes)}>
                    <AppText
                      textStyle="body2medium"
                      color={Colors.contentOcean}>
                      {showWithinNotes ? 'Show Less' : 'Read More'}
                    </AppText>
                  </TouchableOpacity>
                </View>
                {within && (
                  <>
                    <TextInput
                      value={withinNotes}
                      multiline={true}
                      placeholder="Which areas will you offer delivery? e.g. Marikina City, Quezon City. Also add if there are additional delivery fees. (Optional)"
                      placeholderTextColor={Colors.contentPlaceholder}
                      numberOfLines={Platform.OS === 'ios' ? null : 6}
                      minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                      style={{
                        color: Colors.contentEbony,
                        fontFamily: 'RoundedMplus1c-Regular',
                        fontSize: normalize(14),
                        letterSpacing: 0.5,
                        borderColor: Colors.neutralGray,
                        borderWidth: 1,
                        borderRadius: 4,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        marginBottom: 16,
                        textAlign: 'left',
                      }}
                      onChangeText={text => {
                        setWithinNotes(text)
                        setDeliveryState({
                          delivery: {
                            ...deliveryState.delivery,
                            radius: {
                              ...deliveryState.radius,
                              notes: text,
                            },
                          },
                        })
                      }}
                      underlineColorAndroid={'transparent'}
                      textAlignVertical="top"
                      scrollEnabled={false}
                    />
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          close()
        }}
        style={{
          backgroundColor: Colors.primaryYellow,
          paddingVertical: 8,
          marginHorizontal: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          borderRadius: 4,
        }}>
        <AppText textStyle="body3">Save</AppText>
      </TouchableOpacity>

      <Modal
        isVisible={locationModal}
        animationIn="slideInRight"
        animationInTiming={500}
        animationOut="slideOutLeft"
        animationOutTiming={500}
        style={{
          margin: 0,
          backgroundColor: '#E5E5E5',
          height: Dimensions.get('window').height,
          justifyContent: 'flex-start',
        }}>
        <LocationModal
          close={() => showLocationModal(false)}
          closeAll={close}
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
          setPickupState={setPickupState}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 20,
  },
  btn: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    marginTop: normalize(20),
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  shippingNotes: {
    backgroundColor: Colors.secondarySolitude,
    padding: 16.5,
    marginTop: 8,
    marginBottom: 25,
  },
})

export default ShippingMethodModal
