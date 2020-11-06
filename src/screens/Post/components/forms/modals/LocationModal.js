import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

import {
  AppText,
  Item,
  ScreenHeaderTitle,
  FloatingAppInput,
} from '@/components'
import { Colors } from '@/globals'
import Modal from 'react-native-modal'
import MapAddress from '@/screens/Profile/components/EditProfile/MapAddress'

import { UserContext } from '@/context/UserContext'

const AddedItemPreview = ({
  close,
  closeAll,
  pickupAddress,
  setPickupAddress,
  setPickupState,
}) => {
  const [locationModal, showLocationModal] = useState(false)

  const { userInfo } = useContext(UserContext)

  const { addresses } = userInfo

  const [addressSelected, setAddressSelected] = useState()

  const openMapHandler = () => {
    // console.log('OPEN MAP')
    // console.log(addresses.find(address => address.default))
    setAddressSelected(addresses.find(address => address.default))

    showLocationModal(true)
  }

  const getSelectedAddress = fullAddress => {
    setPickupAddress(fullAddress)
    setPickupState({
      location: fullAddress,
    })
    closeAll()
  }

  const selectSavedAddress = address => {
    setPickupAddress(address)
    setPickupState({
      location: address,
    })
    closeAll()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <View>
          <ScreenHeaderTitle
            iconSize={24}
            close={close}
            title={'Location'}
            paddingSize={0}
          />

          <TouchableOpacity style={{ marginTop: 24 }} onPress={openMapHandler}>
            <FloatingAppInput
              label="location"
              value={pickupAddress.full_address}
              disabled
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 16 }} onPress={openMapHandler}>
            <AppText color={Colors.contentOcean} textStyle="body2">
              Search from map
            </AppText>
          </TouchableOpacity>
          <View>
            <AppText>Saved Address</AppText>
            {addresses.map(address => {
              return (
                <TouchableOpacity
                  style={{ marginTop: 16 }}
                  key={address.name}
                  onPress={() => selectSavedAddress(address)}>
                  <AppText textStyle="body3">{address.name}</AppText>
                  <AppText>{address.full_address}</AppText>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

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
        <MapAddress
          address={addressSelected}
          toggleMap={() => showLocationModal(false)}
          changeFromMapHandler={fulladdress => getSelectedAddress(fulladdress)}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default AddedItemPreview
