import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

import { Colors, normalize } from '@/globals'

const BookingMethodModal = ({
  close,
  deliveryState,
  setDeliveryState,
  pickupState,
  setPickupState,
  setPickupAddress,
  pickupAddress,
}) => {
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

  const CheckboxStateHandler = val => {
    if (val === 'nationwide') {
      setNationwide(!nationwide)
      setWithinNotes('')
      setRangeValue(0)
      setDeliveryState({
        nationwide: {},
      })
    }
    if (val === 'within') {
      setWithin(!within)
      setNationwideNotes('')
      setDeliveryState({
        radius: {},
      })
    }
  }

  const [locationModal, showLocationModal] = useState(false)

  const openLocationHandler = () => {
    showLocationModal(true)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScreenHeaderTitle
        close={close}
        title="Booking Methods"
        paddingSize={2}
      />
      <ScrollView style={{ paddingHorizontal: 24 }}>
        <AppText textStyle="body1">How do you want to manage bookings?</AppText>
        <AppText textStyle="captionDashboard">
          Set your booking preferences and ways customers can avail your
          service.
        </AppText>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="body3">Appointments Only</AppText>
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
            Customers need to reserve their slot ahead with their preferred date
            and time.
          </AppText>
        </View>
        <View style={{ paddingVertical: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="body3">Walk-ins</AppText>
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
            customStyle={{ marginTop: 4 }}
            color={Colors.contentPlaceholder}>
            Customers can avail the service anytime, within your specified
            operating hours.
          </AppText>
        </View>
      </ScrollView>

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

export default BookingMethodModal
