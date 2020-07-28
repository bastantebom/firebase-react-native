import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
  HeaderBackGray,
} from '@/assets/images/icons';

const OwnMenu = ({toggleMenu}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          backgroundColor: 'white',
          paddingBottom: 24,
          borderTopEndRadius: 8,
          borderTopStartRadius: 8,
        }}>
        <PaddingView paddingSize={3}>
          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 32,
            }}>
            <TouchableOpacity style={{position: 'absolute', left: 0}}>
              <HeaderBackGray width={normalize(16)} height={normalize(16)} />
            </TouchableOpacity>
            <AppText textStyle="body3">Settings</AppText>
          </View>

          <View>
            <AppText textStyle="body3">Account</AppText>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={toggleMenu}>
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
    </SafeAreaView>
  );
};

export default OwnMenu;
