import React from 'react';
import {View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';

import {AppText, PaddingView, AppInput, TabNavigation} from '@/components';
import {HeaderBackGray} from '@/assets/images/icons';
import {normalize} from '@/globals';
import Profiles from './components/Profiles';

const FollowingDummyData = [
  {
    user_image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/selena-gomez-1573068628.jpg?crop=0.489xw:0.978xh;0.510xw,0&resize=640:*',
    user_name: 'Selena Gomez',
    user_username: 'selenagomez1',
    follower: false,
    following: true,
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

const FollowersTab = () => {
  return (
    <View style={{flex: 1, padding: 16}}>
      <AppInput label="Search..." />
      <Profiles data={FollowerDummyData} type="followers" />
    </View>
  );
};

const FollowingTab = () => {
  return (
    <View style={{flex: 1, padding: 16}}>
      <AppInput label="Search..." />
      <Profiles data={FollowingDummyData} type="following" />
    </View>
  );
};

const ProfileList = ({closeModal}) => {
  let routes = [
    {
      key: 'followers',
      title: 'Followers',
      renderPage: <FollowersTab />,
      numberBadge: FollowerDummyData.length,
    },
    {
      key: 'following',
      title: 'Following',
      renderPage: <FollowingTab />,
      numberBadge: FollowingDummyData.length,
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View>
          <PaddingView paddingSize={3}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={closeModal}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0}}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">Wayne's Burger</AppText>
            </View>
          </PaddingView>

          <TabNavigation routesList={routes} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileList;
