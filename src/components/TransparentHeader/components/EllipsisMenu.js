import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors} from '@/globals';

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
} from '@/assets/images/icons';

const EllipsisMenu = ({toggleEllipsisState}) => {
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
        <TouchableOpacity activeOpacity={0.7}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileMute />
            <AppText customStyle={{marginLeft: 8}} textStyle="body2">
              Mute @trishaparedes
            </AppText>
          </View>
        </TouchableOpacity>
<<<<<<< HEAD
        <TouchableOpacity activeOpacity={0.7} onPress={() => alert('asda')}>
=======
        <TouchableOpacity activeOpacity={0.7}>
>>>>>>> 6c8c4d3b4a9fff0c4fde1d36df3952433a440e09
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileReport />
            <AppText customStyle={{marginLeft: 8}} textStyle="body2">
              Report @trishaparedes
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileBlockRed />
            <AppText
              color={Colors.red}
              customStyle={{marginLeft: 8}}
              textStyle="body2">
              Block @trishaparedes
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={toggleEllipsisState}>
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

export default EllipsisMenu;
