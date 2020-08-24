import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';

import Modal from 'react-native-modal';

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
import EditProfile from '@/screens/Profile/components/EditProfile/EditProfile';
import About from '@/screens/Profile/components/About/About';
import ChangePassword from '@/screens/Profile/components/ChangePassword/ChangePassword';

const OwnMenu = ({toggleMenu, signOut, triggerNotify}) => {
  const [editProfile, setEditProfile] = useState(false);

  const toggleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const [about, setAbout] = useState(false);

  const toggleAbout = () => {
    setAbout(!about);
  };

  const [changePassword, setChangePassword] = useState(false);

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };

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

              <TouchableOpacity activeOpacity={0.7} onPress={toggleEditProfile}>
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleChangePassword}>
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

              <TouchableOpacity activeOpacity={0.7} onPress={toggleAbout}>
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
      <Modal
        isVisible={editProfile}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleEditProfile}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <EditProfile
          toggleMenu={toggleMenu}
          toggleEditProfile={toggleEditProfile}
          triggerNotify={triggerNotify}
        />
      </Modal>

      <Modal
        isVisible={about}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleAbout}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <About toggleAbout={toggleAbout} />
      </Modal>

      <Modal
        isVisible={changePassword}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleChangePassword}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <ChangePassword toggleChangePassword={toggleChangePassword} />
      </Modal>
    </SafeAreaView>
  );
};

export default OwnMenu;
