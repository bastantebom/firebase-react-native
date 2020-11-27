import React, { useState, useContext, useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native'
import Modal from 'react-native-modal'

import { AppText } from '@/components'

import {
  NavigationArrow,
  SortNearest,
  CloseDark,
  FilterServicesWhite,
  FilterSellerWhite,
  FilterNeedsWhite,
  NavigationPinAlt,
  SortPopular,
  SortRecent,
  FilterServices,
  FilterSeller,
  FilterNeeds,
} from '@/assets/images/icons'

import { GlobalStyle, Colors, normalize } from '@/globals'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import LocationMap from '@/screens/Dashboard/components/Location'

const LocationSearch = () => {
  const scrollX = useRef(new Animated.Value(0)).current

  const { setLocationFilter, locationFilter } = useContext(Context)
  const { userInfo } = useContext(UserContext)
  const { addresses } = userInfo

  const [showLocation, setShowLocation] = useState(false)

  const [activeNearest, setActiveNearest] = useState(true)
  const [activeServices, setActiveServices] = useState(false)
  const [activeSellers, setActiveSellers] = useState(false)
  const [activeNeeds, setActiveNeeds] = useState(false)
  const [activePopular, setActivePopular] = useState(false)
  const [activeRecent, setActiveRecent] = useState(false)

  const onSelectNearest = () => {
    setActiveNearest(!activeNearest)
  }

  const onSelectServices = () => {
    setActiveServices(!activeServices)
  }

  const onSelectSellers = () => {
    setActiveSellers(!activeSellers)
  }

  const onSelectNeeds = () => {
    setActiveNeeds(!activeNeeds)
  }

  const onSelectRecent = () => {
    setActiveRecent(!activeRecent)
  }

  const onSelectPopular = () => {
    setActivePopular(!activePopular)
  }

  const barOpacity = scrollX.interpolate({
    inputRange: [0, 50, 80],
    outputRange: [1, 0.5, 0],
  })

  const H_MAX_WIDTH = normalize(220)
  const H_MIN_WIDTH = 0
  const H_SCROLL_DISTANCE = H_MAX_WIDTH - H_MIN_WIDTH

  const headerScrollWidth = scrollX.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_WIDTH, H_MIN_WIDTH],
    extrapolate: 'clamp',
  })

  changeFromMapHandler = async fullAddress => {
    setLocationFilter(fullAddress.city)
  }

  return (
    <>
      <View style={{ marginLeft: 16, marginBottom: 16 }}>
        <View style={GlobalStyle.rowCenter}>
          <Animated.View
            style={{
              paddingLeft: normalize(40),
              paddingRight: normalize(15),
              opacity: barOpacity,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              width: headerScrollWidth,
              overflow: 'hidden',
              zIndex: 999,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowLocation(true)
              }}>
              <View>
                <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                  Your location
                </AppText>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primaryAliceBlue,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowLocation(true)
                }}
                style={{ marginRight: normalize(25) }}>
                <View style={{ paddingVertical: normalize(1) }}>
                  <AppText
                    textStyle="body3"
                    color={Colors.primaryMidnightBlue}
                    numberOfLines={1}>
                    {locationFilter}
                  </AppText>
                </View>
              </TouchableOpacity>
              {locationFilter ? (
                <TouchableOpacity
                  onPress={() => {
                    setLocationFilter(null)
                  }}
                  style={{
                    paddingVertical: normalize(4),
                    right: normalize(0),
                    position: 'absolute',
                    zIndex: 999,
                  }}>
                  <CloseDark height={normalize(16)} />
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                marginTop: normalize(-12),
                left: 4,
              }}>
              <NavigationPinAlt width={normalize(24)} height={normalize(24)} />
            </View>
          </Animated.View>
          <ScrollView
            horizontal={true}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { x: scrollX } },
                },
              ],
              {
                useNativeDriver: false,
              }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingLeft: H_MAX_WIDTH }}>
            <TouchableOpacity
              onPress={onSelectNearest}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activeNearest
                    ? Colors.primarySalomie
                    : Colors.neutralsZircon,
                },
              ]}>
              <SortNearest width={normalize(20)} height={normalize(20)} />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Nearest
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSelectServices}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activeServices
                    ? Colors.secondaryBrinkPink
                    : Colors.neutralsZircon,
                },
              ]}>
              {activeServices ? (
                <FilterServicesWhite
                  width={normalize(20)}
                  height={normalize(20)}
                />
              ) : (
                <FilterServices width={normalize(20)} height={normalize(20)} />
              )}
              <AppText
                textStyle="eyebrow2"
                color={activeServices ? Colors.neutralsWhite : ''}
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Services
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSelectSellers}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activeSellers
                    ? Colors.secondaryRoyalBlue
                    : Colors.neutralsZircon,
                },
              ]}>
              {activeSellers ? (
                <FilterSellerWhite
                  width={normalize(20)}
                  height={normalize(20)}
                />
              ) : (
                <FilterSeller width={normalize(20)} height={normalize(20)} />
              )}
              <AppText
                textStyle="eyebrow2"
                color={activeSellers ? Colors.neutralsWhite : ''}
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Sellers
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSelectNeeds}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activeNeeds
                    ? Colors.secondaryMountainMeadow
                    : Colors.neutralsZircon,
                },
              ]}>
              {activeNeeds ? (
                <FilterNeedsWhite
                  width={normalize(20)}
                  height={normalize(20)}
                />
              ) : (
                <FilterNeeds width={normalize(20)} height={normalize(20)} />
              )}
              <AppText
                textStyle="eyebrow2"
                color={activeNeeds ? Colors.neutralsWhite : ''}
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Needs
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSelectPopular}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activePopular
                    ? Colors.primarySalomie
                    : Colors.neutralsZircon,
                },
              ]}>
              <SortPopular width={normalize(20)} height={normalize(20)} />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Popular
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSelectRecent}
              activeOpacity={0.7}
              style={[
                styles.locationOption,
                {
                  backgroundColor: activeRecent
                    ? Colors.primarySalomie
                    : Colors.neutralsZircon,
                },
              ]}>
              <SortRecent width={normalize(20)} height={normalize(20)} />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Recent
              </AppText>
            </TouchableOpacity>
            {/* </View> */}
          </ScrollView>
        </View>

        <Modal
          isVisible={showLocation}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onBackButtonPress={() => setShowLocation(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <LocationMap
            address={
              userInfo.addresses
                ? {
                    latitude: addresses.find(address => address.default)
                      .latitude,
                    longitude: addresses.find(address => address.default)
                      .longitude,
                  }
                : { latitude: 14.5831, longitude: 120.9794 }
            }
            back={() => setShowLocation(false)}
            changeFromMapHandler={fullAddress =>
              changeFromMapHandler(fullAddress)
            }
          />
        </Modal>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  locationOption: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.primarySalomie,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
})

export default LocationSearch
