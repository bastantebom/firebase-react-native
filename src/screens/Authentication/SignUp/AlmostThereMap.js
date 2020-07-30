//import liraries
import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//import Geolocation from '@react-native-community/geolocation';
import Config from '@/services/Config';
import Geocoder from 'react-native-geocoding';
import MapComponent from '@/components/MapComponent/MapComponent';
import {AppText, AppButton, TransitionIndicator} from '@/components';
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

  const onRegionChange = (region) => {
    //console.log(region);
    getStringAddress(region);
    setButtonDisabled(false);
    setButtonStyle({});
  };

  const getStringAddress = (location) => {
    Geocoder.from(location.latitude, location.longitude)
      .then((json) => {
        const addressComponent = json.results[1].formatted_address;
        setChangeMapAddress(addressComponent);
      })
      .catch((error) => console.warn(error));
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
    //console.log(JSON.stringify(data));
    setChangeMapAddress(data);
    getPositionFromString(data);
  };

  const saveRefineLocation = () => {
    setIsScreenLoading(true);
    if (route?.route?.params?.uid) {
      SignUpService.saveLocation({
        uid: route?.route?.params?.uid,
        location: changeMapAddress,
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

  return (
    <>
      <TransitionIndicator loading={isScreenLoading} />
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerWrapper}>
            <View style={styles.headerClose}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Close width={24} height={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerText}>
              <AppText textStyle="body2">Use current location</AppText>
              <Text>{buttonDisabled ? newCoords.lng : null}</Text>
            </View>
            <View style={styles.headerSkip}>
              <TouchableOpacity>
                <AppText textStyle="promo">Skip</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{flex: 1, position: 'relative'}}>
          {route?.route?.params.address ? (
            <>
              <View style={styles.textInputWrapper}>
                <View style={styles.navIcon}>
                  <NavigationPin width={24} height={24} />
                </View>
                <GooglePlacesInput
                  onResultsClick={(data) => {
                    onSearchLocationHandler(data);
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 4,
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
    position: 'absolute',
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
  },

  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
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
    left: 40,
    top: 35,
    zIndex: 101,
  },
});

export default AlmostThereMap;
