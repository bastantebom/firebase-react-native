import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';

import {AppText, PaddingView, AppInput, TabNavigation} from '@/components';
import {HeaderBackGray} from '@/assets/images/icons';
import {normalize} from '@/globals';
import Profiles from './components/Profiles';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';

const ProfileList = ({toggleProfileList, viewUserInfo, viewType}) => {
  const {user, signOut, userInfo, setUserInfo} = useContext(UserContext);
  const {refreshFollowerList, setRefreshFollowerList} = useContext(Context);
  const {uid} = viewUserInfo;
  const [followersList, setFollowersList] = useState([]);
  const [followersCount, setFollowersCount] = useState();
  const [followingsList, setFollowingsList] = useState([]);
  const [followingsCount, setFollowingsCount] = useState();

  useEffect(() => {
    let mounted = true;
    if (uid && mounted) {
      ProfileInfoService.getFollowers(uid)
        .then((response) => {
          setFollowersList(
            response.data.sort((a, b) => (a.uid === user.uid ? -1 : 1)),
          );
          setFollowersCount(response.data.length);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });

      ProfileInfoService.getFollowing(uid)
        .then((response) => {
          setFollowingsList(
            response.data.sort((a, b) => (a.uid === user.uid ? -1 : 1)),
          );
          setFollowingsCount(response.data.length);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });
    }

    return () => {
      mounted = false;
    };
  }, [uid]);

  useEffect(() => {
    let mounted = true;
    if (refreshFollowerList && mounted) {
      console.log('Mag refresh ng following');
      ProfileInfoService.getFollowing(uid)
        .then((response) => {
          setFollowingsList(
            response.data.sort((a, b) => (a.uid === user.uid ? -1 : 1)),
          );
          setFollowingsCount(response.data.length);
          setRefreshFollowerList(false);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });
    }
    return () => {
      mounted = false;
    };
  }, [refreshFollowerList]);

  const routes = [
    {
      key: 'followers',
      title: `Followers`,
      renderPage: (
        <View style={{flex: 1, padding: 16}}>
          <Profiles
            data={followersList}
            toggleProfileList={toggleProfileList}
            type="followers"
            viewType={viewType}
          />
        </View>
      ),
      numberBadge: followersCount,
    },
    {
      key: 'following',
      title: `Following`,
      renderPage: (
        <View style={{flex: 1, padding: 16}}>
          <Profiles
            data={followingsList}
            toggleProfileList={toggleProfileList}
            type="following"
            viewType={viewType}
          />
        </View>
      ),
      numberBadge: followingsCount,
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={toggleProfileList}
              activeOpacity={0.7}
              style={{position: 'absolute', left: 0}}>
              <HeaderBackGray width={normalize(16)} height={normalize(16)} />
            </TouchableOpacity>
            <AppText textStyle="body3">
              {viewUserInfo.display_name
                ? viewUserInfo.display_name
                : viewUserInfo.full_name}
            </AppText>
          </View>
        </PaddingView>
        <TabNavigation routesList={routes} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileList;
