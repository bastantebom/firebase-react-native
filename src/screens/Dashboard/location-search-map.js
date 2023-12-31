import React, { useState, useEffect, useRef } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Geocoder from 'react-native-geocoding'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

import {
  CloseLight,
  Icons,
  NavigationArrowAlt,
  NavigationPinRed,
  PushPin,
} from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import { getCurrentPosition } from '@/globals/Utils'
import { PaddingView, AppText, MapComponent, AppButton } from '@/components'
import GooglePlacesInput from '@/components/LocationSearchInput'
import { RangeSlider } from '@/components/Slider/RangeSlider'
import { GOOGLE_MAPS_API_KEY } from '@env'
import StatusBar from '@/components/StatusBar'

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

/**
 * @typedef {object} LocationSearchMapScreenProps
 * @property {{latitude: number, longitude: number}} address
 * @property {() => void} onValueChange
 */

/**
 * @typedef {object} RootProps
 * @property {LocationSearchMapScreenProps} LocationSearchMapScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'LocationSearchMapScreen'>} param0 */
const LocationSearchMapScreen = ({ navigation, route }) => {
  Geocoder.init(GOOGLE_MAPS_API_KEY)

  const { address, onValueChange } = route.params

  const [mapCoords, setMapCoords] = useState({})
  const [addressData, setAddressData] = useState({})
  const [mapInitialized, setMapInitialized] = useState(false)

  const [instructionVisible, setInstructionVisible] = useState(true)
  const [rangeValue, setRangeValue] = useState(address.radius / 1000 || 101)
  const [isFocused, setIsFocused] = useState(false)
  const isLocationSearched = useRef(false)

  const [isKeyboardShown, setIsKeyboardShown] = useState(false)

  const onInputBlur = () => setIsFocused(false)

  const saveRefineLocation = () => {
    const { latitude, longitude } = addressData

    onValueChange({
      latitude,
      longitude,
      radius: rangeValue === 101 ? 101 : rangeValue * 1000,
    })

    navigation.goBack()
  }

  const getLocationName = (components, key) => {
    components.find(component => component.types.includes(key))?.long_name
  }

  const handleLocationSearchChange = async address => {
    try {
      isLocationSearched.current = true
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
      Alert.alert('Error', 'Oops, something went wrong.')
    }

    onInputBlur()
  }

  const handleRegionChange = async region => {
    if (!isLocationSearched.current) {
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
        default: true,
      })
    }

    isLocationSearched.current = false
  }

  const initializeMap = async () => {
    try {
      setMapCoords({
        lat: address.latitude,
        lng: address.longitude,
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

  const currentLocation = async () => {
    try {
      let { latitude, longitude } = await getCurrentPosition()
      if (!latitude || !longitude) {
        latitude = 14.585322
        longitude = 120.983207
      }
      setMapCoords({
        lat: latitude,
        lng: longitude,
      })

      setMapInitialized(true)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    AsyncStorage.getItem('hide-map-instruction').then(hidden => {
      setInstructionVisible(hidden !== 'true')
    })

    initializeMap()

    Keyboard.addListener('keyboardDidShow', () => setIsKeyboardShown(true))
    Keyboard.addListener('keyboardDidHide', () => setIsKeyboardShown(false))

    return () => {
      Keyboard.removeListener('keyboardDidShow', () => setIsKeyboardShown(true))
      Keyboard.removeListener('keyboardDidHide', () =>
        setIsKeyboardShown(false)
      )
    }
  }, [])

  useEffect(() => {
    if (rangeValue < 1) setRangeValue(1)
  }, [rangeValue])

  return (
    <DismissKeyboard isFocused={onInputBlur}>
      {!mapInitialized ? (
        <View style={[styles.loader]}>
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.primaryYellow}
          />
        </View>
      ) : (
        <>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor="#fff"
          />
          <View style={{ flex: 1, marginTop: getStatusBarHeight() }}>
            <LinearGradient colors={['#ECEFF8', '#F8F9FC']}>
              <View
                style={{ height: isFocused ? normalize(130) : normalize(210) }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => currentLocation()}
                  style={styles.navigationArrow}>
                  <NavigationArrowAlt
                    width={normalize(20)}
                    height={normalize(20)}
                  />
                  <AppText
                    textStyle="caption"
                    color={Colors.contentOcean}
                    customStyle={{ marginLeft: 10 }}>
                    Use current location
                  </AppText>
                </TouchableOpacity>
                <PaddingView
                  paddingSize={2}
                  style={{
                    top: normalize(85),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    <AppText textStyle="promo">Browse Offers Within</AppText>
                    <AppText textStyle="caption" color="#999">
                      {rangeValue <= 100 ? rangeValue + 'KM' : 'Philippines'}
                    </AppText>
                  </View>
                  <RangeSlider
                    minValue={1}
                    maxValue={101}
                    step={1}
                    onValueChange={setRangeValue}
                    value={rangeValue}
                  />
                </PaddingView>
              </View>
            </LinearGradient>

            <View style={styles.textInputWrapper}>
              <TouchableOpacity
                onPress={navigation.goBack}
                activeOpacity={0.7}
                style={{
                  top: normalize(30),
                  position: 'absolute',
                  left: 16,
                }}>
                <Icons.Back
                  width={normalize(22)}
                  height={normalize(22)}
                  style={{ color: Colors.icon }}
                />
              </TouchableOpacity>
              <GooglePlacesInput
                onResultsClick={handleLocationSearchChange}
                onClearInput={() => {}}
                currentValue={addressData.full_address}
                customListViewStyle={{
                  top: normalize(80),
                  marginLeft: normalize(0),
                  marginRight: normalize(0),
                  paddingLeft: 16,
                  paddingRight: 32,
                  width: Dimensions.get('window').width,
                  left: normalize(-42),
                  backgroundColor: 'white',
                }}
                customIcon={
                  <NavigationPinRed
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                }
                customTextInputStyle={{
                  borderWidth: 0,
                  borderRadius: 40,
                  height: normalize(55),
                  paddingLeft: normalize(50),
                }}
                customIconStyle={{
                  left: normalize(25),
                  top: normalize(23),
                }}
                placeholder="Search Your Location"
                debounce={1500}
              />
            </View>
            <View
              style={[
                styles.mapInstruction,
                {
                  display: instructionVisible ? 'flex' : 'none',
                  position: instructionVisible ? 'absolute' : 'relative',
                  top: isFocused ? normalize(140) : normalize(200),
                },
              ]}>
              <PushPin width={normalize(22)} height={normalize(22)} />
              <AppText
                textStyle="body2"
                color={Colors.neutralsWhite}
                customStyle={{ flex: 1, marginHorizontal: 14 }}>
                Set your location and drag the Buzzy Pin to the exact area you
                want to explore.
              </AppText>
              <TouchableOpacity
                onPress={() => {
                  AsyncStorage.setItem('hide-map-instruction', 'true')
                  setInstructionVisible(false)
                }}>
                <CloseLight />
              </TouchableOpacity>
            </View>

            <MapComponent
              latitude={mapCoords.lat}
              longitude={mapCoords.lng}
              reCenter={mapCoords}
              onRegionChange={handleRegionChange}
              withRadius
              radius={rangeValue}
              radiusMarker
              customMapStyle={[]}
            />

            {!isKeyboardShown && (
              <View style={styles.buttonWrapper}>
                <AppButton
                  text="Apply"
                  type="primary"
                  height="xl"
                  onPress={saveRefineLocation}
                />
              </View>
            )}
          </View>
        </>
      )}
    </DismissKeyboard>
  )
}

export default LocationSearchMapScreen

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24,
    alignItems: 'stretch',
    elevation: 100,
  },
  textInputWrapper: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
    paddingLeft: normalize(42),
    paddingRight: 8,
    paddingTop: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    left: normalize(50),
    right: 45,
    paddingTop: 12,
    top: normalize(77),
    zIndex: 9999,
  },
  mapInstruction: {
    backgroundColor: Colors.primaryMidnightBlue,
    opacity: 0.8,
    margin: 16,
    padding: 12,
    flexDirection: 'row',
    zIndex: 100,
  },
  inputLabel: {
    position: 'absolute',
    zIndex: 99999999,
    backgroundColor: 'red',
    top: 20,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
