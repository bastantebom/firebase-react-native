import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import {AppText} from '@/components';
import {normalize, GlobalStyle, Colors} from '@/globals';
import {FollowingEllipsis} from '@/assets/images/icons';

import RemoveFollowerContent from './RemoveFollowerContent';
import UnfollowContent from './UnfollowContent';
import MuteContent from './MuteContent';

const Profile = ({data, type}) => {
  const {user_image, user_name, user_username, follower, following} = data;

  const [followingState, setFollowingState] = useState(following);
  const [removeFollower, setRemoveFollower] = useState(false);
  const [unfollow, setUnfollow] = useState(false);
  const [showMute, setShowMute] = useState(false);

  const showMuteToggle = () => {
    setShowMute(!showMute);
  };

  const removeFollowerToggle = () => {
    setRemoveFollower(!removeFollower);
  };

  const unfollowToggle = () => {
    setUnfollow(!unfollow);
  };

  const follow = () => {
    setFollowingState(true);
  };

  const unfollowHandler = () => {
    setFollowingState(false);
    setUnfollow(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoImageContainer}>
        <Image
          style={GlobalStyle.image}
          source={{
            uri: user_image,
          }}
        />
      </View>

      <View style={{flex: 1, marginLeft: 8}}>
        <AppText textStyle="body1">{user_name}</AppText>
        {type === 'followers' ? (
          <TouchableOpacity onPress={followingState ? unfollowToggle : follow}>
            <AppText textStyle="metadata">
              {' '}
              {followingState ? '• Following' : '• Follow'}{' '}
            </AppText>
          </TouchableOpacity>
        ) : (
          <AppText textStyle="metadata">@{user_username}</AppText>
        )}
      </View>

      {type === 'followers' ? (
        <TouchableOpacity onPress={removeFollowerToggle}>
          <View
            style={{
              padding: 4,
              borderWidth: 1.2,
              borderRadius: 4,
              borderColor: Colors.primaryMidnightBlue,
            }}>
            <AppText textStyle="caption2">Remove</AppText>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={unfollowToggle}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: Colors.buttonDisable,
              }}>
              <AppText textStyle="caption2">Following</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 8}} onPress={showMuteToggle}>
            <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        isVisible={removeFollower}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={removeFollowerToggle}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={removeFollowerToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <RemoveFollowerContent
            data={data}
            removeFollowerToggle={removeFollowerToggle}
          />
        </View>
      </Modal>

      <Modal
        isVisible={unfollow}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={unfollowToggle}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={unfollowToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <UnfollowContent
            data={data}
            unfollowToggle={unfollowToggle}
            unfollowHandler={unfollowHandler}
          />
        </View>
      </Modal>

      <Modal
        isVisible={showMute}
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
          <TouchableWithoutFeedback onPress={showMuteToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <MuteContent data={data} showMuteToggle={showMuteToggle} />
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

export default Profile;
