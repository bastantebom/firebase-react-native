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
  Divider,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { CircleAdd } from '@/assets/images/icons'
import Modal from 'react-native-modal'
import CategoryOptions from './CategoryOptions'
import MapAddress from '@/screens/Profile/components/EditProfile/MapAddress'

import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'

const AddedItemPreview = ({ close, pickupAddress, setPickupAddress }) => {
  const [locationModal, showLocationModal] = useState(false)

  const { userInfo } = useContext(UserContext)

  const { addresses } = userInfo

  const [addressSelected, setAddressSelected] = useState()

  const openMapHandler = () => {
    setAddressSelected(addresses.find(address => address.default))

    showLocationModal(true)
  }

  const getSelectedAddress = fullAddress => {
    setPickupAddress(fullAddress)
    close()
  }

  const selectSavedAddress = address => {
    setPickupAddress(address)
    close()
  }

  const addressesLength = addresses.length

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
        }}>
        <ScreenHeaderTitle
          iconSize={24}
          close={close}
          title={'Location'}
          paddingSize={2}
        />

        <View style={{ backgroundColor: Colors.neutralsZirconLight }}>
          <View
            style={{
              backgroundColor: 'white',
              marginBottom: 8,
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              paddingHorizontal: 24,
            }}>
            <TouchableOpacity
              style={{ marginTop: 24 }}
              onPress={openMapHandler}>
              <FloatingAppInput
                label="location"
                value={pickupAddress.full_address}
                disabled
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={openMapHandler}>
              <AppText color={Colors.contentOcean} textStyle="body2">
                Search from map
              </AppText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 24,
            }}>
            <View>
              <AppText customStyle={{ marginBottom: 24 }} textStyle="caption">
                Saved Address
              </AppText>
              {addresses.map((address, index) => {
                if (addressesLength === index + 1)
                  return (
                    <TouchableOpacity
                      key={address.name}
                      onPress={() => selectSavedAddress(address)}>
                      <AppText textStyle={address.default ? 'body3' : 'body2'}>
                        {address.name} {address.default ? '(Default)' : ''}
                      </AppText>
                      <AppText>{address.full_address}</AppText>
                    </TouchableOpacity>
                  )
                else
                  return (
                    <>
                      <TouchableOpacity
                        key={address.name}
                        onPress={() => selectSavedAddress(address)}>
                        <AppText
                          textStyle={address.default ? 'body3' : 'body2'}>
                          {address.name} {address.default ? '(Default)' : ''}
                        </AppText>
                        <AppText>{address.full_address}</AppText>
                      </TouchableOpacity>

                      <Divider />
                    </>
                  )
              })}
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={close}
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
