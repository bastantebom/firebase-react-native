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
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      }}
      mapType={'standard'}
      zoomEnabled={true}
      scrollEnabled={true}
      showsScale={true}>
      <MapView.Circle
        key={(longitude + latitude).toString()}
        center={{latitude: latitude, longitude: longitude}}
        radius={500}
        strokeWidth={0.1}
        strokeColor={'rgba(255, 212, 0,0.18)'}
        fillColor={'rgba(255, 212, 0,0.18)'}
        //onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
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
