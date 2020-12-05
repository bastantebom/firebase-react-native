import React, { useState, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import Geocoder from 'react-native-geocoding'
import { HeaderBackGray } from '@/assets/images/icons'
import Config from '@/services/Config'
import GooglePlacesInput from '@/components/LocationSearchInput'
import { PaddingView, AppText, MapComponent, AppButton } from '@/components'
import { normalize } from '@/globals'
import { getCurrentPosition } from '@/globals/Utils'

const MapLocation = ({ back, address, onChange = () => {} }) => {
  Geocoder.init(Config.apiKey)

  const [addressData, setAddressData] = useState(address)
  const [mapInitialized, setMapInitialized] = useState(false)

  const [mapCoords, setMapCoords] = useState({})

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

  const handleRegionChange = async region => {
    const { latitude, longitude } = region
    const { results } = await Geocoder.from(latitude, longitude)

    const addressComponents = results[0].address_components || []

    setAddressData({
      ...addressData,
      longitude,
      latitude,
      city: getLocationName(addressComponents, 'locality'),
      province: getLocationName(
        addressComponents,
        'administrative_area_level_2'
      ),
      country: getLocationName(addressComponents, 'country'),
      full_address: results[0].formatted_address,
    })
  }

  const handleLocationSearchChange = async address => {
    try {
      const { results } = await Geocoder.from(address)
      const { lat: latitude, lng: longitude } = results[0].geometry.location

      setMapCoords({ lat: latitude, lng: longitude })
      const addressComponents = results[0].address_components || []

      setAddressData({
        ...addressData,
        longitude,
        latitude,
        city: getLocationName(addressComponents, 'locality'),
        province: getLocationName(
          addressComponents,
          'administrative_area_level_2'
        ),
        country: getLocationName(addressComponents, 'country'),
        full_address: results[0].formatted_address,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const initializeMap = async () => {
    try {
      const { latitude, longitude } = await getCurrentPosition()
      setMapCoords({
        lat: latitude,
        lng: longitude,
      })

      setMapInitialized(true)
    } catch (error) {
      const { results } = await Geocoder.from('Manila')
      const { lat, lng } = results[0].geometry.location
      setMapCoords({
        lat,
        lng,
      })

      setMapInitialized(true)
    }
  }

  useEffect(() => {
    initializeMap()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaddingView paddingSize={3}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={back}
            activeOpacity={0.7}
            style={{ position: 'absolute', left: 0 }}>
            <HeaderBackGray width={normalize(16)} height={normalize(16)} />
          </TouchableOpacity>
          <AppText textStyle="body3">Select location</AppText>
        </View>
      </PaddingView>

      {!mapInitialized ? (
        <View style={[styles.loader]}>
          <ActivityIndicator color="#3781FC" size="large" animating={true} />
        </View>
      ) : (
        <>
          <View style={styles.textInputWrapper}>
            <GooglePlacesInput
              onResultsClick={handleLocationSearchChange}
              onClearInput={() => {}}
              currentValue={addressData.full_address}
            />
          </View>
          <MapComponent
            latitude={mapCoords.lat}
            longitude={mapCoords.lng}
            reCenter={mapCoords}
            onRegionChange={handleRegionChange}
            withCurrentMarker={false}
          />
          <View style={styles.buttonWrapper}>
            <AppButton
              text="Apply"
              type="primary"
              height="xl"
              onPress={() => {
                onChange({ ...addressData })
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MapLocation
