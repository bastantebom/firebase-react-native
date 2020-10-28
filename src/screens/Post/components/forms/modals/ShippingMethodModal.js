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

import Modal from 'react-native-modal'

import Slider from '@react-native-community/slider'

import LocationModal from './LocationModal'
import {
  AppText,
  AppCheckbox,
  Switch,
  ScreenHeaderTitle,
  PaddingView,
} from '@/components'

import { ArrowRight } from '@/assets/images/icons'

import { Colors, normalize } from '@/globals'
import { useNavigation } from '@react-navigation/native'

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

  console.log(pickupState)
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
    deliveryState?.nationwide ? true : false
  )
  const [within, setWithin] = useState(deliveryState?.radius ? true : false)
  const [nationwideNotes, setNationwideNotes] = useState(
    deliveryState?.nationwide?.notes || ''
  )
  const [withinNotes, setWithinNotes] = useState(
    deliveryState?.radius?.notes || ''
  )
  // const [activeSwitch, setActiveSwitch] = useState(null);
  const [rangeValue, setRangeValue] = useState(
    deliveryState?.radius?.distance || 0
  )

  useEffect(() => {
    console.log('SHIPPING METHODS')
    console.log(pickupAddress)
  }, [])

  const CheckboxStateHandler = val => {
    if (val === 'nationwide') {
      setNationwide(true)
      setWithinNotes('')
      setRangeValue(0)
      setWithin(false)
      setDeliveryState({
        nationwide: {},
      })
    }
    if (val === 'within') {
      setWithin(true)
      setNationwideNotes('')
      setNationwide(false)
      setDeliveryState({
        radius: {},
      })
    }
  }

  const [locationModal, showLocationModal] = useState(false)

  const openLocationHandler = () => {
    console.log('asdas')
    showLocationModal(true)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScreenHeaderTitle
        close={close}
        title="Shipping Methods"
        paddingSize={2}
      />
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <AppText textStyle="body2">Something, something</AppText>
        <AppText textStyle="captionDashboard">Something, something</AppText>
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
          <AppText
            textStyle="captionDashboard"
            color={Colors.contentPlaceholder}>
            Orders can be picked up at your specified address.
          </AppText>
          {pickUp && (
            <TouchableOpacity onPress={openLocationHandler} style={styles.btn}>
              <View style={{ flex: 0.75 }}>
                {pickupAddress.name && (
                  <View style={{ flexDirection: 'row' }}>
                    {/* // If may address name from profile */}
                    <AppText textStyle="body2">{pickupAddress.name}</AppText>
                    {pickupAddress.default && (
                      <AppText
                        textStyle="body3"
                        customStyle={{ marginLeft: normalize(5) }}>
                        {/* //if true yung default property */}
                        (Default)
                      </AppText>
                    )}
                  </View>
                )}
                <Text
                  style={{ fontFamily: 'RoundedMplus1c-Regular', fontSize: 15 }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {/* Full address from address */}
                  {/* Wayne’s Burger and Smoothies, Hon. B. Soliven */}
                  {pickupAddress ? pickupAddress.full_address : 'No address'}
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
            textStyle="captionDashboard"
            color={Colors.contentPlaceholder}>
            Orders can be shipped nationwide or within your specifid area.
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
                <AppText>Nationwide</AppText>
              </View>
              {nationwide && (
                <TextInput
                  value={nationwideNotes}
                  multiline={true}
                  placeholder="Are there additional delivery fees and options? (Optional)"
                  placeholderTextColor={Colors.neutralGray}
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
                    console.log('DEL STATE')
                    console.log(deliveryState)
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
                }}>
                <AppCheckbox
                  style={{ paddingLeft: 0 }}
                  value={within}
                  valueChangeHandler={() => CheckboxStateHandler('within')}
                />
                <AppText>Within your specified area</AppText>
              </View>
              {within && (
                <>
                  <PaddingView paddingSize={2}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalize(20),
                        marginBottom: normalize(20),
                      }}>
                      <AppText textStyle="promo">Ship Within</AppText>
                      <AppText textStyle="caption" color="#999">
                        {rangeValue} KM
                      </AppText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <AppText textStyle="caption" color="#999">
                        0
                      </AppText>
                      <Slider
                        style={{ width: '90%' }}
                        minimumValue={0}
                        maximumValue={200}
                        step={5}
                        value={rangeValue}
                        onValueChange={rangeValue => {
                          setRangeValue(rangeValue)
                          setDeliveryState({
                            delivery: {
                              ...deliveryState.delivery,
                              radius: {
                                ...deliveryState.radius,
                                distance: rangeValue,
                              },
                            },
                          })
                        }}
                        minimumTrackTintColor={Colors.primaryYellow}
                        maximumTrackTintColor={Colors.neutralGray}
                        thumbTintColor={Colors.primaryYellow}
                      />
                      <AppText textStyle="caption" color="#999">
                        200
                      </AppText>
                    </View>
                  </PaddingView>
                  <TextInput
                    value={withinNotes}
                    multiline={true}
                    placeholder="Are there additional delivery fees and options? (Optional)"
                    placeholderTextColor={Colors.neutralGray}
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
      </ScrollView>
      <Modal
        isVisible={locationModal}
        animationIn="slideInRight"
        animationInTiming={500}
        animationOut="slideOutLeft"
        animationOutTiming={500}
        style={{
          margin: 0,
          backgroundColor: 'white',
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
})

export default ShippingMethodModal
