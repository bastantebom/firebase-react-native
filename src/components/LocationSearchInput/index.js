import React from 'react';
//import {Image, Text} from 'react-native';
import GooglePlacesAutocomplete from 'react-native-google-places-autocomplete';
import Global from '@/services/Config';
import {Colors} from '@/globals';

const GooglePlacesInput = ({onResultsClick, onClearInput}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter street address or city"
      query={{
        key: Global.apiKey,
        language: 'en', // language of the results
        components: 'country:ph',
      }}
      onPress={(data, details = null) => {
        //let coordinates = data.geometry.location;
        onResultsClick(details.description);
        //sendCoordinates(coordinates, {data, details});
      }}
      onFail={(error) => console.error(error)}
      textInputProps={{onChangeText: (value) => onClearInput(value)}}
      styles={{
        container: {
          marginTop: -10,
          paddingBottom: 50,
        },
        listView: {
          color: Colors.contentEbony, //To see where exactly the list is
          zIndex: 1100, //To popover the component outwards
          elevation: 1100,
          position: 'absolute',
          top: 45,
          backgroundColor: Colors.neutralsWhite,
          marginLeft: 10,
          marginRight: 10,
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
    />
  );
};

export default GooglePlacesInput;
