import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import { AppText } from '@/components'

import { normalize, Colors, GlobalStyle } from '@/globals'

import {
  ProfileImageDefault,
  Verified,
  NavigationPinRed,
  NavigationArrowAlt,
  PostBoxBlue,
  StarRating,
} from '@/assets/images/icons'

const OfferPost = () => {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.userInfoImageContainer}>
            <ProfileImageDefault
              width={normalize(35)}
              height={normalize(35)}
              style={GlobalStyle.image}
            />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText
                textStyle="body3"
                customStyle={{ marginRight: normalize(5) }}>
                You
              </AppText>
              <Verified width={normalize(16)} height={normalize(16)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <StarRating width={normalize(14)} height={normalize(14)} />
              <AppText
                textStyle="caption"
                customStyle={{ marginLeft: normalize(5) }}>
                3.5
              </AppText>
              <AppText customStyle={{ marginHorizontal: normalize(5) }}>
                •
              </AppText>
              <AppText textStyle="caption">1w ago</AppText>
              <AppText customStyle={{ marginHorizontal: normalize(5) }}>
                •
              </AppText>
              <AppText
                textStyle="caption"
                customStyle={{ marginRight: normalize(5) }}>
                in
              </AppText>
              <AppText textStyle="caption" color={Colors.secondaryBrinkPink}>
                Services
              </AppText>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: normalize(10) }}>
        <View style={styles.postImageContainer}>
          <Image
            style={GlobalStyle.image}
            source={require('@/assets/images/carpentry.jpg')}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            paddingLeft: normalize(10),
          }}>
          <View>
            <AppText textStyle="body1">Carpentry Services</AppText>
            <AppText
              textStyle="body2medium"
              color={Colors.secondaryMountainMeadow}>
              ₱ 499
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: normalize(10),
            }}>
            <NavigationPinRed width={normalize(18)} height={normalize(18)} />
            <AppText
              textStyle="caption"
              customStyle={{
                marginLeft: normalize(5),
                marginRight: normalize(15),
              }}>
              SM Light
            </AppText>
            <NavigationArrowAlt width={normalize(14)} height={normalize(14)} />
            <AppText
              textStyle="caption"
              customStyle={{ marginLeft: normalize(5) }}>
              500m
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderTopColor: '#F2F4F6',
              borderTopWidth: 1,
              paddingTop: normalize(10),
            }}>
            <PostBoxBlue width={normalize(14)} height={normalize(14)} />
            <AppText
              textStyle="caption"
              customStyle={{ marginLeft: normalize(5) }}>
              For Appointment Only
            </AppText>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
    marginRight: normalize(10),
  },
  postImageContainer: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    padding: normalize(10),
    marginVertical: normalize(10),
    borderRadius: 8,
  },
})

export default OfferPost
