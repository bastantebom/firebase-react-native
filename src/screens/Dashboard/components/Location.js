import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator
} from 'react-native';
import Geocoder from 'react-native-geocoding';
//import {useNavigation} from '@react-navigation/native';

import {CloseLight, HeaderBackGray, NavigationArrowAlt, PushPin} from '@/assets/images/icons';
import Config from '@/services/Config';
import GooglePlacesInput from '@/components/LocationSearchInput';
import {PaddingView, AppText, MapComponent, AppButton} from '@/components';
import {Colors, normalize} from '@/globals';
//import {UserContext} from '@/context/UserContext';
import Slider from '@react-native-community/slider';
import { RangeSlider } from '@/components/Slider/RangeSlider';

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
    // width: '100%',
    // flex: 0,
    // position: 'relative',
    // padding: 24,
    // alignItems: 'stretch',
    // zIndex: 100,
    // top: 70,
    // marginTop: 25,
    width: '100%',
    // flex: 1,
    position: 'absolute',
    // left: 0,
    // right: 0,
    // padding: 24,
    paddingHorizontal: 8,
    marginTop: -5,
    // alignItems: 'stretch',
    // zIndex: 100,
    // backgroundColor: 'green',
    top: normalize(45),
    zIndex: 999
    // marginTop: 25,
    // elevation: 100,
  },
  navigationArrow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: 16, 
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
          //setChangeMapAddress(addressComponent);
        });
        setIsLocationReady(true);
      })
      .catch((error) => console.warn(error));

    //console.log(addressComponents);
    //setButtonDisabled(false);
    //setButtonStyle({});
  };

  //SEARCH ADDRESS
  const onSearchLocationHandler = (data) => {
    //console.log('onSearchLocationHandler ' + data);
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

  const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  };
  const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
  };

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
          />
        </View>
        {/* <TouchableOpacity>
          <AppText
            textStyle="caption"
            color={Colors.contentOcean}
            customStyle={{ marginLeft: 10 }}
          >
            Your current location
          </AppText>
        </TouchableOpacity> */}
        {isFocused ? (
          <TouchableOpacity 
            activeOpacity={.7}
            // onPress={() => console.log('hi')} 
            style={styles.navigationArrow}
          >
            <NavigationArrowAlt width={normalize(20)} height={normalize(20)} />
            <AppText
              textStyle="caption"
              color={Colors.contentOcean}
              customStyle={{ marginLeft: 10 }}
            >
              Your current location
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
    </SafeAreaView>
  );
};

//make this component available to the app
export default Location;
