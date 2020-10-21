//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Colors, normalize} from '@/globals';

import {AppText, AppButton, TransitionIndicator} from '@/components';

import {NavigationArrow, NavigationPin} from '@/assets/images/icons';
import LocationImage from '@/assets/images/location.svg';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {useNavigation} from '@react-navigation/native';

//import GooglePlacesInput from '@/components/LocationSearchInput';

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
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    full_address: '',
    default: true,
  });

  //Address Components

  const getStringAddress = (location) => {
    //console.log(location);
    Geocoder.init(Config.apiKey);
    Geocoder.from(JSON.parse(location).latitude, JSON.parse(location).longitude)
      .then((json) => {
        const addressComponent = json.results[1].formatted_address;
        const arrayToExtract =
          json.results.length == 14
            ? 9
            : json.results.length == 13
            ? 8
            : json.results.length == 12
            ? 7
            : json.results.length == 11
            ? 6
            : json.results.length == 10
            ? 5
            : json.results.length == 9
            ? 4
            : json.results.length == 8
            ? 3
            : json.results.length < 8
            ? 2
            : 2;
        const splitAddress = json.results[
          arrayToExtract
        ].formatted_address.split(',');
        setAddressComponents({
          ...addressComponents,
          ...{
            //latitude: JSON.parse(location).latitude,
            //longitude: JSON.parse(location).longitude,
            city: splitAddress[0],
            province: splitAddress[1],
            country: splitAddress[2],
            full_address: addressComponent,
          },
        });

        setStringAddress(addressComponent);
        //console.log(addressComponents);
        setIsLocationReady(true);
      })
      .catch((error) => console.warn(error));
  };

  const getLongLatFromString = () => {
    if (stringAddress.trim().length > 0) {
      console.log(stringAddress);
      saveLocationHandler(addressComponents);
    }
  };

  const onCurrentLocationClick = () => {
    if (isAllowed && isLocationReady) {
      //"altitude":0,"altitudeAccuracy":-1,"latitude":13.749014,"accuracy":5,"longitude":121.072939,"heading":-1,"speed":-1
      const toPassString = {
        uid: route?.route?.params?.uid,
        custom_token: route?.route?.params?.custom_token,
        address: stringAddress,
        latitude:
          parseFloat(JSON.parse(initialLocation).latitude) +
          parseFloat(0.00059),
        longitude: JSON.parse(initialLocation).longitude,
      };
      //console.log(toPassString);
      navigation.navigate('AlmostThereMap', {
        ...toPassString,
        ...addressComponents,
      });
    }
  };

  function findCoordinates() {
    Geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position.coords);
        setInitialLocation(initialPosition);
        setIsAllowed(true);
        getStringAddress(initialPosition);
        console.log('Almost There Page');
        console.log(initialPosition);
      },
      (error) => {
        console.log('Error', JSON.stringify(error));

        const initialPosition = JSON.stringify({
          altitude: 0,
          altitudeAccuracy: -1,
          latitude: 14.582919,
          accuracy: 5,
          longitude: 120.979683,
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

  const saveLocationHandler = (fullAddress) => {
    //console.log(fullAddress);
    setIsScreenLoading(true);
    if (route?.route?.params?.uid) {
      SignUpService.saveLocation({
        uid: route?.route?.params?.uid,
        latitude: parseFloat(JSON.parse(initialLocation).latitude),
        longitude: JSON.parse(initialLocation).longitude,
        ...fullAddress,
      })
        .then((response) => {
          if (response.success) {
            setIsScreenLoading(false);
            signInAfterSaveLocation();
          }
        })
        .catch((error) => {
          setIsScreenLoading(false);
          console.log(error);
        });
    } else {
      setIsScreenLoading(false);
      navigation.push('TabStack');
    }
  };

  const signInAfterSaveLocation = () => {
    if (route?.route?.params?.custom_token) {
      auth()
        .signInWithCustomToken(route?.route?.params?.custom_token)
        .then(() => {
          setIsScreenLoading(false);
          navigation.push('TabStack');
        })
        .catch((err) => {
          setIsScreenLoading(false);
          console.log(err);
        });
    } else {
      setIsScreenLoading(false);
      navigation.push('TabStack');
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
    if (
      isAllowed !== undefined &&
      isLocationReady &&
      addressComponents.latitude !== 0
    ) {
      if (!isAllowed) {
        console.log(route?.route?.params?.uid);
        console.log(
          'API Call to save current location which is default (LUNETA PARK)',
        );
        saveLocationHandler(addressComponents);
      }
    }
  }, [isAllowed, isLocationReady, addressComponents.latitude]);

  return (
    <>
      <View style={styles.almostContainer}>
        <TransitionIndicator loading={isScreenLoading} />

        <View style={styles.almostThereImageContainer}>
          <LocationImage width={normalize(80)} height={normalize(80)} />
        </View>

        <AppText customStyle={styles.almostThereText} textStyle="display5">
          Almost there!
        </AppText>

        <AppText customStyle={styles.almostThereSubText} textStyle="body2">
          Let us know your current location so we can show you services and
          goods nearby. You may change this later on.
        </AppText>

        {isLocationReady ? (
          <>
            <View style={styles.bottomWrapper}>
              <View style={styles.currentLocationContainer}>
                <NavigationArrow width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="promo"
                  customStyle={styles.currentLocationLabel}>
                  Your current location
                </AppText>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    onCurrentLocationClick();
                  }}>
                  <AppText
                    textStyle="body3"
                    customStyle={styles.currentAddress}>
                    {stringAddress}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.contentEbony}
          />
        )}
        <View style={styles.buttonWrapper}>
          <AppButton
            text="Next"
            type="primary"
            height="xl"
            customStyle={styles.buttonStyle}
            onPress={() => {
              getLongLatFromString();
            }}
            //loading={isLoading}
          />
        </View>
      </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  almostContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.neutralsWhite,
    padding: 24,
    paddingTop: 50,
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

  textWrapper: {
    height: 70,
    //backgroundColor: 'blue',
  },

  currentLocationLabel: {
    paddingLeft: 8,
    zIndex: 1,
    elevation: 1,
  },

  bottomWrapper: {
    justifyContent: 'flex-start',
    marginBottom: normalize(8),
    zIndex: -1,
    elevation: -1,
  },

  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },

  currentAddress: {
    paddingLeft: 48,
    zIndex: 1,
    elevation: 1,
  },

  buttonWrapper: {flex: 1, justifyContent: 'flex-end', marginBottom: 0},
});

//make this component available to the app
export default AlmostThere;
