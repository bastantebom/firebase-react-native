//import liraries
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import MapComponent from '@/components/MapComponent/MapComponent';
import Geocoder from 'react-native-geocoding';
//import LocationPin from '@/assets/images/icons/';

// create a component
const AlmostThereMap = () => {
  const [initialLocation, setInitialLocation] = useState({});
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [stringAddress, setStringAddress] = useState('');

  const getStringAddress = (location) => {
    //console.log(location);
    Geocoder.init('AIzaSyCu10vZtdRHmJ7bxnebSSj7u1LFeMV4GUs');
    Geocoder.from(JSON.parse(location).latitude, JSON.parse(location).longitude)
      .then((json) => {
        const addressComponent = json.results[2].formatted_address;
        console.log(json);
        setStringAddress(addressComponent);
        setIsLocationReady(true);
      })
      .catch((error) => console.warn(error));
  };

  function findCoordinates() {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position.coords);
        setInitialLocation(initialPosition);
        getStringAddress(initialPosition);

        //console.log(initialLocation);
      },
      (error) => {
        console.log('Error', JSON.stringify(error));
        //set to LUNETA PARK IF Permission Denied
        const initialPosition = JSON.stringify({
          altitude: 0,
          altitudeAccuracy: -1,
          latitude: 14.5831,
          accuracy: 5,
          longitude: 120.9794,
          heading: -1,
          speed: -1,
        });
        setInitialLocation(initialPosition);
        getStringAddress(initialPosition);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  useEffect(() => {
    // exit early when we reach 0
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    } else {
    }
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
            <Text>{stringAddress}</Text>
          </View>
          <View style={{flex: 1}}>
            <MapComponent
              latitude={JSON.parse(initialLocation).latitude}
              longitude={JSON.parse(initialLocation).longitude}
            />
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
export default AlmostThereMap;
