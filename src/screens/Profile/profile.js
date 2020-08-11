import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

import {
  AppText,
  AppButton,
  ProfileImageUpload,
  HexagonBorder,
  TransparentHeader,
  TabNavigation,
  ProfileLinks,
} from '@/components';
import PostFilter from '@/components/Post/PostFilter';
import {TabView, SceneMap} from 'react-native-tab-view';

import {ProfileHeaderDefault} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import {UserContext} from '@/context/UserContext';

import {Posts, MoreInfo, Reviews} from './Tabs';
import ProfileInfo from './components/ProfileInfo';
import { GuestProfile } from './components/GuestProfile';

function Profile() {

  const { user, signOut } = useContext(UserContext);

  const [ellipsisState, setEllipsisState] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [QR, setQR] = useState(false);

  const [visibleHives, setVisibleHives] = useState(false);
  const [visibleFollowing, setVisibleFollowing] = useState(false);

  const [headerState, setHeaderState] = useState('own');

  const changeHeaderHandler = () => {
    headerState === 'own' ? setHeaderState('other') : setHeaderState('own');
  };

  const toggleQR = () => {
    setQR(!QR);
  };

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState);
  };

  const toggleFollowing = () => {
    setFollowing(!following);
  };

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const toggleHives = () => {
    setVisibleHives(!visibleHives);
  };
  const toggleConnections = () => {
    //alert('text');
    setVisibleFollowing(!visibleFollowing);
  };

  const [profileImageUrl, setProfileImageUrl] = useState('');

  let profileTabs = [
    {key: 'ownpost', title: 'Posts', renderPage: <Posts />},
    // {key: 'review', title: 'Reviews', renderPage: <Reviews />},
    {key: 'moreinfo', title: 'More Info', renderPage: <MoreInfo />},
  ];

  // const signOut = () => {
  //   if (user) {
  //     auth()
  //       .signOut()
  //       .then(() => console.log('User signed out!'));
  //   } else {
  //     navigation.navigate('Onboarding');
  //   }
  // };

  const width = Dimensions.get('window').width;

  const ProfileDummyData = {
    name: "Wayne's Burgers and Smoothies!",
    is_verified: false,
    full_name: 'Wayne Jansen Tayco',
    username: 'waynesburger.com',
    temperature_history: [
      {date: new Date('07-07-2020'), temp: 36.4},
      {date: new Date('07-08-2020'), temp: 35.9},
    ],
    ratings_count: 34,
    ratings_average: 4.3,
    joined_date: 'Jan 2020',
    location: 'Subic, Zambales',
  };

  if (!user) {
    return (
      <GuestProfile/>
    )
  }

  return (
    <>
      <TransparentHeader
        type={headerState}
        ellipsisState={ellipsisState}
        toggleEllipsisState={toggleEllipsisState}
        toggleFollowing={toggleFollowing}
        following={following}
        toggleMenu={toggleMenu}
        menu={menu}
        signOut={signOut}
        toggleQR={toggleQR}
        QR={QR}
      />
      <View style={{backgroundColor: 'red', height: normalize(158)}}>
        <ProfileHeaderDefault
          width={normalize(375 * 1.2)}
          height={normalize(158 * 1.2)}
        />
      </View>
      <View style={styles.profileBasicInfo}>
        <View style={styles.profileImageWrapper}>
          {/* <ProfileImageUpload size={150} /> */}
          <HexagonBorder 
            size={150} 
            // imgSrc={}
          />
        </View>
        <ProfileLinks
          toggleHives={toggleHives} //navigation.navigate('ProfileHives')}
          toggleConnections={toggleConnections}
          visibleHives={visibleHives}
          visibleFollowing={visibleFollowing}
          />
      </View>
      <View style={{backgroundColor: Colors.primaryYellow}}>
        <ProfileInfo profileData={ProfileDummyData} />
      </View>

      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <TabNavigation routesList={profileTabs} />
        </View>
      </ScrollView>
    </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
    // justifyContent: 'center',
  },

  profileBasicInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.neutralsWhite,
    height: normalize(80),
  },

  profileImageWrapper: {
    width: '40%',
    height: normalize(160),
    top: normalize(-70),
    paddingLeft: normalize(24),
    //backgroundColor: 'red',
  },
});
