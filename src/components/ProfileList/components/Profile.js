import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import {Divider} from 'react-native-paper';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {normalize, GlobalStyle, Colors} from '@/globals';
import {FollowingEllipsis, ProfileBlockRed} from '@/assets/images/icons';

const Profile = ({data, type}) => {
  const {user_image, user_name, follower, following} = data;

  const [removeFollower, setRemoveFollower] = useState(false);

  const removeFollowerToggle = () => {
    setRemoveFollower(!removeFollower);
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
        <AppText textStyle="metadata">
          {' '}
          {following ? '• Following' : '• Follow'}{' '}
        </AppText>
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
          <TouchableOpacity>
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
          <TouchableOpacity
            style={{marginLeft: 8}}
            onPress={() => console.log('press')}>
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
          <RemoveFollowerContent data={data} removeFollowerToggle={removeFollowerToggle} />
        </View>
      </Modal>
    </View>
  );
};

const RemoveFollowerContent = ({data, removeFollowerToggle}) => {
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
            Remove a Follower?
          </AppText>
          <AppText
            textStyle="body2"
            customStyle={{textAlign: 'center', paddingHorizontal: 8}}>
            Servbees won't tell {user_name} they were removed from your
            followers.
          </AppText>
          <Divider style={styles.dividerStyle} />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileBlockRed width={normalize(24)} height={normalize(24)} />
            <AppText
              customStyle={{marginLeft: 8}}
              color={Colors.secondaryBrinkPink}>
              Remove @{user_username}{' '}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={removeFollowerToggle}>
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
