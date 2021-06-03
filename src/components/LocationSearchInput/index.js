import React, { useRef, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import GooglePlacesAutocomplete from 'react-native-google-places-autocomplete'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { GOOGLE_MAPS_API_KEY } from '@env'

const GooglePlacesInput = ({
  onResultsClick,
  onClearInput,
  currentValue,
  adjustListPosition,
  onInputFocus,
  customListViewStyle,
  customContainerStyle,
  customTextInputStyle,
  customIconStyle,
  customIcon,
  placeholder = 'Enter street address or city',
  debounce = 0,
}) => {
  const placesRef = useRef(null)

  useEffect(() => {
    if (currentValue) {
      placesRef.current.setAddressText(currentValue)
    }
  }, [currentValue])

  return (
    <View style={styles.textInputWrapper}>
      <View style={[styles.navIcon, { ...customIconStyle }]}>
        {customIcon ? (
          customIcon
        ) : (
          <Icons.Navigation
            style={{ color: Colors.secondaryBrinkPink }}
            {...iconSize(24)}
          />
        )}
      </View>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en', // language of the results
          components: 'country:ph',
        }}
        onPress={(data, details = null) => {
          //let coordinates = data.geometry.location;
          //alert('asdsds');
          onResultsClick(details.description)

          //sendCoordinates(coordinates, {data, details});
        }}
        listViewDisplayed={false}
        onFail={error => console.log(error)}
        textInputProps={{
          onChangeText: value => onClearInput?.(value),
          onFocus: onInputFocus,
        }}
        styles={{
          container: {
            paddingBottom: 50,

            flex: 1,
            ...customContainerStyle,
          },
          listView: {
            color: Colors.contentEbony, //To see where exactly the list is
            zIndex: 9999, //To popover the component outwards
            elevation: 9999,

            top: adjustListPosition ? normalize(58) : normalize(18),
            backgroundColor: Colors.neutralsWhite,
            marginLeft: normalize(10),
            marginRight: normalize(10),
            ...customListViewStyle,
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
            fontFamily: 'RoundedMplus1c-Regular',
            fontSize: 16,
            height: 54,
            color: Colors.contentEbony,
            ...customTextInputStyle,
          },
          predefinedPlacesDescription: {
            color: Colors.contentEbony,
            fontFamily: 'RoundedMplus1c-Regular',
          },
          poweredContainer: { display: 'none' },
          description: { fontFamily: 'RoundedMplus1c-Regular' },
        }}
        ref={placesRef}
        debounce={debounce}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInputWrapper: {
    width: '100%',
    flex: 1,
    zIndex: 100,
    elevation: 100,
  },
  navIcon: {
    top: normalize(20),
    left: normalize(16),
    position: 'absolute',
    zIndex: 101,
    elevation: 101,
  },
})

export default GooglePlacesInput
