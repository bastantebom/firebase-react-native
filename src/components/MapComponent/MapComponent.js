//import liraries
import React from 'react';
import MapView, {Marker} from 'react-native-maps';

// create a component
const MapComponent = ({latitude, longitude}) => {
  return (
    <MapView
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
        latitudeDelta: 0.062,
        longitudeDelta: 0.061,
      }}>
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
