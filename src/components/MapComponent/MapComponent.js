//import liraries
import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {MapMarker} from '@/assets/images/icons';
import {normalize} from '@/globals';

// create a component
const MapComponent = ({latitude, longitude, onRegionChange}) => {
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
          visibility: 'off',
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

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        customMapStyle={mapStyle}
        zoomEnabled={true}
        onRegionChangeComplete={(region) => {
          onRegionChange(region);
        }}
        scrollEnabled={true}
        showsScale={true}
      />
      <View style={styles.markerFixed}>
        <MapMarker width={normalize(56)} height={normalize(56)} />
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
    bottom: '50%',
    marginLeft: -28,
    marginTop: -48,
  },
});
//make this component available to the app
export default MapComponent;
