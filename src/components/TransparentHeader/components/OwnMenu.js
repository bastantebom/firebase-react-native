import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors} from '@/globals';

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
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
                Menu
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
              <ProfileReport />
              <AppText customStyle={{marginLeft: 8}} textStyle="body2">
                Menu
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
                Menu
              </AppText>
            </View>
          </TouchableOpacity>

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
