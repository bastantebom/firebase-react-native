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
import LinearGradient from 'react-native-linear-gradient';


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
      <LinearGradient colors={['#ECEFF8', '#F8F9FC']}>
        <View style={{ height: isFocused ? normalize(135) : normalize(180) }}>
          <View style={styles.textInputWrapper}>
            <TouchableOpacity
              onPress={back}
              activeOpacity={0.7}
              style={{ top: normalize(30), position: 'absolute', left: 16 }}
            >
              <HeaderBackGray width={normalize(25)} height={normalize(25)} />
            </TouchableOpacity>
            {/* <AppText 
              textStyle="caption" color={Colors.contentOcean}
              customStyle={styles.inputLabel}
            >
              Your location
            </AppText> */}
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
                top: normalize(87),
                marginLeft: normalize(0),
                marginRight: normalize(0),
                paddingLeft: 16,
                paddingRight: 32,
                height: Dimensions.get('window').height -  normalize(155),
                width: Dimensions.get('window').width,
                left: normalize(-42),
                backgroundColor: Colors.neutralsZirconLight
              }}
              customTextInputStyle={{
                borderWidth: 0,
                borderRadius: 40,
                height: normalize(55),
                paddingLeft: normalize(50),
                // paddingTop: normalize(15),
              }}
              customIconStyle={{
                left: normalize(25),
                top: normalize(23)
              }}
              placeholder="Search Your Location"
              debounce={1500}
            />
          </View>
          {isFocused ? (
            <TouchableOpacity 
              activeOpacity={.7}
              onPress={() => findCoordinates()}
              style={styles.navigationArrow}
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
            <PaddingView paddingSize={2} style={{ top: normalize(75) }}>
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  // marginTop: normalize(45), 
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
      </LinearGradient>
      <View style={[
        styles.mapInstruction, 
          { 
            display: instructionVisible ? 'flex' : 'none', 
            position: instructionVisible ? 'absolute' : 'relative',
            top: isFocused ? normalize(140) : normalize(180)
          }
        ]}
      >
        <PushPin width={normalize(22)} height={normalize(22)}/>
        <AppText
          textStyle="body2"
          color={Colors.neutralsWhite}
          customStyle={{ flex: 1, marginHorizontal: 14 }}
        >
          Set your location and drag the Buzzy Pin to the exact area you want to explore. 
        </AppText>
        <TouchableOpacity onPress={() => setInstructionVisible(false)}>
          <CloseLight/>
        </TouchableOpacity>
      </View>
      <MapComponent
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
    </SafeAreaView>
  );
};

//make this component available to the app
export default Location;

const styles = StyleSheet.create({
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
    paddingLeft: normalize(42),
    paddingRight: 8,
    // paddingHorizontal: 8,
    paddingTop: 8,
    // top: normalize(45),
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  navigationArrow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    // paddingLeft: 0,
    left: normalize(45), 
    paddingTop: 12,
    top: normalize(75),
    zIndex: 9999
  },
  mapInstruction: {
    backgroundColor: Colors.primaryMidnightBlue, 
    opacity: .8, 
    margin: 16, 
    padding: 12, 
    flexDirection: 'row', 
    // top: normalize(195),
    zIndex: 100,
  },
  inputLabel: {
    position: 'absolute',
    zIndex: 99999999,
    backgroundColor: 'red',
    top: 20
  }
});