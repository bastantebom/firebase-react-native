//import liraries
import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Colors, normalize } from '@/globals'

import { AppText, AppButton, TransitionIndicator } from '@/components'

import { NavigationArrow } from '@/assets/images/icons'
import LocationImage from '@/assets/images/location.svg'
import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding'
import { useNavigation } from '@react-navigation/native'

//import GooglePlacesInput from '@/components/LocationSearchInput';

import Config from '@/services/Config'
import SignUpService from '@/services/SignUpService'
import { UserContext } from '@/context/UserContext'

// create a component
const AlmostThere = ({ route }) => {
  const navigation = useNavigation()
  const { user, fetch: updateUserInfo } = useContext(UserContext)
  Geocoder.init(Config.apiKey)

  const [addressData, setAddressData] = useState({})
  const [mapInitialized, setMapInitialized] = useState(false)
  const [isScreenLoading, setIsScreenLoading] = useState(false)

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
      default: true,
    })
  }

  const getCurrentPosition = async () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(({ coords }) => resolve(coords), reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 10000,
      })
    })

  const initializeMap = async () => {
    try {
      const { latitude, longitude } = await getCurrentPosition()

      setMapCoords({
        lat: latitude,
        lng: longitude,
      })

      handleRegionChange({ latitude, longitude })

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

  const saveLocation = async () => {
    setIsScreenLoading(true)
    const { uid } = user

    if (uid) {
      try {
        const saveLocationResponse = await SignUpService.saveLocation({
          uid,
          ...addressData,
        })
        if (!saveLocationResponse.success)
          throw new Error(saveLocationResponse.message)
        else await updateUserInfo()
        setIsScreenLoading(false)
      } catch (error) {
        console.log(error.message || error)
      }
    } else {
      setIsScreenLoading(false)
    }
  }

  const onCurrentLocationHandler = () => {
    const { uid } = user
    if (mapInitialized) {
      navigation.navigate('AlmostThereMap', {
        ...addressData,
      })
    }
  }

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization()
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      })
    }
    initializeMap()
  }, [])

  return (
    <>
      <View style={styles.almostContainer}>
        <TransitionIndicator loading={isScreenLoading} />

        <View style={styles.almostThereImageContainer}>
          <LocationImage width={normalize(80)} height={normalize(80)} />
        </View>

        <AppText customStyle={styles.almostThereText} textStyle="display5">
          Almost there!
        </AppText>

        <AppText customStyle={styles.almostThereSubText} textStyle="body2">
          Let us know your current location so we can show you services and
          goods nearby. You may change this later on.
        </AppText>

        {mapInitialized ? (
          <>
            <View style={styles.bottomWrapper}>
              <View style={styles.currentLocationContainer}>
                <NavigationArrow width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="promo"
                  customStyle={styles.currentLocationLabel}>
                  Your current location
                </AppText>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    onCurrentLocationHandler()
                  }}>
                  <AppText
                    textStyle="body3"
                    customStyle={styles.currentAddress}>
                    {addressData.full_address}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.contentEbony}
          />
        )}
        <View style={styles.buttonWrapper}>
          <AppButton
            text="Next"
            type="primary"
            height="xl"
            customStyle={styles.buttonStyle}
            onPress={() => {
              saveLocation()
            }}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  almostContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.neutralsWhite,
    padding: 24,
    paddingTop: 50,
  },
  skipContainer: {
    alignItems: 'flex-end',
  },
  almostThereImageContainer: { marginBottom: 32 },
  almostThereText: {
    marginBottom: 8,
  },

  almostThereSubText: {
    marginBottom: 32,
  },

  textWrapper: {
    height: 70,
  },

  currentLocationLabel: {
    paddingLeft: 8,
    zIndex: 1,
    elevation: 1,
  },

  bottomWrapper: {
    justifyContent: 'flex-start',
    marginBottom: normalize(8),
    zIndex: -1,
    elevation: -1,
  },

  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },

  currentAddress: {
    paddingLeft: 48,
    zIndex: 1,
    elevation: 1,
  },

  buttonWrapper: { flex: 1, justifyContent: 'flex-end', marginBottom: 0 },
})

export default AlmostThere
