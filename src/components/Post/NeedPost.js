import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { AppText, PaddingView, ProfileInfo, CacheableImage } from '@/components'
import { GlobalStyle, normalize, timePassedShort, Colors } from '@/globals'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'
import {
  Verified,
  NavigationPinRed,
  TransportationBox,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import LoadingScreen from './loading'
import { commaSeparate } from '@/globals/Utils'

const NeedPost = ({ data, isLoading }) => {
  const { user } = useContext(UserContext)

  const navigation = useNavigation()

  const {
    user: { display_name, profile_photo },
    date_posted,
    available,
    payment_method,
    store_details: {
      schedule,
      location: { city, province, country },
    },
    title,
    username,
    delivery_methods,
    description,
    uid,
    price,
    post_id,
    cover_photos,
    account_verified,
    email,
    phone_number,
    type,
    full_name,
    price_range,
    items,
  } = data

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name ? display_name : full_name,
    date_posted: date_posted,
    uid: uid,
    post_type: type,
  }

  const VerifiedBadge = () => {
    return account_verified ? (
      <Verified width={normalize(9)} height={normalize(10.12)} />
    ) : (
      <></>
    )
  }

  const navToPost = () => {
    return
  }

  const getPrice = () => {
    const prices = price_range
      ? [price_range.min, price_range.max]
      : items.map(item => parseFloat(item.price.replace(/,/g, '')) || 0)

    return prices.length === 1
      ? `₱${commaSeparate(prices[0])}`
      : `₱${commaSeparate(Math.min(...prices))} - ₱${commaSeparate(
          Math.max(...prices)
        )}`
  }

  return (
    <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
      <PaddingView paddingSize={2} style={styles.container}>
        <ProfileInfo userInfo={userInfo} type="need" />
        <View style={styles.postContainer}>
          <View style={styles.postImageContainer}>
            {cover_photos.length > 0 ? (
              <CacheableImage
                style={GlobalStyle.image}
                source={{ uri: cover_photos[0] }}
              />
            ) : type === 'service' ? (
              <DefaultService width={normalize(122)} height={normalize(126)} />
            ) : type === 'need' || type === 'Need' ? (
              <DefaultNeed width={normalize(122)} height={normalize(126)} />
            ) : (
              <DefaultSell width={normalize(122)} height={normalize(126)} />
            )}
          </View>
          <View style={styles.postDetailContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <AppText
                textStyle="body2Dashboard"
                customStyle={GlobalStyle.marginBottom1}>
                {title}
              </AppText>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText
                  textStyle="price"
                  customStyle={styles.priceText}
                  color={Colors.secondaryMountainMeadow}>
                  {getPrice()}
                </AppText>
              </View>
            </TouchableOpacity>

            <Divider style={styles.dividerStyle} />

            <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
              <View style={GlobalStyle.rowCenter}>
                <NavigationPinRed width={16} height={16} />
                <AppText
                  textStyle="eyebrow2"
                  color={Colors.contentPlaceholder}
                  customStyle={{ marginLeft: 4 }}>
                  {city}, {province}
                </AppText>
              </View>
            </View>
            {delivery_methods?.pickup || delivery_methods?.delivery ? (
              <View style={GlobalStyle.rowCenter}>
                <TransportationBox width={16} height={16} />

                <AppText
                  textStyle="eyebrow2"
                  customStyle={{ color: Colors.contentEbony, marginLeft: 4 }}>
                  {delivery_methods?.pickup && delivery_methods?.delivery
                    ? 'Pickup & Delivery'
                    : delivery_methods?.delivery
                    ? 'Delivery'
                    : delivery_methods?.pickup
                    ? 'Pickup'
                    : 'Not set'}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>
      </PaddingView>
    </LoadingScreen.LoadingPublicPost>
  )
}

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: Colors.neutralsZircon,
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  userInfoImageContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(32 / 2),
    overflow: 'hidden',
  },
  userInfoImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  userInfoDetailsContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  userInfoDetailsNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoDetailsName: {
    fontFamily: 'RoundedMplus1c-Medium',
    paddingRight: 4,
  },
  userInfoDetailsUsernameContainer: {
    flexDirection: 'row',
  },
  starRatingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },

  postContainer: {
    width: '100%',
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
  },

  postImageContainer: {
    width: normalize(122),
    height: normalize(126),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postDetailContainer: {
    flex: 1,
    marginLeft: 12,
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZirconLight,
    width: '100%',
    marginBottom: 8,
  },
  priceText: {
    marginRight: 8,
  },
})

export default NeedPost
