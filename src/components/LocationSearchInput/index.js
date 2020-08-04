import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import GooglePlacesAutocomplete from 'react-native-google-places-autocomplete';
import Global from '@/services/Config';
import {Colors, normalize} from '@/globals';
import {NavigationPin} from '@/assets/images/icons';

const GooglePlacesInput = ({
  onResultsClick,
  onClearInput,
  currentValue,
  adjustListPosition,
}) => {
  const placesRef = useRef(null);

  useEffect(() => {
    if (currentValue) {
      placesRef.current.setAddressText(currentValue);
    }
  }, [currentValue]);

  return (
    <View style={styles.textInputWrapper}>
      <View style={styles.navIcon}>
        <NavigationPin width={normalize(24)} height={normalize(24)} />
      </View>
      <GooglePlacesAutocomplete
        placeholder="Enter street address or city"
        query={{
          key: Global.apiKey,
          language: 'en', // language of the results
          components: 'country:ph',
        }}
        onPress={(data, details = null) => {
          //let coordinates = data.geometry.location;
          //alert('asdsds');
          onResultsClick(details.description);

          //sendCoordinates(coordinates, {data, details});
        }}
        listViewDisplayed={false}
        onFail={(error) => console.error(error)}
        textInputProps={{
          onChangeText: (value) => onClearInput(value),
        }}
        styles={{
          container: {
            paddingBottom: 50,
            //zIndex: 9999, //To popover the component outwards
            //elevation: 9999,
            //backgroundColor: 'green',
            flex: 1,
            //position: 'relative',
          },
          listView: {
            color: Colors.contentEbony, //To see where exactly the list is
            zIndex: 9999, //To popover the component outwards
            elevation: 9999,
            //position: 'absolute',
            top: adjustListPosition ? normalize(58) : normalize(18),
            backgroundColor: Colors.neutralsWhite,
            marginLeft: normalize(10),
            marginRight: normalize(10),
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            flex: 1,
          },
          textInput: {
            borderColor: Colors.neutralGray,
            borderWidth: 1,
            paddingLeft: 40,
            paddingRight: 39,
            fontSize: 16,
            height: 54,
            color: Colors.contentEbony,
          },
          predefinedPlacesDescription: {
            color: Colors.contentEbony,
          },
          poweredContainer: {display: 'none'},
        }}
        ref={placesRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInputWrapper: {
    width: '100%',
    flex: 1,
    zIndex: 100,
    elevation: 100,
  },

  navIcon: {
    //backgroundColor: 'green',
    top: 20,
    left: 16,
    position: 'absolute',
    zIndex: 101,
    elevation: 101,
  },
});

export default GooglePlacesInput;
