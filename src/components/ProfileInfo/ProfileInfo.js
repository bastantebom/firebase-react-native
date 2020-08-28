/**
 * Component for profile info
 */

import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';

import {AppText, CacheableImage} from '@/components';
import {GlobalStyle, Colors, normalize, timePassed} from '@/globals';
import {Verified, ProfileImageDefault} from '@/assets/images/icons';
import {UserContext} from '@/context/UserContext';
import {Profile} from '@/screens/Profile';
import ProfileInfoModal from './ProfileInfoModal';

const ProfileInfo = ({userInfo, type, closePostModal}) => {
  const {user} = useContext(UserContext);
  const [profileModal, setProfileModal] = useState(false);
  const navigation = useNavigation();

  const {
    username = 'defaultuser',
    profile_photo = '',
    account_verified = false,
    display_name = 'Busy Bee',
    date_posted,
    uid,
  } = userInfo;

  const VerifiedBadge = ({width = 10, height = 11.25}) => {
    return account_verified ? (
      <Verified width={normalize(width)} height={normalize(height)} />
    ) : null;
  };

  let timeAgo = (time) => {
    return '• ' + timePassed(time) + ' ago';
  };

  const ProfilePhoto = ({size}) => {
    return profile_photo ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: profile_photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    );
  };

  openProfileHandler = () => {
    console.log(user.uid);
    console.log(uid);

    if (user.uid === uid) {
      return navigation.navigate('Profile', {
        screen: 'Profile',
      });
    }

    // return
    console.log('OPENING MODAL');

    setProfileModal(true);
  };

  if (type === 'dashboard')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={openProfileHandler}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              height: normalize(32),
              width: normalize(32),
              borderRadius: normalize(32 / 2),
              overflow: 'hidden',
            }}>
            {/* <Image
              style={GlobalStyle.image}
              source={{
                uri: profile_photo
                  ? profile_photo
                  : 'https://i.pinimg.com/originals/f9/0c/9e/f90c9e170d4b553a9d0a79735113365b.jpg',
              }}
            /> */}
            <ProfilePhoto size={32} />
          </View>
          <View style={styles.userInfoDetailsContainer}>
            <View style={styles.userInfoDetailsNameContainer}>
              <AppText
                textStyle="caption"
                customStyle={styles.userInfoDetailsName}>
                {display_name}
              </AppText>
              <VerifiedBadge />
            </View>
            <View style={styles.userInfoDetailsUsernameContainer}>
              <AppText textStyle="eyebrow2" color={Colors.contentPlaceholder}>
                @{username.toLowerCase()}
              </AppText>

              {/* <View style={styles.starRatingContainer}>
                  <StarRating width={12} height={12} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}>
                    {rating}
                  </AppText>
                </View> */}

              <AppText
                textStyle="eyebrow2"
                color={Colors.contentPlaceholder}
                customStyle={{paddingHorizontal: 4}}>
                {timeAgo(date_posted)}
              </AppText>
            </View>
          </View>
        </View>

        {/* FOR MODAL */}
        <Modal
          isVisible={profileModal}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={300}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <ProfileInfoModal
            backFunction={() => setProfileModal(false)}
            uid={uid}
          />
        </Modal>
      </TouchableOpacity>
    );

  // OWN POST VIEW
  if (type === 'own-post')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={openProfileHandler}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.userInfoImageContainer}>
            <ProfilePhoto size={42} />
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
        <Modal
          isVisible={profileModal}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={300}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <ProfileInfoModal
            backFunction={() => setProfileModal(false)}
            uid={uid}
          />
        </Modal>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
  userInfoDetailsContainer: {
    flex: 1,
    // backgroundColor: "red",
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
  },
});

export default ProfileInfo;
