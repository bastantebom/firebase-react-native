//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Colors, normalize} from '@/globals';

import {
  AppViewContainer,
  AppText,
  AppInput,
  AppButton,
  TransitionIndicator,
} from '@/components';

import {NavigationArrow, NavigationPin} from '@/assets/images/icons';
import LocationImage from '@/assets/images/location.svg';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {useNavigation} from '@react-navigation/native';

import GooglePlacesInput from '@/components/LocationSearchInput';

import Config from '@/services/Config';
import SignUpService from '@/services/SignUpService';

import auth from '@react-native-firebase/auth';

// create a component
const AlmostThere = (route) => {
  const navigation = useNavigation();
  const [initialLocation, setInitialLocation] = useState({});
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [stringAddress, setStringAddress] = useState('');
  const [searchStringAddress, setSearchStringAddress] = useState('');
  const [isAllowed, setIsAllowed] = useState();
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

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

  const getLongLatFromString = () => {
    if (searchStringAddress.trim().length > 0) {
      console.log(searchStringAddress);
      saveLocationHandler(searchStringAddress);
    }
  };

  const onCurrentLocationClick = () => {
    if (isAllowed && isLocationReady) {
      //"altitude":0,"altitudeAccuracy":-1,"latitude":13.749014,"accuracy":5,"longitude":121.072939,"heading":-1,"speed":-1
      const toPassString = {
        uid: route?.route?.params?.uid,
        address: stringAddress,
        latitude:
          parseFloat(JSON.parse(initialLocation).latitude) + parseFloat(0.001),
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
        console.log('Almost There Page');
        console.log(initialPosition);
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
    setIsScreenLoading(true);
    if (route?.route?.params?.uid) {
      SignUpService.saveLocation({
        uid: route?.route?.params?.uid,
        location: address,
      })
        .then((response) => {
          if (response.success) {
            signInAfterSaveLocation();
          }
        })
        .catch((error) => {
          setIsScreenLoading(false);
          console.log('With Error in the API SignUp ' + error);
        });
    } else {
      setIsScreenLoading(false);
      navigation.push('Dashboard');
    }
  };

  const signInAfterSaveLocation = () => {
    if (route?.route?.params?.custom_token) {
      auth()
        .signInWithCustomToken(route?.route?.params?.custom_token)
        .then(() => {
          setIsScreenLoading(false);
          navigation.push('Dashboard');
        })
        .catch((err) => {
          setIsScreenLoading(false);
          console.log(err);
        });
    } else {
      setIsScreenLoading(false);
      navigation.push('Dashboard');
    }
  };

  const onSearchLocationHandler = (data) => {
    //console.log(JSON.stringify(data));
    setSearchStringAddress(data);
    setButtonDisabled(false);
    setButtonStyle({});
  };

  const onClearSearchAddress = (textValue) => {
    if (textValue.trim().length < 1) {
      setSearchStringAddress('');
      setButtonDisabled(true);
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      });
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
    if (isAllowed !== undefined && isLocationReady) {
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
      <View style={styles.almostContainer}>
        <TransitionIndicator loading={isScreenLoading} />
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
          <LocationImage width={normalize(80)} height={normalize(80)} />
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
            <NavigationPin width={normalize(24)} height={normalize(24)} />
          </View>
          {/* <AppInput
            customStyle={styles.textInput}
            placeholder="Enter street address or city"
          /> */}
          <GooglePlacesInput
            onResultsClick={(data) => {
              onSearchLocationHandler(data);
            }}
            onClearInput={(textValue) => {
              onClearSearchAddress(textValue);
            }}
          />
        </View>

        {isLocationReady ? (
          <>
            <View style={styles.currentLocationContainer}>
              <NavigationArrow width={normalize(24)} height={normalize(24)} />
              <AppText
                textStyle="promo"
                customStyle={styles.currentLocationLabel}>
                Your current location
              </AppText>
            </View>
            <View>
              {searchStringAddress.length > 0 ? (
                <AppText></AppText>
              ) : (
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
              )}
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
            disabled={buttonDisabled}
            customStyle={{...styles.buttonStyle, ...buttonStyle}}
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

  textInputWrapper: {
    //position: 'relative',
    marginBottom: 24,
    zIndex: 9,
  },

  navIcon: {
    position: 'absolute',
    left: 16,
    top: 13,
    zIndex: 10,
    elevation: 10,
  },

  textInput: {
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    paddingLeft: 40,
    paddingRight: 39,
    fontSize: 16,
  },

  currentLocationLabel: {
    paddingLeft: 8,
    zIndex: 1,
    elevation: 1,
  },

  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    zIndex: 0,
    elevation: 0,
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
