import React, {useState} from 'react';
import {TouchableOpacity, View, StyleSheet, SafeAreaView} from 'react-native';
import Geocoder from 'react-native-geocoding';
//import {useNavigation} from '@react-navigation/native';

import {HeaderBackGray} from '@/assets/images/icons';
import Config from '@/services/Config';
import GooglePlacesInput from '@/components/LocationSearchInput';
import {PaddingView, AppText, MapComponent, AppButton} from '@/components';
import {Colors, normalize} from '@/globals';
//import {UserContext} from '@/context/UserContext';

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //marginBottom: 32,
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
  textInputWrapper: {
    width: '100%',
    flex: 0,
    position: 'absolute',
    padding: 24,
    alignItems: 'stretch',
    zIndex: 100,
    top: 70,
    marginTop: 25,
    // elevation: 100,
  },
});

// create a component
const StoreLocation = ({back, address, changeFromMapHandler}, route) => {
  //const {userInfo, setUserInfo} = useContext(UserContext);
  //const navigation = useNavigation();
  const [changeMapAddress, setChangeMapAddress] = useState('');
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  Geocoder.init(Config.apiKey);
  const [newCoords, setNewCoords] = useState({});
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });
  //const [isScreenLoading, setIsScreenLoading] = useState(false);

  const onRegionChange = (region) => {
    //console.log(region);
    getStringAddress(region);
    //setButtonDisabled(false);
    setButtonDisabled(false);
    setButtonStyle({});
  };

  const getStringAddress = (location) => {
    Geocoder.from(location.latitude, location.longitude)
      .then((json) => {
        const addressComponent = json.results[1].formatted_address;
        const arrayToExtract =
          json.results.length == 12
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

        setChangeMapAddress(addressComponent);
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
          //setChangeMapAddress(addressComponent);
        });
      })
      .catch((error) => console.warn(error));
    //console.log(addressComponents);
    //setButtonDisabled(false);
    //setButtonStyle({});
  };

  const getPositionFromString = (address) => {
    //console.log('Dito Sya');
    Geocoder.from(address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        //console.log(location);
        const convertedLocation = {
          latitude: location.lat,
          longitude: location.lng,
        };
        getStringAddress(convertedLocation);
        setNewCoords(location);
        setButtonDisabled(false);
        setButtonStyle({});
      })
      .catch((error) => console.warn(error));
  };

  const onSearchLocationHandler = (data) => {
    //console.log(JSON.stringify(data));
    //setChangeMapAddress(data);
    //getStringAddress(data);
    getPositionFromString(data);
  };

  const saveRefineLocation = () => {
    // const dataToUpdate = {
    //   address: addressComponents,
    // };
    //setUserInfo({...userInfo, ...dataToUpdate});
    changeFromMapHandler(addressComponents);
    back();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={back}
            activeOpacity={0.7}
            style={{position: 'absolute', left: 0}}>
            <HeaderBackGray width={normalize(16)} height={normalize(16)} />
          </TouchableOpacity>
          <AppText textStyle="body3">Address</AppText>
        </View>
      </PaddingView>
      {/* <View> */}
      <View style={styles.textInputWrapper}>
        <GooglePlacesInput
          onResultsClick={(data) => {
            //alert(data);
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
        // latitude={latitude}
        // longitude={longitude}
        latitude={address.latitude}
        longitude={address.longitude}
        reCenter={newCoords}
        onRegionChange={(region) => {
          onRegionChange(region);
        }}
        withCurrentMarker={false}
      />
      <View style={styles.buttonWrapper}>
        <AppButton
          text="Apply"
          type="primary"
          height="xl"
          customStyle={buttonStyle}
          disabled={buttonDisabled}
          onPress={() => {
            saveRefineLocation();
          }}
        />
      </View>
      {/* </View> */}
    </SafeAreaView>
  );
};

//make this component available to the app
export default StoreLocation;
