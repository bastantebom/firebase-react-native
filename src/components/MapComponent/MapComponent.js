//import liraries
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE, Marker, Geojson } from 'react-native-maps';
import { MapMarker, PinBee } from '@/assets/images/icons';
import { normalize } from '@/globals';
import Config from '@/services/Config';
import AppText from '../AppText/AppText';

// create a component
const MapComponent = ({
  latitude,
  longitude,
  onRegionChange,
  withCurrentMarker,
  withRadius,
  reCenter,
  radius = 5,
  customMarker,
  radiusMarker,
  customMapStyle
}) => {

  const circleRef = useRef(null);
  const mapViewRef = useRef(null);

  const [newLat, setNewLat] = useState(latitude)
  const [newLng, setNewLng] = useState(longitude)
  const [fixedLat, setFixedLat] = useState(newLat)
  const [fixedLng, setFixedLng] = useState(newLng)
  const [isMapReady, setIsMapReady] = useState(false)

  const initialRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: Config.latitudeDelta,
    longitudeDelta: Config.longitudeDelta,
  }

  const mapStyle = [
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#444444',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#f2f2f2',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#46bcec',
        },
        {
          visibility: 'on',
        },
      ],
    },
  ];

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.setNativeProps({
            strokeColor: 'rgba(255, 212, 0, 0.8)',
            fillColor: 'rgba(255, 212, 0, 0.18)',
          });
        }
      }, 100);
    }
    //console.log('filled object');
    //console.log(StyleSheet.absoluteFillObject);
  }, []);

  useEffect(() => {
    //console.log(isNaN(reCenter.lat));
    //console.log(reCenter);
    if (!isNaN(reCenter.lat)) {
      setTimeout(() => {
        let r = {
          latitude: parseFloat(reCenter.lat),
          longitude: parseFloat(reCenter.lng),
          latitudeDelta: Config.latitudeDelta,
          longitudeDelta: Config.longitudeDelta,
        };
        mapViewRef.current.animateToRegion(r, 2000);
      }, 100);
    }
  }, [reCenter.lat]);

  
  const onRegionChangeComplete = (region) => {
    onRegionChange(region);
    if (withRadius) {
      setNewLat(region.latitude)
      setNewLng(region.longitude)
    }
  }

  /*********** DASHBOARD LOCATION ***************/
  
  const onMarkPress = () => {
    setFixedLat(newLat)
    setFixedLng(newLng)
  }

  const onMapLayout = () => {
    setIsMapReady(true)
  }

  const get4PointsAroundCircumference = (newLat, newLng, radius) => {
    const earthRadius = 6378.1 //Km
    const lat0 = newLat + (-radius / earthRadius) * (180 / Math.PI)
    const lat1 = newLat + (radius / earthRadius) * (180 / Math.PI)
    const lng0 = newLng + (-radius / earthRadius) * (180 / Math.PI) / Math.cos(newLat * Math.PI / 180);
    const lng1 = newLng + (radius / earthRadius) * (180 / Math.PI) / Math.cos(newLat * Math.PI / 180);

    return [
      {
        latitude: lat0,
        longitude: newLng
      },
      {
        latitude: newLat,
        longitude: lng0
      },
      {
        latitude: lat1,
        longitude: newLng
      },
      {
        latitude: newLat,
        longitude: lng1
      }
    ]
  }

  const points = get4PointsAroundCircumference(newLat, newLng, (radius * 1000) * 0.001);

  useEffect(() => {
    if (withRadius) {
      if (isMapReady && radius >= 1) {
        mapViewRef.current.fitToCoordinates(points, {
          animated: true
        })
      }
    }
  }, [radius, isMapReady])

  useEffect(() => {
    if (withRadius) {
      if (radius && radius >= 100 && isMapReady) {
        let centralCoordinates = {
          latitude: 12.879721,
          longitude: 121.774017,
          latitudeDelta: 15,
          longitudeDelta: 15,
        };
        mapViewRef.current.animateToRegion(centralCoordinates, 2000);
      }
      if (radius < 1) {
        let centralCoordinates = {
          latitude: newLat,
          longitude: newLng,
          latitudeDelta: Config.latitudeDelta,
          longitudeDelta: Config.longitudeDelta,
        };
        mapViewRef.current.animateToRegion(centralCoordinates, 2000);
        console.log('0 rad');
      }
    }
  }, [radius, isMapReady]);

  // console.log(radius)

  /*********** DASHBOARD LOCATION ***************/

  return (
    <View style={styles.mapContainer}>
      <MapView
        // onPress={e => console.log(e.nativeEvent)}
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        initialRegion={initialRegion}
        customMapStyle={customMapStyle ? customMapStyle : mapStyle}
        zoomEnabled={true}
        onRegionChangeComplete={onRegionChangeComplete}
        scrollEnabled={true}
        showsScale={true}
        showsBuildings={true}
        loadingEnabled={true}
        onLayout={onMapLayout}
      >
        {withCurrentMarker ? (
          <>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}>
              <View>
                <Image
                  source={require('@/assets/images/icons/current_location.png')}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            </Marker>
            <Circle
              center={{
                latitude: latitude + parseFloat(0.00002),
                longitude: longitude,
              }}
              radius={20}
              strokeWidth={1}
              strokeColor={'rgba(255, 212, 0, 1)'}
              fillColor={'rgba(255, 212, 0, 0.18)'}
              ref={circleRef}
            />
          </>
        ) : null}
        {withRadius && isMapReady && radius < 100 ? (
          <View>
            { radius === .5 ? 
              null :
              <>
                <Circle
                  center={{
                    latitude: fixedLat,
                    longitude: fixedLng,
                  }}
                  radius={radius * 1000} // in meters
                  strokeWidth={1}
                  strokeColor={'rgba(255,212,0,.1)'}
                  fillColor={'rgba(255,212,0,.1)'}
                  ref={circleRef}
                />
                <Circle
                  center={{
                    latitude: fixedLat,
                    longitude: fixedLng,
                  }}
                  radius={(radius * 1000) / 2}
                  strokeWidth={1}
                  strokeColor={'rgba(255,212,0,.1)'}
                  fillColor={'rgba(255,212,0,.1)'}
                  ref={circleRef}
                />
              </>
            }
            <Circle
              center={{
                latitude: fixedLat,
                longitude: fixedLng,
              }}
              radius={(radius * 1000) / 4}
              strokeWidth={1}
              strokeColor={'rgba(255,212,0,.18)'}
              fillColor={'rgba(255,212,0,.18)'}
              ref={circleRef}
            />
            {/* <Marker
              coordinate={{
                latitude: fixedLat,
                longitude: fixedLng,
              }}
              style={{ marginTop: (radius * 1000) / 4  }}
            >
              <AppText customStyle={{ top: 0 }}>{radius / 4} KM</AppText>
            </Marker> */}
            {/* </Circle> */}
          </View>
        ) : null}
      </MapView>
      <View style={styles.markerFixed}>
        { customMarker ? customMarker :
          radiusMarker ? (
            <TouchableOpacity 
              onPress={onMarkPress} 
              activeOpacity={.7}
              style={{ marginTop: normalize(25), marginLeft: normalize(5) }}
            >
              <PinBee width={normalize(38)} height={normalize(38)} />
            </TouchableOpacity>
          ) : <MapMarker width={normalize(48)} height={normalize(48)} />
        }
      </View>
    </View>
  );
};

// define your st
const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapView: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  markerFixed: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    marginLeft: normalize(-24),
    marginTop: Platform.os === 'ios' ? normalize(-65) : normalize(-48)
  }
});
//make this component available to the app
export default MapComponent;
