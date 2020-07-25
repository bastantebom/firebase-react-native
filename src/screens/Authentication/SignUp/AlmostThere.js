//import liraries
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
//import LocationPin from '@/assets/images/icons/';

// create a component
const AlmostThere = () => {
  const [initialLocation, setInitialLocation] = useState();
  const [isLocationReady, setIsLocationReady] = useState(false);

  function findCoordinates() {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position.coords);
        setInitialLocation(initialPosition);
        setIsLocationReady(true);
        //console.log(initialLocation);
      },
      (error) => console.log('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  useEffect(() => {
    // exit early when we reach 0
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'whenInUse',
    });
    Geolocation.requestAuthorization();

    findCoordinates();
  });

  return (
    <>
      {isLocationReady ? (
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: 50,
              paddingTop: 50,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <Text>{JSON.parse(initialLocation).latitude}</Text>
          </View>
          <View style={{flex: 1}}>
            <MapView
              style={{
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
              }}
              initialRegion={{
                latitude: JSON.parse(initialLocation).latitude,
                longitude: JSON.parse(initialLocation).longitude,
                latitudeDelta: 0.0052,
                longitudeDelta: 0.0051,
              }}>
              <Marker
                coordinate={{
                  latitude: JSON.parse(initialLocation).latitude,
                  longitude: JSON.parse(initialLocation).longitude,
                }}
                image={require('@/assets/images/icons/Navigation.png')}></Marker>
            </MapView>
          </View>
        </View>
      ) : null}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default AlmostThere;
