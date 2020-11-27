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
  SortHighLow,
} from '@/assets/images/icons'

import { GlobalStyle, Colors, normalize } from '@/globals'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import LocationMap from '@/screens/Dashboard/components/Location'
import { getColorByBackground } from '@/globals/Utils'

const LocationSearch = ({
  onValueChange,
  filters,
  onTypeFilterPress,
  onSortFilterPress,
}) => {
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

  const postTypes = [
    {
      label: 'Services',
      value: 'service',
      icon: <FilterServices width={normalize(20)} height={normalize(20)} />,
      iconActive: (
        <FilterServicesWhite width={normalize(20)} height={normalize(20)} />
      ),
      color: Colors.secondaryBrinkPink,
    },
    {
      label: 'Selling',
      value: 'sell',
      icon: <FilterSeller width={normalize(20)} height={normalize(20)} />,
      iconActive: (
        <FilterSellerWhite width={normalize(20)} height={normalize(20)} />
      ),
      color: Colors.secondaryRoyalBlue,
    },
    {
      label: 'Needs',
      value: 'need',
      icon: <FilterNeeds width={normalize(20)} height={normalize(20)} />,
      iconActive: (
        <FilterNeedsWhite width={normalize(20)} height={normalize(20)} />
      ),
      color: Colors.secondaryMountainMeadow,
    },
  ]

  const sortValues = [
    {
      label: 'Recent',
      value: 'recent',
      icon: (
        <SortRecent
          color="#CACBCC"
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      iconActive: (
        <SortRecent
          color={
            getColorByBackground(Colors.primarySalomie) === '#fff'
              ? '#CACBCC'
              : getColorByBackground(Colors.primarySalomie)
          }
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      color: Colors.primarySalomie,
    },
    {
      label: 'Nearest',
      value: 'nearest',
      icon: (
        <SortNearest
          color="#CACBCC"
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      iconActive: (
        <SortNearest
          color={
            getColorByBackground(Colors.primarySalomie) === '#fff'
              ? '#CACBCC'
              : getColorByBackground(Colors.primarySalomie)
          }
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      color: Colors.primarySalomie,
    },
    {
      label: 'Price High to low',
      value: 'price_desc',
      icon: (
        <SortHighLow
          color="#CACBCC"
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      iconActive: (
        <SortHighLow
          color={
            getColorByBackground(Colors.primarySalomie) === '#fff'
              ? '#CACBCC'
              : getColorByBackground(Colors.primarySalomie)
          }
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      color: Colors.primarySalomie,
    },
    {
      label: 'Price Low to High',
      value: 'price_asc',
      icon: (
        <SortHighLow
          color="#CACBCC"
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      iconActive: (
        <SortHighLow
          color={
            getColorByBackground(Colors.primarySalomie) === '#fff'
              ? '#CACBCC'
              : getColorByBackground(Colors.primarySalomie)
          }
          width={normalize(20)}
          height={normalize(20)}
        />
      ),
      color: Colors.primarySalomie,
    },
  ]

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
                    onValueChange({})
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
            {postTypes.map(postType => (
              <TouchableOpacity
                key={postType.value}
                onPress={() => onTypeFilterPress(postType.value)}
                activeOpacity={0.7}
                style={[
                  styles.locationOption,
                  {
                    backgroundColor: filters.type.includes(postType.value)
                      ? postType.color
                      : Colors.neutralsZircon,
                  },
                ]}>
                {filters.type.includes(postType.value)
                  ? postType.iconActive
                  : postType.icon}

                <AppText
                  textStyle="eyebrow2"
                  customStyle={{
                    marginLeft: 5,
                    fontFamily: 'RoundedMplus1c-Medium',
                    color: getColorByBackground(
                      filters.type.includes(postType.value)
                        ? postType.color
                        : Colors.neutralsZircon
                    ),
                  }}>
                  {postType.label}
                </AppText>
              </TouchableOpacity>
            ))}

            {sortValues.map(sortValue => (
              <TouchableOpacity
                key={sortValue.value}
                onPress={() => onSortFilterPress(sortValue.value)}
                activeOpacity={0.7}
                style={[
                  styles.locationOption,
                  {
                    backgroundColor:
                      filters.sort === sortValue.value
                        ? sortValue.color
                        : Colors.neutralsZircon,
                  },
                ]}>
                {filters.sort === sortValue.value
                  ? sortValue.iconActive
                  : sortValue.icon}

                <AppText
                  textStyle="eyebrow2"
                  customStyle={{
                    marginLeft: 5,
                    fontFamily: 'RoundedMplus1c-Medium',
                    color: getColorByBackground(
                      filters.sort === sortValue.value
                        ? sortValue.color
                        : Colors.neutralsZircon
                    ),
                  }}>
                  {sortValue.label}
                </AppText>
              </TouchableOpacity>
            ))}

            {/* <TouchableOpacity
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
              <SortNearest />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Nearest
              </AppText>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
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
              <SortPopular />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Popular
              </AppText>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
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
              <SortRecent />
              <AppText
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium',
                }}>
                Recent
              </AppText>
            </TouchableOpacity> */}
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
            onValueChange={onValueChange}
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
