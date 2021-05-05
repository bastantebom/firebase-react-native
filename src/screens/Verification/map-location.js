import React, { useState, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Text,
} from 'react-native'
import Geocoder from 'react-native-geocoding'
import { Icons } from '@/assets/images/icons'
import Config from '@/services/Config'
import GooglePlacesInput from '@/components/LocationSearchInput'
import { MapComponent } from '@/components'
import { Colors, normalize } from '@/globals'
import { getCurrentPosition, iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import typography from '@/globals/typography'
import Button from '@/components/Button'

/**
 * @typedef {Object} Address
 * @property {string} name
 * @property {string} details
 * @property {string} notes
 * @property {string} full_address
 * @property {boolean} default
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} city
 * @property {string} province
 * @property {string} country
 */

/**
 * @typedef {Object} MapLocationScreen
 * @property {Address} address
 * @property {function} onSelect
 * @property {string} title
 */

/**
 * @typedef {Object} RootProps
 * @property {MapLocationScreen} MapLocationScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'MapLocationScreen'>} param0 */
const MapLocationScreen = ({ navigation, route }) => {
  Geocoder.init(Config.apiKey)
  const { onSelect, address, title } = route.params

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
      province:
        getLocationName(addressComponents, 'administrative_area_level_2') ||
        getLocationName(addressComponents, 'administrative_area_level_1') ||
        '',
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
        province:
          getLocationName(addressComponents, 'administrative_area_level_2') ||
          getLocationName(addressComponents, 'administrative_area_level_1') ||
          '',
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
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />

      <View style={styles.wrapper}>
        <View style={{ padding: normalize(24) }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={navigation.goBack}
              activeOpacity={0.7}
              style={{ position: 'absolute', left: 0 }}>
              <Icons.Back
                style={{ color: Colors.primaryMidnightBlue }}
                {...iconSize(24)}
              />
            </TouchableOpacity>
            <Text style={[typography.body2, typography.medium]}>
              {title || 'Select Location'}
            </Text>
          </View>
        </View>

        {!mapInitialized ? (
          <View style={[styles.loader]}>
            <ActivityIndicator
              color={Colors.primaryYellow}
              size="large"
              animating={true}
            />
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
              <Button
                label="Confirm"
                type="primary"
                onPress={() => {
                  onSelect({ ...addressData })
                  navigation.goBack()
                }}
              />
            </View>
          </>
        )}
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

export default MapLocationScreen
