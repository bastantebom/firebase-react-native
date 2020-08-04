import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {normalize, GlobalStyle, Colors} from '@/globals';
import {ProfileListUnfollow} from '@/assets/images/icons';

const UnfollowContent = ({data, unfollowToggle, unfollowHandler}) => {
  const {user_image, user_name, user_username} = data;

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.userInfoImageContainer}>
            <Image
              style={GlobalStyle.image}
              source={{
                uri: user_image,
              }}
            />
          </View>
          <AppText textStyle="display6" customStyle={{marginTop: 16}}>
            Unfollow {user_name}?
          </AppText>
          <Divider style={styles.dividerStyle} />

          <TouchableOpacity
            onPress={unfollowHandler}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileListUnfollow width={normalize(24)} height={normalize(24)} />
            <AppText
              customStyle={{marginLeft: 8}}
              color={Colors.secondaryBrinkPink}>
              Unfollow @{user_username}{' '}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={unfollowToggle}>
          <View
            style={{
              backgroundColor: Colors.neutralsZircon,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}>
            <AppText textStyle="button2">Cancel</AppText>
          </View>
        </TouchableOpacity>
      </PaddingView>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(44),
    width: normalize(44),
    borderRadius: normalize(44 / 2),
    overflow: 'hidden',
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginTop: 8,
    marginBottom: 32,
  },
});

export default UnfollowContent;
