//import liraries
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';

//import Geolocation from '@react-native-community/geolocation';
import Config from '@/services/Config';
import Geocoder from 'react-native-geocoding';
import MapComponent from '@/components/MapComponent/MapComponent';
import {
  AppText,
  AppButton,
  TransitionIndicator,
  ScreenHeaderTitle,
} from '@/components';
import {Colors} from '@/globals';

import GooglePlacesInput from '@/components/LocationSearchInput';

import {NavigationPin, Close} from '@/assets/images/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useNavigation} from '@react-navigation/native';
import SignUpService from '@/services/SignUpService';
import auth from '@react-native-firebase/auth';

// create a component
const AlmostThereMap = (route) => {
  const navigation = useNavigation();
  const [changeMapAddress, setChangeMapAddress] = useState('');
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  Geocoder.init(Config.apiKey);
  const [newCoords, setNewCoords] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });

  const onRegionChange = (region) => {
    //console.log(region);
    getStringAddress(region);
    setButtonDisabled(false);
    setButtonStyle({});
  };

  const getStringAddress = (location) => {
    // console.log(
    //   'dumadaan sa Get Sstring' +
    //     route?.route?.params?.latitude +
    //     ' ' +
    //     route?.route?.params?.longitude,
    // );
    Geocoder.from(location.latitude, location.longitude)
      .then((json) => {
        console.log(json);
        const addressComponent = json.results[1].formatted_address;
        const arrayToExtract =
          json.results.length == 12
            ? 7
            : json.results.length == 11
            ? 6
            : json.results.length == 10
            ? 6
            : json.results.length == 9
            ? 4
            : json.results.length == 8
            ? 3
            : json.results.length < 8
            ? 2
            : 2;

        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: location.latitude,
            longitude: location.longitude,
            city: json.results[arrayToExtract].address_components[0].long_name,
            province:
              json.results[arrayToExtract].address_components[1].long_name,
            country: 'Philippines',
          },
        });
        setChangeMapAddress(addressComponent);
        console.log(addressComponents);
      })
      .catch((error) => console.warn(error));
    console.log(addressComponents);
  };

  const getPositionFromString = (address) => {
    Geocoder.from(address)
      .then((json) => {
        var location = json.results[0].geometry.location;
        console.log('New Coords');
        setNewCoords(location);
        setButtonDisabled(false);
        setButtonStyle({});
      })
      .catch((error) => console.warn(error));
  };

  const onSearchLocationHandler = (data) => {
    console.log(data);
    setChangeMapAddress(data);
    getStringAddress(data);
    getPositionFromString(data);
  };

  const saveRefineLocation = () => {
    setIsScreenLoading(true);
    if (route?.route?.params?.uid) {
      SignUpService.saveLocation({
        uid: route?.route?.params?.uid,
        ...addressComponents,
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
    console.log(route?.route?.params?.latitude);
    if (route?.route?.params?.country && route?.route?.params?.city) {
      setAddressComponents({
        ...addressComponents,
        ...{
          latitude: route?.route?.params?.latitude,
          longitude: route?.route?.params?.longitude,
          city: route?.route?.params?.city,
          province: route?.route?.params?.province,
          country: route?.route?.params?.country,
        },
      });
    }
  }, []);

  return (
    <>
      <TransitionIndicator loading={isScreenLoading} />
      <View style={{flex: 1}}>
        <SafeAreaView>
          <View style={{padding: 24}}>
            <ScreenHeaderTitle
              title="Select location"
              close={() => {
                navigation.goBack();
              }}
            />
          </View>
        </SafeAreaView>
        <View style={{flex: 1, position: 'relative'}}>
          {route?.route?.params.address ? (
            <>
              <View style={styles.textInputWrapper}>
                <GooglePlacesInput
                  onResultsClick={(data) => {
                    onSearchLocationHandler(data);
                    //alert(data);
                  }}
                  onClearInput={(textValue) => {
                    console.log('setvalue');
                  }}
                  currentValue={
                    changeMapAddress.length > 0
                      ? changeMapAddress
                      : route?.route?.params.address
                  }
                />
              </View>

              <MapComponent
                latitude={route?.route?.params.latitude}
                longitude={route?.route?.params.longitude}
                reCenter={newCoords}
                onRegionChange={(region) => {
                  onRegionChange(region);
                }}
                withCurrentMarker={true}
              />
              <View style={styles.buttonWrapper}>
                <AppButton
                  text="Confirm"
                  type="primary"
                  height="xl"
                  customStyle={buttonStyle}
                  disabled={buttonDisabled}
                  onPress={() => {
                    saveRefineLocation();
                  }}
                />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  header: {
    height: 88,
  },
  headerWrapper: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 16,
  },

  headerClose: {
    //flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSkip: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  textInputWrapper: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    elevation: 100,
  },

  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    elevation: 100,
  },

  textInput: {
    backgroundColor: Colors.neutralsWhite,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  navIcon: {
    position: 'absolute',
    top: 45,
    left: 45,
    zIndex: 101,
    elevation: 101,
  },
});

export default AlmostThereMap;
