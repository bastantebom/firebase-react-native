import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

//import {useNavigation} from '@react-navigation/native';

import {CloseLight, HeaderBackGray, NavigationArrowAlt, PushPin} from '@/assets/images/icons';
import Config from '@/services/Config';
import GooglePlacesInput from '@/components/LocationSearchInput';
import {PaddingView, AppText, MapComponent, AppButton} from '@/components';
import {Colors, normalize} from '@/globals';
//import {UserContext} from '@/context/UserContext';
import Slider from '@react-native-community/slider';
import { RangeSlider } from '@/components/Slider/RangeSlider';

navigator.geolocation = require('@react-native-community/geolocation');

// create a component
const Location = ({back, address, changeFromMapHandler}, route) => {
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
  const [newLoc, setNewLoc] = useState({});
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });
  //const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [addressRunCount, setAddressRunCount] = useState(0);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [initialLocation, setInitialLocation] = useState({});
  const [stringAddress, setStringAddress] = useState('');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const [instructionVisible, setInstructionVisible] = useState(true)
  const [rangeValue, setRangeValue] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  const getSliderValue = (rangeValue) => {
    setRangeValue(rangeValue)
  }

  const onInputFocus = () => {
    setIsFocused(!isFocused)
  }

  const onInputBlur = () => {
    setIsFocused(false)
  }
    
  //MAP DRAG
  const onRegionChange = (region) => {
    console.log('addressRunCount ' + addressRunCount);

    if (addressRunCount === 0) {
      getStringAddress(region, null);
    } else {
      setAddressRunCount(addressRunCount - 1);
    }

    // console.log(region.latitude, 'onRegionChange')

    // Geolocation.getCurrentPosition(
    // (position) => {
    //   const currentLocation = position.coords;
    //   const location = ({
    //     latitude: currentLocation?.latitude,
    //     longitude: currentLocation?.longitude
    //   })

    //   if(location.latitude !== region.latitude && location.longitude !== region.longitude) {
    //     getStringAddress(currentLocation, null);
    //   }
    // })

    setButtonDisabled(false);
    setButtonStyle({});
  };

  const getPositionFromString = (address) => {
    //console.log('getPositionFromString ' + address);
    //console.log('getStringAddress ' + strAddress);

    Geocoder.from(address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        //console.log(location);
        const convertedLocation = {
          latitude: location.lat,
          longitude: location.lng,
        };
        getStringAddress(convertedLocation, address);
        setAddressRunCount(addressRunCount + 1);
        setNewCoords(location);
        setButtonDisabled(false);
        setButtonStyle({});
      })
      .catch((error) => console.warn(error));
  };

  const getStringAddress = (location, strAddress) => {
    Geocoder.from(location.latitude, location.longitude)
      .then((json) => {
        const stringMapDrag = json.results[1].formatted_address;
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
        setChangeMapAddress(strAddress ? strAddress : stringMapDrag);
        // console.log(changeMapAddress, 'changeMapAddress')
        const splitAddress = json.results[
          arrayToExtract
        ].formatted_address.split(',');
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
          // setChangeMapAddress(addressComponents);
        });
        setIsLocationReady(true);
        // console.log('getStringAddress fnc')
      })
      .catch((error) => console.warn(error));
    // console.log(addressComponents, 'addressComponents');
    // getPositionFromString(changeMapAddress)
    //setButtonDisabled(false);
    //setButtonStyle({});
  };

  //SEARCH ADDRESS
  const onSearchLocationHandler = (data) => {
    console.log('onSearchLocationHandler ' + data);
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

  function findCoordinates() {
    Geolocation.getCurrentPosition(
      (position) => {
        // const initialPosition = JSON.stringify(position.coords);
        const initialPosition = position.coords;
        setInitialLocation(initialPosition);
        const location = ({
          latitude: initialPosition?.latitude,
          longitude: initialPosition?.longitude
        })
        getStringAddress(location);

        Geocoder.from(location)
          .then((json) => {
            const location = json.results[0].geometry.location;
            //console.log(location);
            // const convertedLocation = {
            //   latitude: location.lat,
            //   longitude: location.lng,
            // };
            setAddressRunCount(addressRunCount + 1);
            setNewCoords(location);
          })
        .catch((error) => console.log(error));
      },
      (error) => {
        console.log('Error', JSON.stringify(error));

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
        // setIsAllowed(false);
        getStringAddress(initialPosition);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: isFocused ? normalize(150) : normalize(190) }}>
        <PaddingView paddingSize={2}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={back}
              activeOpacity={0.7}
              style={{position: 'absolute', left: 0}}>
              <HeaderBackGray width={normalize(16)} height={normalize(16)} />
            </TouchableOpacity>
            <AppText textStyle="body3">Search Location</AppText>
          </View>
        </PaddingView>
        <View style={styles.textInputWrapper}>
          <GooglePlacesInput
            onResultsClick={(data) => {
              // alert(data);
              // console.log('nag search');

              onSearchLocationHandler(data);
              //alert(data);
            }}
            onClearInput={() => {}}
            currentValue={changeMapAddress}
            onInputFocus={onInputFocus}
            // onInputBlur={onInputBlur}
            customListViewStyle={{ 
              top: normalize(68),
              marginLeft: normalize(0),
              marginRight: normalize(0),
              height: Dimensions.get('window').height -  normalize(170),
              width: Dimensions.get('window').width,
              left: -8,
              backgroundColor: Colors.neutralsZirconLight
            }}
            placeholder="Search Your Location"
            debounce={1500}
          />
        </View>
        {isFocused ? (
          <TouchableOpacity 
            activeOpacity={.7}
            onPress={() => findCoordinates()}
            style={[styles.navigationArrow]}
          >
            <NavigationArrowAlt width={normalize(20)} height={normalize(20)} />
            <AppText
              textStyle="caption"
              color={Colors.contentOcean}
              customStyle={{ marginLeft: 10 }}
            >
              Use current location
            </AppText>
          </TouchableOpacity>
        ) : (
          // <ActivityIndicator
          //   animating={true}
          //   size="small"
          //   color={Colors.contentEbony}
          // />
          <PaddingView paddingSize={2}>
            <View 
              style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginTop: normalize(45), 
                marginBottom: 10 
              }}
            >
              <AppText textStyle="promo">Browse Offers Within</AppText>
              <AppText textStyle="caption" color="#999">{rangeValue} KM</AppText>
            </View>
            <RangeSlider
              minValue={0}
              maxValue={250}
              step={5}
              value={getSliderValue}
            />
          </PaddingView>
        )}
      </View>
      <View style={[styles.mapInstruction, { display: instructionVisible ? 'flex' : 'none', position: instructionVisible ? 'absolute' : 'relative' }]}>
        <PushPin width={normalize(22)} height={normalize(22)}/>
        <AppText
          textStyle="body2"
          color={Colors.neutralsWhite}
          customStyle={{ flex: 1, marginHorizontal: 14 }}
        >
          Drag the map to your preferred location to show the relevant postings.
        </AppText>
        <TouchableOpacity onPress={() => setInstructionVisible(false)}>
          <CloseLight/>
        </TouchableOpacity>
      </View>
      <MapComponent
        latitude={address.latitude}
        // latitude={15.080909570251048}
        longitude={address.longitude}
        // longitude={120.64275087788701}
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
    </SafeAreaView>
  );
};

//make this component available to the app
export default Location;

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // height: normalize(100)
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
    position: 'absolute',
    paddingHorizontal: 8,
    marginTop: -5,
    top: normalize(45),
    zIndex: 9999
  },
  navigationArrow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    // paddingLeft: 0,
    left: normalize(35), 
    paddingTop: 12,
    top: normalize(45),
    zIndex: 9999
  },
  mapInstruction: {
    backgroundColor: Colors.primaryMidnightBlue, 
    opacity: .8, 
    margin: 16, 
    padding: 12, 
    flexDirection: 'row', 
    top: normalize(195),
    zIndex: 100,
  }
});