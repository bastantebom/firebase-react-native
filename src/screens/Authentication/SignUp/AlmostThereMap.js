//import liraries
import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Text, SafeAreaView } from 'react-native'

//import Geolocation from '@react-native-community/geolocation';
import Config from '@/services/Config'
import Geocoder from 'react-native-geocoding'
import MapComponent from '@/components/MapComponent/MapComponent'
import {
  AppText,
  AppButton,
  TransitionIndicator,
  ScreenHeaderTitle,
} from '@/components'
import { Colors } from '@/globals'

import GooglePlacesInput from '@/components/LocationSearchInput'

import { useNavigation } from '@react-navigation/native'
import SignUpService from '@/services/SignUpService'
import { UserContext } from '@/context/UserContext'

// create a component
const AlmostThereMap = route => {
  const navigation = useNavigation()
  const [changeMapAddress, setChangeMapAddress] = useState('')
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  })
  const [buttonDisabled, setButtonDisabled] = useState(true)
  Geocoder.init(Config.apiKey)
  const [newCoords, setNewCoords] = useState({})
  const [isScreenLoading, setIsScreenLoading] = useState(false)
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
    full_address: '',
    default: true,
  })

  const { user, fetch: updateUserInfo } = useContext(UserContext)

  const onRegionChange = region => {
    getStringAddress(region)
    setButtonDisabled(false)
    setButtonStyle({})
  }

  const getStringAddress = location => {
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        console.log(json)
        const addressComponent = json.results[1].formatted_address
        const arrayToExtract =
          json.results.length < 8 ? 2 : json.results.length - 5
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
            full_address: addressComponent,
          },
        })
        setChangeMapAddress(addressComponent)
        console.log(addressComponents)
      })
      .catch(error => console.warn(error))
    console.log(addressComponents)
  }

  const getPositionFromString = address => {
    Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location
        console.log('New Coords')
        setNewCoords(location)
        setButtonDisabled(false)
        setButtonStyle({})
      })
      .catch(error => console.warn(error))
  }

  const onSearchLocationHandler = data => {
    console.log(data)
    setChangeMapAddress(data)
    getStringAddress(data)
    getPositionFromString(data)
  }

  const saveRefineLocation = async () => {
    setIsScreenLoading(true)
    const { uid } = user
    if (uid) {
      try {
        const response = await SignUpService.saveLocation({
          uid,
          ...addressComponents
        })
        if (!response.success) throw new Error(response.message)
        else await updateUserInfo()
        setIsScreenLoading(false)
      } catch (error) {
        console.log(error.message)
      }
    } else {
      setIsScreenLoading(false)
    }
  }

  useEffect(() => {
    // exit early when we reach 0
    console.log(route?.route?.params?.latitude)
    if (route?.route?.params?.country && route?.route?.params?.city) {
      setAddressComponents({
        ...addressComponents,
        ...{
          latitude: route?.route?.params?.latitude,
          longitude: route?.route?.params?.longitude,
          city: route?.route?.params?.city,
          province: route?.route?.params?.province,
          country: route?.route?.params?.country,
        },
      })
    }
  }, [])

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
          {route?.route?.params.address ? (
            <>
              <View style={styles.textInputWrapper}>
                <GooglePlacesInput
                  onResultsClick={data => {
                    onSearchLocationHandler(data)
                    //alert(data);
                  }}
                  onClearInput={textValue => {
                    console.log('setvalue')
                  }}
                  currentValue={
                    changeMapAddress.length > 0
                      ? changeMapAddress
                      : route?.route?.params.address
                  }
                />
              </View>

              <MapComponent
                latitude={route?.route?.params.latitude}
                longitude={route?.route?.params.longitude}
                reCenter={newCoords}
                onRegionChange={region => {
                  onRegionChange(region)
                }}
                withCurrentMarker={true}
              />
              <View style={styles.buttonWrapper}>
                <AppButton
                  text="Confirm"
                  type="primary"
                  height="xl"
                  customStyle={buttonStyle}
                  disabled={buttonDisabled}
                  onPress={() => {
                    saveRefineLocation()
                  }}
                />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </>
  )
}

// define your styles
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
