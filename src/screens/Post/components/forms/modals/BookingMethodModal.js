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
  const [pickUp, setPickUp] = useState(pickupState?.value || false)

  const [delivery, setDelivery] = useState(deliveryState?.value || false)

  const [locationModal, showLocationModal] = useState(false)

  const handleSave = () => {
    const deliveryData = {
      value: delivery,
    }

    const pickupData = {
      value: pickUp,
    }

    setPickupState(pickupData)
    setDeliveryState(deliveryData)

    close()
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
                setPickUp(!pickUp)
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
                setDelivery(!delivery)
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
        onPress={handleSave}
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
