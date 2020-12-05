import React, { useState, useContext, useRef, useEffect } from 'react'
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
  SortNearest,
  CloseDark,
  FilterServicesWhite,
  FilterSellerWhite,
  FilterNeedsWhite,
  NavigationPinAlt,
  SortRecent,
  FilterServices,
  FilterSeller,
  FilterNeeds,
  SortHighLow,
} from '@/assets/images/icons'

import Config from '@/services/Config'
import { GlobalStyle, Colors, normalize } from '@/globals'
import { UserContext } from '@/context/UserContext'
import LocationMap from '@/screens/Dashboard/components/Location'
import { getColorByBackground } from '@/globals/Utils'
import Geocoder from 'react-native-geocoding'
import { Context } from '@/context'

Geocoder.init(Config.apiKey)
const LocationSearch = ({
  onValueChange,
  filters,
  onTypeFilterPress,
  onSortFilterPress,
  location,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current

  const { userInfo } = useContext(UserContext)
  const { addresses } = userInfo

  const [locationModalVisible, setLocationModalVisible] = useState(false)

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
              paddingRight: normalize(16),
              opacity: barOpacity,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              width: headerScrollWidth,
              overflow: 'hidden',
              zIndex: 999,
              height: `100%`,
            }}>
            <TouchableOpacity
              onPress={() => setLocationModalVisible(true)}
              style={{
                height: '100%',
                flex: 1,
                flexDirection: 'row',
              }}>
              <NavigationPinAlt
                style={{ marginRight: normalize(12) }}
                width={normalize(24)}
                height={normalize(24)}
              />
              <View
                style={{
                  borderBottomColor: Colors.primaryAliceBlue,
                  borderBottomWidth: 1,
                  height: '100%',
                  flex: 1,
                }}>
                <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                  Your location
                </AppText>
                <AppText
                  textStyle="body3"
                  color={Colors.primaryMidnightBlue}
                  numberOfLines={1}>
                  {location?.city}
                </AppText>
              </View>
            </TouchableOpacity>
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
            {sortValues
              .filter(sortValue => filters.sort === sortValue.value)
              .map(sortValue => (
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

            {postTypes
              .filter(postType => filters.type.includes(postType.value))
              .map(postType => (
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

            {sortValues
              .filter(sortValue => filters.sort !== sortValue.value)
              .map(sortValue => (
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

            {postTypes
              .filter(postType => !filters.type.includes(postType.value))
              .map(postType => (
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
          </ScrollView>
        </View>

        <Modal
          isVisible={locationModalVisible}
          animationIn="slideInRight"
          animationInTiming={300}
          animationOut="slideOutRight"
          animationOutTiming={250}
          onBackButtonPress={() => setLocationModalVisible(false)}
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
            back={() => setLocationModalVisible(false)}
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
