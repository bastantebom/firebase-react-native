import React from 'react';
import {View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';

import {AppText, PaddingView, AppInput} from '@/components';
import {HeaderBackGray} from '@/assets/images/icons';
import {normalize} from '@/globals';
import TabNavigation from '../TabNavigation/TabNavigation';
// import { ScrollView } from 'react-native-gesture-handler';

const FollowersTab = () => {
  const DummyData = {};

  return (
    <View style={{flex: 1, padding: 16}}>
      <AppInput label="Search..." />
      <AppText customStyle={{backgroundColor: 'gray', }}>Follower</AppText>
      <AppText customStyle={{backgroundColor: 'gray', }}>Follower</AppText>
      <AppText customStyle={{backgroundColor: 'gray', }}>Follower</AppText>
    </View>
  );
};

const FollowingTab = () => {
  return (
    <View style={{flex: 1, padding: 16}}>
      <AppInput label="Search..." />
      <AppText>Following</AppText>
    </View>
  );
};

const ProfileList = ({closeModal}) => {
  let routes = [
    {
      key: 'followers',
      title: 'Followers',
      renderPage: <FollowersTab />,
      numberBadge: 9,
    },
    {
      key: 'following',
      title: 'Following',
      renderPage: <FollowingTab />,
      numberBadge: 29,
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
