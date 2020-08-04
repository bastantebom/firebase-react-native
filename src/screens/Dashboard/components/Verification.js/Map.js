import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import { AppInput, PaddingView, AppText, MapComponent, TransitionIndicator } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight
} from '@/assets/images/icons';
import Config from '@/services/Config';
import Geocoder from 'react-native-geocoding';
import {useNavigation} from '@react-navigation/native';


export const VerifyMap = ({back}, route) => {
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
    <SafeAreaView style={{flex: 1}}>
      <View
        style={styles.modalHeader}>
        <TouchableOpacity
          onPress={back}
          activeOpacity={0.7}
          style={{position: 'absolute', left: 0}}
        >
          <HeaderBackGray width={normalize(16)} height={normalize(16)} />
        </TouchableOpacity>
        <AppText textStyle="body3">Add an Address</AppText>
      </View>
      <MapComponent
        // latitude={route?.route?.params.latitude}
        // longitude={route?.route?.params.longitude}
        latitude={37.78825}
        longitude={-122.4324}
        reCenter={newCoords}
        onRegionChange={(region) => {
          onRegionChange(region);
        }}
        withCurrentMarker={true}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  } 
})
