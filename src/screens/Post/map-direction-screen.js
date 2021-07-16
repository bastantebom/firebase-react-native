import { Colors, normalize } from '@/globals'

import { iconSize } from '@/globals/Utils'
import React, { useContext, useRef } from 'react'
import { UserContext } from '@/context/UserContext'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'
import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import typography from '@/globals/typography'

const MapDirectionScreen = ({ navigation, route }) => {
  const { userInfo } = useContext(UserContext)
  const { data, user } = route.params
  const { width, height } = Dimensions.get('window')
  const ASPECT_RATIO = width / height
  const LATITUDE_DELTA = 0.0922
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
  const destinationLocation =
    (userInfo.addresses || []).find(address => address.default) ||
    userInfo?.addresses?.[0]
  const mapViewRef = useRef(null)

  const initialRegion = {
    latitude: data.location.latitude,
    longitude: data.location.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  }
  const pointsCoordinates = [
    {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
    {
      latitude: destinationLocation.latitude,
      longitude: destinationLocation.longitude,
    },
  ]

  const redrawMap = result => {
    mapViewRef.current.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    })
  }

  const handleDirectionError = error => {
    Toast.show({
      label: error.includes('ZERO_RESULTS')
        ? 'Oh no. Directions are not available from this location.'
        : 'Oops, something went wrong.',
      type: 'error',
      dismissible: true,
      screenId: 'map-direction',
      timeout: 5000,
    })
  }

  const MapPinPostType = ({ type, size }) => {
    switch (type?.toLowerCase()) {
      case 'service':
        return <Icons.MapPinService {...iconSize(size)} />
      case 'need':
        return <Icons.MapPinNeed {...iconSize(size)} />
      default:
        return <Icons.MapPinSell {...iconSize(size)} />
    }
  }

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'map-direction')}
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          ref={mapViewRef}
          initialRegion={initialRegion}>
          <Marker coordinate={pointsCoordinates[0]}>
            <View style={styles.pinContainer}>
              <View style={styles.avatar}>
                <Avatar
                  style={styles.avatarPhoto}
                  path={user.profile_photo}
                  size="32x32"
                />
              </View>
              <Icons.MapPinBase {...iconSize(60)} />
              <View style={styles.postType}>
                <MapPinPostType type={data.type} size={34} />
              </View>
              <View style={styles.fullAddress}>
                <Text
                  style={[
                    typography.eyebrow,
                    typography.medium,
                    { color: Colors.primaryMidnightBlue },
                  ]}>{`${user.display_name || user.full_name}`}</Text>
                <Text
                  style={[
                    typography.caption,
                    typography.medium,
                    { color: Colors.primaryMidnightBlue },
                  ]}
                  numberOfLines={1}>
                  {data.location.full_address}
                </Text>
              </View>
            </View>
          </Marker>
          <Marker coordinate={pointsCoordinates[1]}>
            <View style={styles.pinContainer}>
              <View style={styles.avatar}>
                <Avatar
                  style={styles.avatarPhoto}
                  path={userInfo.profile_photo}
                  size="32x32"
                />
              </View>
              <Icons.MapPinBase {...iconSize(60)} />
              <View style={styles.fullAddress}>
                <Text
                  style={[
                    typography.eyebrow,
                    typography.medium,
                    { color: Colors.primaryMidnightBlue },
                  ]}>{`${userInfo.full_name.split(' ')[0]} (Home)`}</Text>
                <Text
                  style={[
                    typography.caption,
                    typography.medium,
                    { color: Colors.primaryMidnightBlue },
                  ]}
                  numberOfLines={1}>
                  {destinationLocation.full_address}
                </Text>
              </View>
            </View>
          </Marker>
          <MapViewDirections
            origin={pointsCoordinates[0]}
            destination={pointsCoordinates[1]}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={7}
            strokeColor={Colors.contentOcean}
            onReady={redrawMap}
            onError={handleDirectionError}
          />
        </MapView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
  },
  map: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    marginTop: getStatusBarHeight() + normalize(8),
  },
  backButton: {
    zIndex: 2,
    padding: normalize(4),
    backgroundColor: Colors.neutralsWhite,
    borderRadius: normalize(24),
    marginLeft: normalize(16),
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  avatar: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(100),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutralsZirconLight,
    position: 'absolute',
    zIndex: 2,
    elevation: 2,
    left: normalize(13),
    top: normalize(6),
  },
  pinContainer: {
    position: 'relative',
    width: normalize(250),
    marginLeft: normalize(200),
  },
  avatarPhoto: { height: '100%', width: '100%' },
  postType: {
    position: 'absolute',
    zIndex: 3,
    elevation: 3,
    bottom: normalize(5),
    left: normalize(25),
  },
  fullAddress: {
    position: 'absolute',
    width: normalize(175),
    height: normalize(43),
    zIndex: 4,
    backgroundColor: Colors.neutralsWhite,
    borderRadius: normalize(99),
    left: normalize(60),
    overflow: 'visible',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(12),
  },
})

export default MapDirectionScreen
