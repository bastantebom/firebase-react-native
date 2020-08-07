import React from 'react';
import {View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {Divider} from 'react-native-paper';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
  HeaderBackGray,
  MenuLiked,
  MenuEdit,
  MenuKey,
  MenuInfo,
  MenuChat,
  MenuBell,
  MenuArchive,
  MenuLogOut,
  MenuTelephone,
  MenuAddFriend,
} from '@/assets/images/icons';

const OwnMenu = ({toggleMenu, signOut}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
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
              <TouchableOpacity
                onPress={toggleMenu}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0}}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">Settings</AppText>
            </View>

            <View>
              {/* <AppText textStyle="body3" customStyle={{marginBottom: 16}}>
                Account
              </AppText> */}
              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuLiked width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Liked Posts
                  </AppText>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuEdit width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Edit Profile
                  </AppText>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuArchive width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Archived Posts
                  </AppText>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row'}}>
                  <MenuAddFriend width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Invite Friends
                  </AppText>
                </View>
              </TouchableOpacity> */}
            </View>

            {/* <Divider
              style={{
                backgroundColor: Colors.neutralGray,
                marginVertical: 24,
              }}
            /> */}

            <View>
              {/* <AppText textStyle="body3" customStyle={{marginBottom: 16}}>
                Help and Support
              </AppText> */}

              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuChat width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Frequently Asked Questions
                  </AppText>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row'}}>
                  <MenuTelephone width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Contact Us
                  </AppText>
                </View>
              </TouchableOpacity> */}
            </View>

            {/* <Divider
              style={{
                backgroundColor: Colors.neutralGray,
                marginVertical: 24,
              }}
            /> */}

            <View>
              {/* <AppText textStyle="body3" customStyle={{marginBottom: 16}}>
                Settings and Privacy
              </AppText> */}
              <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuKey width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Change Password
                  </AppText>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuBell width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Notification
                  </AppText>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity activeOpacity={0.7}>
                <View style={{flexDirection: 'row', marginBottom: 16}}>
                  <MenuInfo width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    About
                  </AppText>
                </View>
              </TouchableOpacity>
              <Divider
                style={{
                  backgroundColor: Colors.neutralGray,
                  marginVertical: 24,
                }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={signOut}>
                <View style={{flexDirection: 'row'}}>
                  <MenuLogOut width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{marginLeft: 8}} textStyle="body1">
                    Log out
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          </PaddingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnMenu;
