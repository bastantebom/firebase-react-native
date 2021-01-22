import React, { useState, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import Geocoder from 'react-native-geocoding'
import Geolocation from '@react-native-community/geolocation'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'

import {
  CloseLight,
  HeaderBackGray,
  NavigationArrowAlt,
  PushPin,
} from '@/assets/images/icons'
import Config from '@/services/Config'
import GooglePlacesInput from '@/components/LocationSearchInput'
import { PaddingView, AppText, MapComponent, AppButton } from '@/components'
import { Colors, normalize } from '@/globals'
import { RangeSlider } from '@/components/Slider/RangeSlider'
import LinearGradient from 'react-native-linear-gradient'
import { getCurrentPosition } from '@/globals/Utils'

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
  const { address, onValueChange } = route.params
  Geocoder.init(Config.apiKey)
  const [mapCoords, setMapCoords] = useState({})
  const [addressData, setAddressData] = useState({})
  const [mapInitialized, setMapInitialized] = useState(false)

  const [instructionVisible, setInstructionVisible] = useState(true)
  const [rangeValue, setRangeValue] = useState(5)
  const [isFocused, setIsFocused] = useState(false)

  const getSliderValue = rangeValue => {
    setRangeValue(rangeValue)
  }

  const onInputFocus = () => {
    setIsFocused(true)
  }

  const onInputBlur = () => {
    setIsFocused(false)
  }

  useEffect(() => {
    if (rangeValue < 0) {
      setRangeValue(0)
    }
  }, [rangeValue])

  const saveRefineLocation = () => {
    const { latitude, longitude } = addressData
    onValueChange({ latitude, longitude, radius: rangeValue * 1000 })
    navigation.goBack()
  }

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

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
      default: true,
    })
  }

  const getCurrentLocation = () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization()
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      })
      currentLocation()
    } else {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 5000,
        fastInterval: 2000,
      })
        .then(data => {
          if (data) {
            currentLocation()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const initializeMap = async () => {
    try {
      setMapCoords({
        lat: address.latitude,
        lng: address.longitude,
      })

      handleRegionChange({
        latitude: address.latitude,
        longitude: address.longitude,
      })

      setMapInitialized(true)
    } catch (error) {
      const { results } = await Geocoder.from('Manila')
      const { lat, lng } = results[0].geometry.location

      setMapCoords({
        lat,
        lng,
      })
      handleRegionChange({ latitude: lat, longitude: lng })
      setMapInitialized(true)
    }
  }

  const currentLocation = async () => {
    try {
      const { latitude, longitude } = await getCurrentPosition()
      setMapCoords({
        lat: latitude,
        lng: longitude,
      })

      handleRegionChange({ latitude, longitude })

      setMapInitialized(true)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    initializeMap()
  }, [])

  return (
    <DismissKeyboard isFocused={onInputBlur}>
      {!mapInitialized ? (
        <View style={[styles.loader]}>
          <ActivityIndicator color="#3781FC" size="large" animating={true} />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient colors={['#ECEFF8', '#F8F9FC']}>
            <View
              style={{ height: isFocused ? normalize(130) : normalize(200) }}>
              <View style={styles.textInputWrapper}>
                <TouchableOpacity
                  onPress={navigation.goBack}
                  activeOpacity={0.7}
                  style={{
                    top: normalize(30),
                    position: 'absolute',
                    left: 16,
                  }}>
                  <HeaderBackGray
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                </TouchableOpacity>
                <GooglePlacesInput
                  onResultsClick={handleLocationSearchChange}
                  onClearInput={() => {}}
                  currentValue={addressData.full_address}
                  onInputFocus={onInputFocus}
                  customListViewStyle={{
                    top: normalize(80),
                    marginLeft: normalize(0),
                    marginRight: normalize(0),
                    paddingLeft: 16,
                    paddingRight: 32,
                    height: Dimensions.get('window').height - normalize(155),
                    width: Dimensions.get('window').width,
                    left: normalize(-42),
                    backgroundColor: Colors.neutralsZirconLight,
                  }}
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
                  top: normalize(75),
                  display: !isFocused ? 'flex' : 'none',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <AppText textStyle="promo">Browse Offers Within</AppText>
                  <AppText textStyle="caption" color="#999">
                    {rangeValue < 100 ? rangeValue + 'KM' : 'Philippines'}
                  </AppText>
                </View>
                <RangeSlider
                  minValue={0}
                  maxValue={100}
                  step={1}
                  value={getSliderValue}
                />
              </PaddingView>
            </View>
          </LinearGradient>
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
            <TouchableOpacity onPress={() => setInstructionVisible(false)}>
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
          <View style={styles.buttonWrapper}>
            <AppButton
              text="Apply"
              type="primary"
              height="xl"
              onPress={saveRefineLocation}
            />
          </View>
        </SafeAreaView>
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
    zIndex: 100,
    elevation: 100,
  },
  textInputWrapper: {
    width: '100%',
    position: 'absolute',
    paddingLeft: normalize(42),
    paddingRight: 8,
    paddingTop: 8,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    left: normalize(45),
    paddingTop: 12,
    top: normalize(75),
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
