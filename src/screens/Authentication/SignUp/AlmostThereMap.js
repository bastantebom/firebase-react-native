//import liraries
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';

//import Geolocation from '@react-native-community/geolocation';
import MapComponent from '@/components/MapComponent/MapComponent';
import {AppViewContainer, AppText, AppInput, AppButton} from '@/components';
import {Colors} from '@/globals';

import {NavigationArrow, NavigationPin, Close} from '@/assets/images/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useNavigation} from '@react-navigation/native';
//import Geocoder from 'react-native-geocoding';
//import LocationPin from '@/assets/images/icons/';

// create a component
const AlmostThereMap = (route) => {
  const navigation = useNavigation();
  return (
    <>
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
                <AppInput
                  customStyle={styles.textInput}
                  placeholder="Enter street address or city"
                  value={route?.route?.params.address}
                />
              </View>
              <MapComponent
                latitude={route?.route?.params.latitude}
                longitude={route?.route?.params.longitude}
              />
              <View style={styles.buttonWrapper}>
                <AppButton
                  text="Confirm"
                  type="primary"
                  height="xl"
                  //customStyle={{...styles.customButtonStyle, ...buttonStyle}}
                  onPress={() => {
                    //signUpEmail(signUpForm);
                  }}
                  //loading={isLoading}
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

  textInput: {backgroundColor: Colors.neutralsWhite, paddingLeft: 32},
  navIcon: {
    position: 'absolute',
    left: 40,
    top: 40,
    zIndex: 101,
  },
});

//make this component available to the app
export default AlmostThereMap;
