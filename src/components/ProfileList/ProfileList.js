import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

import { AppText, PaddingView, AppInput, TabNavigation } from '@/components';
import { HeaderBackGray } from '@/assets/images/icons';
import { normalize } from '@/globals';
import Profiles from './components/Profiles';
import ProfileInfoService from '@/services/Profile/ProfileInfo';

// const FollowingDummyData = [
//   {
//     user_image:
//       'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/selena-gomez-1573068628.jpg?crop=0.489xw:0.978xh;0.510xw,0&resize=640:*',
//     user_name: 'Selena Gomez',
//     user_username: 'selenagomez1',
//     follower: false,
//     following: true,
//   },
//   {
//     user_image:
//       'https://images.thestar.com/KU19aIcaDXtPaGkzfIEM1EthbVk=/1086x724/smart/filters:cb(1586277340221)/https://www.thestar.com/content/dam/thestar/entertainment/2020/04/07/celebrities-face-backlash-as-they-reveal-new-sides-during-coronavirus-pandemic/gal_gadot.jpg',
//     user_name: 'Gal Gadot',
//     user_username: 'galilicious',
//     follower: true,
//     following: true,
//   },
// ];

const FollowerDummyData = [
  {
    user_image:
      'https://upload.wikimedia.org/wikipedia/commons/7/79/Johnny_Depp_Deauville_2019.jpg',
    user_name: 'Johnny Depp',
    user_username: 'johnnybravo',
    follower: true,
    following: false,
  },
  {
    user_image:
      'https://images.thestar.com/KU19aIcaDXtPaGkzfIEM1EthbVk=/1086x724/smart/filters:cb(1586277340221)/https://www.thestar.com/content/dam/thestar/entertainment/2020/04/07/celebrities-face-backlash-as-they-reveal-new-sides-during-coronavirus-pandemic/gal_gadot.jpg',
    user_name: 'Gal Gadot',
    user_username: 'galilicious',
    follower: true,
    following: true,
  },
];

const ProfileList = ({ toggleProfileList, viewUserInfo, viewType }) => {
  const { uid } = viewUserInfo;
  const [followersList, setFollowersList] = useState([]);
  const [followersCount, setFollowersCount] = useState();
  const [followingsList, setFollowingsList] = useState([]);
  const [followingsCount, setFollowingsCount] = useState();

  useEffect(() => {
    let mounted = true;
    if (uid && mounted) {
      ProfileInfoService.getFollowers(uid)
        .then((response) => {
          setFollowersList(response.data);
          setFollowersCount(response.data.length);
          //if (mounted) setOtherUserInfo(response.data);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });

      ProfileInfoService.getFollowing(uid)
        .then((response) => {
          setFollowingsList(response.data);
          setFollowingsCount(response.data.length);
          //console.log(response.data.length);
          //if (mounted) setOtherUserInfo(response.data);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });
    }
    return () => {
      mounted = false;
    };
  }, [uid]);

  const routes = [
    {
      key: 'followers',
      title: `Followers`,
      renderPage: (
        <View style={{ flex: 1, padding: 16 }}>
          <Profiles data={followersList} toggleProfileList={toggleProfileList} type="followers" viewType={viewType} />
        </View>),
      numberBadge: followersCount,
    },
    {
      key: 'following',
      title: `Following`,
      renderPage: (<View style={{ flex: 1, padding: 16 }}>
        <Profiles data={followingsList} toggleProfileList={toggleProfileList} type="following" viewType={viewType} />
      </View>),
      numberBadge: followingsCount,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
              style={{ position: 'absolute', left: 0 }}>
              <HeaderBackGray width={normalize(16)} height={normalize(16)} />
            </TouchableOpacity>
            <AppText textStyle="body3">{viewUserInfo.display_name ? viewUserInfo.display_name : viewUserInfo.full_name}</AppText>
          </View>
        </PaddingView>
        <TabNavigation routesList={routes} />
      </View>

    </SafeAreaView>
  );
};

export default ProfileList;
