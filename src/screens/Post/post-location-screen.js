import { Icons } from '@/assets/images/icons'
import { Colors, GlobalStyle, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useRef, useState } from 'react'
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import GooglePlacesAutocomplete from 'react-native-google-places-autocomplete'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const GooglePlacesAPIKey = 'AIzaSyCu10vZtdRHmJ7bxnebSSj7u1LFeMV4GUs'

const DismissKeyboardView = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

/**
 * @typedef {object} Address
 * @property {string} full_address
 * @property {string} name
 * @property {boolean} default
 */

/**
 * @typedef {object} PostLocationScreenProps
 * @property {Address[]} addresses
 * @property {function} onPress
 */

/**
 * @typedef {object} RootProps
 * @property {PostLocationScreenProps} PostLocationScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PostLocationScreen'>} param0 */
const PostLocationScreen = ({ navigation, route }) => {
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef(null)

  const { addresses, onPress } = route.params

  const getLocationName = (components, key) =>
    components.find(component => component.types.includes(key))?.long_name

  const clearSearchValue = () => {
    searchInputRef.current.setAddressText('')
    setSearchValue('')
  }

  const handleSearchFromMapPress = () => {
    navigation.navigate('NBTScreen', {
      screen: 'Verification',
      params: {
        screen: 'map-location',
        params: {
          title: 'Location',
          onSelect: address => {
            onPress(address)
            navigation.goBack()
          },
          address: addresses.find(address => address.default),
        },
      },
    })
  }

  const handleResultPress = details => {
    const {
      address_components: addressComponents,
      geometry,
      formatted_address: full_address,
      name,
    } = details

    const address = {
      name: name || formatted_address,
      longitude: geometry.location.lng,
      latitude: geometry.location.lat,
      city: getLocationName(addressComponents, 'locality'),
      province:
        getLocationName(addressComponents, 'administrative_area_level_2') ||
        getLocationName(addressComponents, 'administrative_area_level_1') ||
        '',
      country: getLocationName(addressComponents, 'country'),
      full_address,
    }

    onPress(address)
    navigation.goBack()
  }

  const handleAddressPress = address => {
    onPress(address)
    navigation.goBack()
  }

  const renderSearchResult = data => {
    return (
      <View style={styles.searchResult}>
        <Icons.Navigation
          style={styles.searchResultIcon}
          height={normalize(16)}
          width={normalize(16)}
        />
        <Text style={styles.searchResultText} numberOfLines={1}>
          {data.description || data.formatted_address || data.name}
        </Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <DismissKeyboardView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={navigation.goBack}>
              <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Location</Text>
            </View>
          </View>
          <View style={styles.searchInputWrapper}>
            <GooglePlacesAutocomplete
              ref={searchInputRef}
              placeholder="Enter street address or city"
              placeholderTextColor={Colors.contentPlaceholder}
              query={{
                key: GooglePlacesAPIKey,
                language: 'en',
                components: 'country:ph',
              }}
              onPress={(data, details) => {
                handleResultPress(details)
              }}
              fetchDetails={true}
              onFail={error => console.log(error)}
              textInputProps={{
                onChangeText: setSearchValue,
              }}
              styles={{
                container: {
                  paddingBottom: 50,
                  flex: 1,
                },
                textInput: {
                  borderColor: Colors.neutralGray,
                  borderWidth: 1,
                  paddingHorizontal: normalize(40),
                  fontFamily: 'RoundedMplus1c-Regular',
                  fontSize: normalize(16),
                  color: Colors.contentEbony,
                  height: normalize(55),
                  paddingLeft: normalize(50),
                  paddingRight: normalize(50),
                },
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  flex: 1,
                },
                predefinedPlacesDescription: {
                  color: Colors.contentEbony,
                  fontFamily: 'RoundedMplus1c-Regular',
                },
                poweredContainer: { display: 'none' },
                description: { fontFamily: 'RoundedMplus1c-Regular' },
                listView: {
                  width: '100%',
                  position: 'absolute',
                  top: normalize(136),
                },
                row: {
                  height: 'auto',
                  paddingHorizontal: 0,
                },
                separator: {
                  backgroundColor: Colors.secondarySolitude,
                },
              }}
              listUnderlayColor={Colors.secondarySolitude}
              renderRow={renderSearchResult}
              renderLeftButton={() => (
                <Icons.Navigation style={styles.searchIcon} {...iconSize(24)} />
              )}
              renderRightButton={() =>
                searchValue.length ? (
                  <TouchableOpacity
                    style={styles.searchButton}
                    activeOpacity={0.7}
                    onPress={clearSearchValue}>
                    <Icons.Close style={styles.clearSearchIcon} />
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
          <TouchableOpacity
            style={[styles.linkWrapper, styles.searchFromMapWrapper]}
            activeOpacity={0.7}
            onPress={handleSearchFromMapPress}>
            <Text
              style={[typography.body2, typography.link, styles.searchFromMap]}>
              Search from map
            </Text>
          </TouchableOpacity>

          {!searchValue.length && (
            <View style={styles.savedAddresses}>
              <Text
                style={[
                  typography.caption,
                  { color: Colors.contentPlaceholder },
                ]}>
                Saved Address
              </Text>

              {addresses.map((address, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.savedAddress}
                    activeOpacity={0.7}
                    onPress={() => handleAddressPress(address)}>
                    <Text
                      style={[
                        styles.addressName,
                        address.default ? styles.defaultAddressName : {},
                      ]}>
                      {address.name || 'Home'} {address.default && '(Default)'}
                    </Text>
                    <Text style={styles.fullAddress}>
                      {address.full_address}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          <View style={[styles.section, styles.topSection]}></View>
          <View style={[styles.section, styles.bottomSection]}></View>
        </DismissKeyboardView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
    marginTop: getStatusBarHeight(),
  },
  scrollView: {
    backgroundColor: 'red',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  section: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  bottomSection: {
    flex: 1,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    marginBottom: 0,
  },
  searchInputWrapper: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    height: Dimensions.get('window').height,
    top: normalize(64),
    zIndex: 1,
  },
  searchIcon: {
    position: 'absolute',
    top: normalize(24),
    left: normalize(24),
    color: Colors.secondaryBrinkPink,
    zIndex: 2,
  },
  clearSearchIcon: {
    color: Colors.icon,
  },
  searchButton: {
    padding: normalize(10),
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
  },
  linkWrapper: {
    paddingVertical: normalize(8),
  },
  searchFromMap: {
    fontSize: normalize(14),
    lineHeight: normalize(21),
  },
  searchFromMapWrapper: {
    position: 'absolute',
    top: normalize(140),
    left: normalize(24),
    zIndex: 10,
  },
  topSection: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 0,
    height: normalize(136),
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
    paddingHorizontal: 0,
  },
  searchResultIcon: {
    color: Colors.icon,
    marginRight: normalize(8),
  },
  searchResultText: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(0.25),
    color: Colors.contentPlaceholder,
  },
  savedAddress: {
    paddingVertical: normalize(16),
    borderBottomColor: Colors.neutralsGainsboro,
    borderBottomWidth: normalize(1),
  },
  addressName: {
    marginRight: normalize(4),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(0.25),
    color: Colors.contentEbony,
    marginBottom: normalize(4),
  },
  defaultAddressName: {
    fontFamily: 'RoundedMplus1c-Medium',
  },
  fullAddress: {
    marginRight: normalize(4),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.25),
    color: Colors.contentPlaceholder,
  },
  savedAddresses: {
    position: 'absolute',
    top: normalize(206),
    zIndex: 10,
    width: '100%',
    padding: normalize(24),
  },
})

export default PostLocationScreen
