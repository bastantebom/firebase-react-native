import React, { useState, useContext } from 'react'
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native'

import Config from '@/services/Config'
import Geocoder from 'react-native-geocoding'
import MapComponent from '@/components/MapComponent/MapComponent'
import { AppButton, TransitionIndicator, ScreenHeaderTitle } from '@/components'
import { Colors } from '@/globals'

import GooglePlacesInput from '@/components/LocationSearchInput'

import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

const AlmostThereMap = route => {
  const navigation = useNavigation()

  const [isScreenLoading, setIsScreenLoading] = useState(false)

  const { user } = useContext(UserContext)
  Geocoder.init(Config.apiKey)
  const [addressData, setAddressData] = useState(route?.route?.params)
  const [mapCoords, setMapCoords] = useState({})

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

  const handleRegionChange = async region => {
    const { latitude, longitude } = region
    const { results } = await Geocoder.from(latitude, longitude)
    const addressComponents = results[0].address_components || []
    console.log(addressComponents)
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

  const saveLocation = async () => {
    const { uid } = user
    if (!uid || !addressData) return

    setIsScreenLoading(true)
    try {
      const response = await Api.saveLocation({ uid, body: addressData })
      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error.message || error)
      Alert.alert('Error', 'Oops something went wrong')
    }
    setIsScreenLoading(false)
  }

  return (
    <>
      <TransitionIndicator loading={isScreenLoading} />
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <View style={{ padding: 24 }}>
            <ScreenHeaderTitle
              title="Select location"
              close={() => {
                navigation.goBack()
              }}
            />
          </View>
        </SafeAreaView>
        <View style={{ flex: 1, position: 'relative' }}>
          <>
            <View style={styles.textInputWrapper}>
              <GooglePlacesInput
                onResultsClick={handleLocationSearchChange}
                onClearInput={() => {}}
                currentValue={addressData.full_address}
              />
            </View>

            <MapComponent
              latitude={route?.route?.params.latitude}
              longitude={route?.route?.params.longitude}
              reCenter={mapCoords}
              onRegionChange={handleRegionChange}
            />
            <View style={styles.buttonWrapper}>
              <AppButton
                text="Confirm"
                type="primary"
                height="xl"
                onPress={saveLocation}
              />
            </View>
          </>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 88,
  },
  headerWrapper: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 16,
  },

  headerClose: {
    //flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSkip: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  textInputWrapper: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    elevation: 100,
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

  textInput: {
    backgroundColor: Colors.neutralsWhite,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  navIcon: {
    position: 'absolute',
    top: 45,
    left: 45,
    zIndex: 101,
    elevation: 101,
  },
})

export default AlmostThereMap
