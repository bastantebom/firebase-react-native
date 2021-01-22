import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
} from 'react-native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'
import Modal from 'react-native-modal'
import MapAddress from '@/screens/Profile/components/EditProfile/MapAddress'

import { UserContext } from '@/context/UserContext'
import GooglePlacesInput from '@/components/LocationSearchInput'

const DismissKeyboard = ({ children, isFocused }) => {
  const onDismissPress = () => {
    Keyboard.dismiss()
    isFocused()
  }

  return (
    <TouchableWithoutFeedback onPress={onDismissPress}>
      {children}
    </TouchableWithoutFeedback>
  )
}

const PostLocation = ({
  close,
  closeAll,
  pickupAddress,
  setPickupAddress,
  setPickupState,
}) => {
  const { userInfo } = useContext(UserContext)

  const { addresses } = userInfo

  const [addressSelected, setAddressSelected] = useState()
  const [changeMapAddress, setChangeMapAddress] = useState(
    pickupAddress.full_address ? pickupAddress.full_address : pickupAddress
  )
  const [locationModal, showLocationModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const onInputFocus = () => {
    setIsFocused(true)
  }

  const onInputBlur = () => {
    setIsFocused(false)
  }

  const openMapHandler = () => {
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

  const saveLocation = changeMapAddress => {
    setPickupAddress(changeMapAddress)
    setPickupState({
      location: changeMapAddress,
    })
    closeAll()
  }

  return (
    <DismissKeyboard isFocused={onInputBlur}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              top: normalize(60),
              width: Dimensions.get('window').width,
              position: 'absolute',
              paddingHorizontal: 16,
              paddingTop: 8,
              zIndex: 9999,
            }}>
            <GooglePlacesInput
              onResultsClick={data => {
                setChangeMapAddress(data)
              }}
              onInputFocus={onInputFocus}
              onClearInput={() => {}}
              currentValue={changeMapAddress}
              customListViewStyle={{
                top: normalize(110),
                marginLeft: normalize(0),
                marginRight: normalize(0),
                height: Dimensions.get('window').height - normalize(155),
                width: Dimensions.get('window').width,
                backgroundColor: Colors.neutralsWhite,
                zIndex: 999,
                paddingLeft: 16,
                paddingRight: 32,
                left: -16,
              }}
              customTextInputStyle={{
                borderColor: '#DADCE0',
                borderWidth: 1,
                height: normalize(55),
                paddingLeft: normalize(50),
              }}
              customIconStyle={{
                left: normalize(25),
                top: normalize(23),
              }}
            />
          </View>
          <View style={styles.addressTop}>
            <ScreenHeaderTitle close={close} title="Location" />
            <TouchableOpacity
              style={{
                marginTop: 16,
                position: 'absolute',
                zIndex: 99,
                bottom: normalize(30),
                left: 24,
              }}
              onPress={openMapHandler}>
              <AppText color={Colors.contentOcean} textStyle="body2">
                Search from map
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBottom}>
            <AppText textStyle="caption">Saved Address</AppText>
            {addresses.map(address => {
              return (
                <TouchableOpacity
                  style={{ marginTop: 16 }}
                  key={address.name}
                  onPress={() => selectSavedAddress(address)}>
                  <AppText
                    textStyle="body2medium"
                    customStyle={{ paddingBottom: normalize(8) }}>
                    {address.name && address.name}
                    {address.default ? '(Default)' : ''}
                  </AppText>
                  <AppText textStyle="caption">{address.full_address}</AppText>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => saveLocation(changeMapAddress)}
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
            changeFromMapHandler={fulladdress =>
              getSelectedAddress(fulladdress)
            }
          />
        </Modal>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default PostLocation

const styles = StyleSheet.create({
  addressTop: {
    backgroundColor: Colors.neutralsWhite,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 24,
    height: normalize(200),
  },
  addressBottom: {
    marginTop: 15,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: Colors.neutralsWhite,
    paddingTop: 24,
    paddingBottom: 30,
    paddingHorizontal: 24,
    height: '100%',
    position: 'relative',
    zIndex: -1,
  },
})
