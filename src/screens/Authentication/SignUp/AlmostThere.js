//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '@/globals';

import {AppViewContainer, AppText, AppInput} from '@/components';

import {NavigationArrow, NavigationPin} from '@/assets/images/icons';
import LocationImage from '@/assets/images/location.svg';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {useNavigation} from '@react-navigation/native';

import Config from '@/services/Config';
import SignUpService from '@/services/SignUpService';

import auth from '@react-native-firebase/auth';

// create a component
const AlmostThere = (route) => {
  const navigation = useNavigation();
  const [initialLocation, setInitialLocation] = useState({});
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [stringAddress, setStringAddress] = useState('');
  const [isAllowed, setIsAllowed] = useState();

  const getStringAddress = (location) => {
    //console.log(location);
    Geocoder.init(Config.apiKey);
    Geocoder.from(JSON.parse(location).latitude, JSON.parse(location).longitude)
      .then((json) => {
        const addressComponent = json.results[1].formatted_address;
        //console.log(json);
        setStringAddress(addressComponent);
        setIsLocationReady(true);
        //console.log('is location allowed ' + isAllowed);
      })
      .catch((error) => console.warn(error));
  };

  const onChangeAddressHandler = () => {
    if (isAllowed && isLocationReady) {
      //console.log('isAllowed in Use Effect ' + isAllowed);
      //console.log(initialLocation);
      //console.log(isLocationReady);
      //console.log(stringAddress);
      //"altitude":0,"altitudeAccuracy":-1,"latitude":13.749014,"accuracy":5,"longitude":121.072939,"heading":-1,"speed":-1
      const toPassString = {
        uid: route?.route?.params?.uid,
        address: stringAddress,
        latitude: JSON.parse(initialLocation).latitude,
        longitude: JSON.parse(initialLocation).longitude,
      };
      //console.log(toPassString);
      navigation.navigate('AlmostThereMap', {...toPassString});
    }
  };

  function findCoordinates() {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position.coords);
        setInitialLocation(initialPosition);
        setIsAllowed(true);
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
        setIsAllowed(false);
        getStringAddress(initialPosition);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  const saveLocationHandler = (address) => {
    if (route?.route?.params?.uid) {
      SignUpService.saveLocation({
        uid: route?.route?.params?.uid,
        location: address,
      })
        .then((response) => {
          console.log('AFTER SAVE LOCATION');
          console.log(response);
          if (response.success) {
            signInAfterSaveLocation();
          }
        })
        .catch((error) => {
          console.log('With Error in the API SignUp ' + error);
        });
    } else {
      navigation.push('Dashboard');
    }
  };

  const signInAfterSaveLocation = () => {
    if (route?.route?.params?.custom_token) {
      auth()
        .signInWithCustomToken(route?.route?.params?.custom_token)
        .then(() => {
          navigation.push('Dashboard');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigation.push('Dashboard');
    }
  };

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
  }, []);

  useEffect(() => {
    //console.log('isAllowed in Use Effect ' + isAllowed);
    //setIsAllowed(() => isAllowed);
    if (isAllowed !== undefined && isLocationReady) {
      //console.log('isAllowed in Use Effect ' + isAllowed);
      //console.log(initialLocation);
      //console.log(isLocationReady);
      //console.log(stringAddress);
      if (!isAllowed) {
        console.log(route?.route?.params?.uid);
        console.log(
          'API Call to save current location which is default (LUNETA PARK)',
        );
        saveLocationHandler(stringAddress);
      }
    }
  }, [isAllowed, isLocationReady]);

  return (
    <>
      <AppViewContainer paddingSize={3} customStyle={styles.container}>
        <View style={styles.skipContainer}>
          {isLocationReady ? (
            <TouchableOpacity
              onPress={() => {
                saveLocationHandler(stringAddress);
              }}>
              <AppText textStyle="body2">Skip</AppText>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.contentEbony}
            />
          )}
        </View>

        <View style={styles.almostThereImageContainer}>
          <LocationImage width={80} height={80} />
        </View>

        <AppText customStyle={styles.almostThereText} textStyle="display5">
          Almost there!
        </AppText>

        <AppText customStyle={styles.almostThereSubText} textStyle="body2">
          Let us know your current location so we can show you services and
          goods nearby. You may change this later on.
        </AppText>

        <View style={styles.textInputWrapper}>
          <View style={styles.navIcon}>
            <NavigationPin width={24} height={24} />
          </View>
          <AppInput
            customStyle={styles.textInput}
            placeholder="Enter street address or city"
          />
        </View>
        {isLocationReady ? (
          <>
            <TouchableOpacity
              onPress={() => {
                onChangeAddressHandler();
              }}>
              <View style={styles.currentLocationContainer}>
                <NavigationArrow width={24} height={24} />
                <AppText
                  textStyle="promo"
                  customStyle={styles.currentLocationLabel}>
                  Your current location
                </AppText>
              </View>
              <View>
                <AppText textStyle="body3" customStyle={styles.currentAddress}>
                  {stringAddress}
                </AppText>
              </View>{' '}
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.contentEbony}
          />
        )}
      </AppViewContainer>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    alignItems: 'flex-end',
  },
  almostThereImageContainer: {marginBottom: 32},
  almostThereText: {
    marginBottom: 8,
  },

  almostThereSubText: {
    marginBottom: 32,
  },

  textInputWrapper: {
    position: 'relative',
    marginBottom: 24,
  },

  navIcon: {
    position: 'absolute',
    left: 16,
    top: 15,
  },

  textInput: {
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    paddingLeft: 40,
    paddingRight: 39,
    fontSize: 16,
  },

  currentLocation: {
    marginTop: 24,
  },

  currentLocationLabel: {
    paddingLeft: 8,
  },

  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },

  currentAddress: {
    paddingLeft: 48,
  },
});

//make this component available to the app
export default AlmostThere;
