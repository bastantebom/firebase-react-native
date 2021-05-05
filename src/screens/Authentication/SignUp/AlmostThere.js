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

import Geocoder from 'react-native-geocoding'
import { useNavigation } from '@react-navigation/native'

import Config from '@/services/Config'
import { UserContext } from '@/context/UserContext'
import { getCurrentPosition } from '@/globals/Utils'
import Api from '@/services/Api'

const AlmostThere = () => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)
  Geocoder.init(Config.apiKey)

  const [addressData, setAddressData] = useState(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [isScreenLoading, setIsScreenLoading] = useState(false)

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

  const handleRegionChange = async region => {
    const { latitude, longitude } = region
    const { results } = await Geocoder.from(latitude, longitude)
    const addressComponents = results[0].address_components || []

    setAddressData({
      ...(addressData || {}),
      longitude,
      latitude,
      city: getLocationName(addressComponents, 'locality'),
      province:
        getLocationName(addressComponents, 'administrative_area_level_2') || '',
      country: getLocationName(addressComponents, 'country'),
      full_address: results[0].formatted_address,
      default: true,
    })
  }

  const initializeMap = async () => {
    try {
      const { latitude, longitude } = await getCurrentPosition()
      if (!latitude || !longitude) await defaultAddress()
      else handleRegionChange({ latitude, longitude })
      setMapInitialized(true)
    } catch (error) {
      await defaultAddress()
      setMapInitialized(true)
    }
  }

  const defaultAddress = async () => {
    const { results } = await Geocoder.from('Manila')
    const { lat, lng } = results[0].geometry.location
    handleRegionChange({ latitude: lat, longitude: lng })
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

  const onCurrentLocationHandler = () => {
    if (mapInitialized) {
      navigation.navigate('AlmostThereMap', {
        ...addressData,
      })
    }
  }

  useEffect(() => {
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
                <TouchableOpacity onPress={onCurrentLocationHandler}>
                  <AppText
                    textStyle="body3"
                    customStyle={styles.currentAddress}>
                    {addressData?.full_address || ''}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.primaryYellow}
          />
        )}
        <View style={styles.buttonWrapper}>
          <AppButton
            text="Next"
            type="primary"
            height="xl"
            customStyle={styles.buttonStyle}
            onPress={saveLocation}
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
