/**
 * Component for profile info
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {AppText} from '@/components';
import {GlobalStyle, Colors, normalize} from '@/globals';
import {Verified, ProfileImageDefault} from '@/assets/images/icons';

const ProfileInfo = ({userInfo}) => {
  const {
    username = 'defaultuser',
    profile_photo = '',
    account_verified = false,
    display_name = 'Busy Bee',
  } = userInfo;

  const VerifiedBadge = ({width = 10, height = 11.25}) => {
    return account_verified ? (
      <Verified width={normalize(width)} height={normalize(height)} />
    ) : null;
  };

  const ProfilePhoto = () => {
    return profile_photo ? (
      <Image
        style={GlobalStyle.image}
        source={{
          uri: profile_photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(42)} height={normalize(42)} />
    );
  };

  // Own Post View
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={styles.userInfoImageContainer}>
        <ProfilePhoto />
      </View>
      <View style={{marginLeft: 8, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText textStyle="body1medium" customStyle={{marginRight: 4}}>
            {display_name}
          </AppText>
          <VerifiedBadge />
        </View>
        <View style={{}}>
          <AppText textStyle="body2" color={Colors.contentPlaceholder}>
            @{username.toLowerCase()}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
});

export default ProfileInfo;
