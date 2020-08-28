import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';

import {
  AppText,
  BottomSheetHeader,
  PaddingView,
  CacheableImage,
} from '@/components';
import {normalize, GlobalStyle, Colors} from '@/globals';
import {ProfileListMute} from '@/assets/images/icons';

const RemoveFollowerContent = ({data, showMuteToggle}) => {
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
            <CacheableImage
              style={GlobalStyle.image}
              source={{
                uri: user_image,
              }}
            />
          </View>
          <AppText textStyle="display6" customStyle={{marginTop: 16}}>
            Mute {user_name}?
          </AppText>
          <AppText
            textStyle="body2"
            customStyle={{textAlign: 'center', paddingHorizontal: 8}}>
            When you mute {user_name}, you won't be able to see her posts on
            your feed.
          </AppText>
          <Divider style={styles.dividerStyle} />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileListMute width={normalize(24)} height={normalize(24)} />
            <AppText
              customStyle={{marginLeft: 8}}
              color={Colors.secondaryBrinkPink}>
              Mute @{user_username}{' '}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={showMuteToggle}>
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

export default RemoveFollowerContent;
