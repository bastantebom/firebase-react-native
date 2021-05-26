import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import Geocoder from 'react-native-geocoding'
import { Icons } from '@/assets/images/icons'
import GooglePlacesInput from '@/components/LocationSearchInput'
import { PaddingView, AppText, MapComponent, AppButton } from '@/components'
import { Colors, normalize } from '@/globals'
import { GOOGLE_MAPS_API_KEY } from '@env'

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    elevation: 100,
  },
  textInputWrapper: {
    width: '100%',
    flex: 0,
    position: 'absolute',
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    top: 70,
    marginTop: 25,
  },
})

// create a component
const Location = ({ toggleMap, address, changeFromMapHandler }) => {
  const [changeMapAddress, setChangeMapAddress] = useState(address.full_address)
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  })
  const [buttonDisabled, setButtonDisabled] = useState(true)
  Geocoder.init(GOOGLE_MAPS_API_KEY)
  const [newCoords, setNewCoords] = useState({})
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
    full_address: '',
  })
  const [addressRunCount, setAddressRunCount] = useState(0)

  //MAP DRAG
  const onRegionChange = region => {
    if (addressRunCount === 0) {
      getStringAddress(region, null)
    } else {
      setAddressRunCount(addressRunCount - 1)
    }
    setButtonDisabled(false)
    setButtonStyle({})
  }

  const getPositionFromString = address => {
    Geocoder.from(address)
      .then(json => {
        const location = json.results[0].geometry.location
        const convertedLocation = {
          latitude: location.lat,
          longitude: location.lng,
        }
        getStringAddress(convertedLocation, address)
        setAddressRunCount(addressRunCount + 1)
        setNewCoords(location)
        setButtonDisabled(false)
        setButtonStyle({})
      })
      .catch(error => console.warn(error))
  }

  const getStringAddress = (location, strAddress) => {
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        const stringMapDrag = json.results[1].formatted_address
        const arrayToExtract =
          json.results.length < 8 ? 2 : json.results.length - 5

        setChangeMapAddress(strAddress ? strAddress : stringMapDrag)
        const splitAddress = json.results[
          arrayToExtract
        ].formatted_address.split(',')

        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: location.latitude,
            longitude: location.longitude,
            city: splitAddress[0],
            province: splitAddress[1],
            country: splitAddress[2],
            full_address: strAddress ? strAddress : stringMapDrag,
          },
        })
      })
      .catch(error => console.warn(error))
  }

  //SEARCH ADDRESS
  const onSearchLocationHandler = data => {
    getPositionFromString(data)
  }

  const saveRefineLocation = () => {
    changeFromMapHandler(addressComponents)
    toggleMap()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaddingView paddingSize={3}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={toggleMap}
            activeOpacity={0.7}
            style={{ position: 'absolute', left: 0 }}>
            <Icons.Back
              style={{
                width: normalize(24),
                height: normalize(24),
                color: Colors.primaryMidnightBlue,
              }}
            />
          </TouchableOpacity>
          <AppText textStyle="body3">Address</AppText>
        </View>
      </PaddingView>
      {/* <View> */}
      <View style={styles.textInputWrapper}>
        <GooglePlacesInput
          onResultsClick={data => {
            onSearchLocationHandler(data)
          }}
          onClearInput={() => {}}
          currentValue={changeMapAddress}
        />
      </View>
      <MapComponent
        latitude={address.latitude}
        longitude={address.longitude}
        reCenter={newCoords}
        onRegionChange={region => {
          onRegionChange(region)
        }}
        withCurrentMarker={false}
      />
      <View style={styles.buttonWrapper}>
        <AppButton
          text="Apply"
          type="primary"
          height="xl"
          customStyle={buttonStyle}
          disabled={buttonDisabled}
          onPress={() => {
            saveRefineLocation()
          }}
        />
      </View>
    </SafeAreaView>
  )
}

//make this component available to the app
export default Location
