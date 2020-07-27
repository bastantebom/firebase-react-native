import React from 'react';
import {Image, Text} from 'react-native';
import GooglePlacesAutocomplete from 'react-native-google-places-autocomplete';
import Global from '@/services/Config';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: Global.apiKey,
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;
