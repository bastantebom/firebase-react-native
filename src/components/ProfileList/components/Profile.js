import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {Verified, ProfileImageDefault} from '@/assets/images/icons';
import {AppText, CacheableImage} from '@/components';
import {normalize, GlobalStyle, Colors} from '@/globals';
import {FollowingEllipsis} from '@/assets/images/icons';

import MuteContent from './MuteContent';
import FollowEllipsis from './FollowEllipsis';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {useNavigation} from '@react-navigation/native';
import ProfileInfoService from '@/services/Profile/ProfileInfo';

const Profile = ({data, type, viewType, toggleProfileList}) => {
  const navigation = useNavigation();
  const {user, userInfo, setUserInfo} = useContext(UserContext);
  const {refreshFollowerList, setRefreshFollowerList} = useContext(Context);
  const {
    profile_photo,
    username,
    display_name,
    full_name,
    follower,
    uid,
  } = data;

  //const [followingState, setFollowingState] = useState(following);
  const [removeFollower, setRemoveFollower] = useState(false);

  const [showMute, setShowMute] = useState(false);
  const [showEllipsis, setShowEllipsis] = useState(false);
  //const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showEllipsisToggle = () => {
    setShowEllipsis(!showEllipsis);
  };

  const showMuteToggle = () => {
    setShowMute(!showMute);
  };

  const isFollowing = () => {
    return userInfo.following ? userInfo.following.includes(uid) : false;
  };

  const followUser = (selectedUser) => {
    connectUser(selectedUser.uid, false);
  };

  const unFollowUser = (selectedUser) => {
    connectUser(selectedUser.uid, true);
  };

  const connectUser = (selectUid, connectionType) => {
    setIsLoading(true);
    ProfileInfoService.follow(selectUid, connectionType)
      .then((response) => {
        if (viewType === 'own-links') {
          //console.log('magupdate from follower or following');
          setRefreshFollowerList(true);
        }
        const updatedFollowingList = {
          following: [...response.data],
        };
        setUserInfo({...userInfo, ...updatedFollowingList});
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const name = display_name ? display_name : full_name;

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

  const openProfileHandler = () => {
    toggleProfileList();
    if (user && user.uid === uid) {
      navigation.navigate('Profile', {
        screen: 'Profile',
      });
    } else {
      console.log('Going to NBTS');
      navigation.goBack();
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: {uid: uid},
      });
    }
  };

  const FollowUnfollowButton = ({userId, uName}) => {
    const connected = userInfo.following
      ? userInfo.following.includes(uid)
      : false;
    if (connected) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => unFollowUser(data)}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 4,
                backgroundColor: Colors.primaryYellow,
              }}>
              <AppText textStyle="caption2">Following</AppText>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    if (!connected && userInfo.uid !== userId) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => followUser(data)}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 4,
                backgroundColor: Colors.neutralsWhite,
                borderWidth: 1,
                borderColor: Colors.contentEbony,
              }}>
              <AppText textStyle="caption2">Follow</AppText>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    if (!connected && userInfo.uid === userId) {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row', flex: 1}}
        activeOpacity={0.7}
        onPress={openProfileHandler}>
        <View style={styles.userInfoImageContainer}>
          <ProfilePhoto size={42} />
        </View>

        <View style={{flex: 1, marginLeft: 8}}>
          <AppText textStyle="body1">
            {name.length > 19 ? `${name.substring(0, 19)}...` : name}
          </AppText>
          <AppText textStyle="metadata">@{username}</AppText>
        </View>
      </TouchableOpacity>

      {/* OWN PROFILE AND FOLLOWERS TAB  */}
      {viewType === 'own-links' && type === 'followers' ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FollowUnfollowButton userId={uid} uName={username} />
          <TouchableOpacity
            style={{marginLeft: 8}}
            onPress={showEllipsisToggle}>
            <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* OWN PROFILE AND FOLLOWING TAB  */}
      {viewType === 'own-links' && type === 'following' ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginLeft: 8}}
            onPress={showEllipsisToggle}>
            <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* OTHER PROFILE BOTH TAB  */}
      {viewType === 'other-user-links' ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FollowUnfollowButton userId={uid} uName={username} />
        </View>
      ) : null}
      <Modal
        isVisible={showEllipsis}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={showMuteToggle}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={showEllipsisToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <FollowEllipsis
            userInfo={data}
            showEllipsisToggle={showEllipsisToggle}
            isFollowing={isFollowing()}
            connectUser={(UID, cT) => connectUser(UID, cT)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginTop: 8,
    marginBottom: 32,
  },
});

export default Profile;
