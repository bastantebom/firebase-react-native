//import liraries
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Platform, Image} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {MapMarker} from '@/assets/images/icons';
import {normalize} from '@/globals';

// create a component
const MapComponent = ({
  latitude,
  longitude,
  onRegionChange,
  withCurrentMarker,
  reCenter,
}) => {
  const circleRef = useRef(null);
  const mapViewRef = useRef(null);

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
    let r = {
      latitude: reCenter.lat,
      longitude: reCenter.lng,
      latitudeDelta: 0.00082,
      longitudeDelta: 0.00082,
    };
    mapViewRef.current.animateToRegion(r, 2000);
  }, [reCenter.lat]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.00082,
          longitudeDelta: 0.00082,
        }}
        customMapStyle={mapStyle}
        zoomEnabled={true}
        onRegionChangeComplete={(region) => {
          onRegionChange(region);
        }}
        scrollEnabled={true}
        showsScale={true}
        showsBuildings={true}
        loadingEnabled={true}>
        {withCurrentMarker ? (
          <>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              centerOffset={(1, 1)}>
              <View>
                <Image
                  source={require('@/assets/images/icons/current_location.png')}
                  style={{height: 20, width: 20}}
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
      </MapView>
      <View style={styles.markerFixed}>
        <MapMarker width={normalize(48)} height={normalize(48)} />
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
    marginTop: normalize(-65),
  },
});
//make this component available to the app
export default MapComponent;
