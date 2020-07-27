//import liraries
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

// create a component
const MapComponent = ({latitude, longitude}) => {
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

  const onRegionChange = (region) => {
    console.log(region);
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
      }}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      }}
      customMapStyle={mapStyle}
      zoomEnabled={true}
      onRegionChangeComplete={onRegionChange}
      scrollEnabled={true}
      showsScale={true}>
      <MapView.Circle
        key={(longitude + latitude).toString()}
        center={{latitude: latitude, longitude: longitude}}
        radius={500}
        strokeWidth={0.1}
        strokeColor={'rgba(255, 212, 0,0.18)'}
        fillColor={'rgba(255, 212, 0,0.18)'}
      />
      <MapView.Circle
        key={(longitude + latitude + 10).toString()}
        center={{latitude: latitude, longitude: longitude}}
        radius={1000}
        strokeWidth={0.1}
        strokeColor={'rgba(255, 212, 0,0.1)'}
        fillColor={'rgba(255, 212, 0,0.1)'}
        //onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
      />
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        image={require('@/assets/images/icons/Navigation.png')}></Marker>
    </MapView>
  );
};

// define your st

//make this component available to the app
export default MapComponent;
