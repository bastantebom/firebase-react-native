/**
 * Component for profile info
 */

import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'

import { AppText, CacheableImage } from '@/components'
import { GlobalStyle, Colors, normalize, timePassed } from '@/globals'
import {
  Verified,
  ProfileImageDefault,
  StarRating,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'

const ProfileInfo = ({
  userInfo,
  type,
  cancelModalToggle,
  isModal,
  toggleMenu,
  toggleLikePost,
}) => {
  const { user } = useContext(UserContext)

  const navigation = useNavigation()

  const {
    username = 'defaultuser',
    profile_photo = '',
    display_name = 'Busy Bee',
    date_posted,
    uid,
    post_type,
    account_verified,
  } = userInfo

  const VerifiedBadge = ({ size }) => {
    return account_verified ? (
      <Verified width={normalize(size)} height={normalize(size)} />
    ) : null
  }

  let timeAgo = time => {
    return timePassed(time) + ' ago'
  }

  const ProfilePhoto = ({ size }) => {
    return profile_photo ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: profile_photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const openProfileHandler = () => {
    if (toggleMenu && toggleLikePost) {
      toggleLikePost()
      toggleMenu()
    }
    if (user && user.uid === uid) {
      isModal && cancelModalToggle()
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      isModal && cancelModalToggle()
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: uid },
      })
    }
  }

  if (type === 'dashboard')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={openProfileHandler}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              height: normalize(32),
              width: normalize(32),
              borderRadius: normalize(32 / 2),
              overflow: 'hidden',
              alignSelf: 'center',
            }}>
            <ProfilePhoto size={32} />
          </View>
          <View style={styles.userInfoDetailsContainer}>
            <View style={styles.userInfoDetailsNameContainer}>
              <AppText
                textStyle="captionDashboard"
                customStyle={styles.userInfoDetailsName}>
                {display_name}
              </AppText>
              <VerifiedBadge size={10} />
            </View>
            <View style={styles.userInfoDetailsUsernameContainer}>
              <AppText
                textStyle="eyebrow2"
                color={Colors.contentPlaceholder}
                customStyle={{ paddingHorizontal: 4 }}>
                {timeAgo(Date.now() / 1000 - date_posted._seconds)}
              </AppText>
              <AppText
                textStyle="eyebrow2"
                color={Colors.contentPlaceholder}
                customStyle={{ paddingHorizontal: 4 }}>
                • in
              </AppText>
              <AppText
                textStyle="eyebrow2"
                color={
                  post_type === 'service'
                    ? Colors.secondaryBrinkPink
                    : post_type === 'sell'
                    ? Colors.contentOcean
                    : Colors.secondaryMountainMeadow
                }
                customStyle={{ paddingHorizontal: 4 }}>
                {post_type === 'sell'
                  ? 'Sell'
                  : post_type === 'service'
                  ? 'Services'
                  : 'Needs'}
              </AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )

  // OWN POST VIEW
  if (type === 'own-post')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={openProfileHandler}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.userInfoImageContainer}>
            <ProfilePhoto size={42} />
          </View>
          <View style={{ marginLeft: 8, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" customStyle={{ marginRight: 4 }}>
                {display_name}
              </AppText>
              <VerifiedBadge />
            </View>
            <View style={{}}>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                @{username.toLowerCase()}
              </AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )

  if (type === 'block-user')
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: Colors.neutralsZircon,
          borderBottomWidth: 1,
          paddingHorizontal: normalize(16),
          paddingVertical: normalize(16),
        }}>
        <View style={styles.userInfoImageContainer}>
          <ProfilePhoto size={42} />
        </View>
        <View style={{ marginLeft: 8, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText textStyle="body2" customStyle={{ marginRight: 4 }}>
              {display_name.length > 20
                ? `${display_name.substring(0, 20)}...`
                : display_name}
            </AppText>
            <VerifiedBadge />
          </View>
          <View>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>
              @{username.toLowerCase()}
            </AppText>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              cancelModalToggle()
            }}
            style={{
              paddingHorizontal: normalize(8),
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Colors.contentEbony,
              borderWidth: 1,
              borderRadius: 6,
              height: normalize(30),
              width: normalize(90),
              marginVertical: normalize(8),
              marginHorizontal: normalize(4),
            }}>
            <AppText textStyle="caption" color={Colors.contentEbony}>
              Unblock
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    )

  if (type === 'follow')
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: Colors.neutralsZircon,
          borderBottomWidth: 1,
          paddingHorizontal: normalize(16),
          paddingVertical: normalize(16),
        }}>
        <View style={styles.userInfoImageContainer}>
          <ProfilePhoto size={42} />
        </View>
        <View style={{ marginLeft: 8, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText textStyle="body2" customStyle={{ marginRight: 4 }}>
              {display_name.length > 20
                ? `${display_name.substring(0, 20)}...`
                : display_name}
            </AppText>
            <VerifiedBadge />
          </View>
          <View>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>
              @{username.toLowerCase()}
            </AppText>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}></View>
      </View>
    )

  if (type === 'need') {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.userInfoImageContainer}>
          <ProfilePhoto size={42} />
        </View>
        <View style={{ marginLeft: 8, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText textStyle="body2" customStyle={{ marginRight: 4 }}>
              You
            </AppText>
            <VerifiedBadge />
          </View>
          <View style={styles.userInfoDetailsUsernameContainer}>
            <AppText
              textStyle="eyebrow2"
              color={Colors.contentPlaceholder}
              customStyle={{ paddingHorizontal: 4 }}>
              {timeAgo(Date.now() / 1000 - date_posted._seconds)}
            </AppText>
            <AppText
              textStyle="eyebrow2"
              color={Colors.contentPlaceholder}
              customStyle={{ paddingHorizontal: 4 }}>
              • in
            </AppText>
            <AppText
              textStyle="eyebrow2"
              color={
                post_type === 'service'
                  ? Colors.secondaryBrinkPink
                  : post_type === 'sell'
                  ? Colors.contentOcean
                  : Colors.secondaryMountainMeadow
              }
              customStyle={{ paddingHorizontal: 4 }}>
              {post_type === 'sell'
                ? 'Sell'
                : post_type === 'service'
                ? 'Services'
                : 'Needs'}
            </AppText>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
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
    alignItems: 'center',
  },
})

export default ProfileInfo
