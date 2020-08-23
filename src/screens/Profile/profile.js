import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

import ProfileInfoService from '@/services/Profile/ProfileInfo';

import {
  AppText,
  AppButton,
  ProfileImageUpload,
  HexagonBorder,
  TransparentHeader,
  TabNavigation,
  ProfileLinks,
  WhiteOpacity,
} from '@/components';
import PostFilter from '@/components/Post/PostFilter';
import {TabView, SceneMap} from 'react-native-tab-view';

import {ProfileHeaderDefault} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import {UserContext} from '@/context/UserContext';

import {Posts, MoreInfo, Reviews} from './Tabs';
import ProfileInfo from './components/ProfileInfo';
import {GuestProfile} from './components/GuestProfile';

function Profile({profileViewType = 'own', backFunction, uid}) {
  const {user, signOut, userInfo, userDataAvailable} = useContext(UserContext);
  //const {userInfo, userDataAvailable} = useContext(ProfileInfoContext);
  //const [userInfo, setUserInfo] = useState({});
  //const [userDataAvailable, setUserDataAvailable] = useState(false);

  const [ellipsisState, setEllipsisState] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [QR, setQR] = useState(false);

  const [visibleHives, setVisibleHives] = useState(false);
  const [visibleFollowing, setVisibleFollowing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [headerState, setHeaderState] = useState(profileViewType);

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
    {
      key: 'ownpost',
      title: 'Posts',
      renderPage: (
        <Posts
          type="dashboard"
          // data={DummyData}
          data={[{}]}
          isLoading={isDataLoading}
          setIsLoading={setIsDataLoading}
        />
      ),
    },
    //{key: 'ownpost', title: 'Posts', renderPage: <></>},
    // {key: 'review', title: 'Reviews', renderPage: <Reviews />},
    {
      key: 'moreinfo',
      title: 'More Info',
      renderPage: <MoreInfo />,
    },
  ];

  const width = Dimensions.get('window').width;

  if (!user) {
    return <GuestProfile />;
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
        backFunction={backFunction}
      />
      <View
        style={{backgroundColor: Colors.buttonDisable, height: normalize(158)}}>
        {userInfo.cover_photo ? (
          <Image
            source={{uri: userInfo.cover_photo}}
            style={{width: normalize(375), height: normalize(158 * 1.2)}}
          />
        ) : (
          <ProfileHeaderDefault
            width={normalize(375 * 1.2)}
            height={normalize(158 * 1.2)}
          />
        )}
      </View>
      <View style={styles.profileBasicInfo}>
        <View style={styles.profileImageWrapper}>
          {/* <ProfileImageUpload size={150} /> */}
          <HexagonBorder size={150} imgSrc={userInfo.profile_photo} />
        </View>

        <ProfileLinks
          toggleHives={toggleHives} //navigation.navigate('ProfileHives')}
          toggleConnections={toggleConnections}
          visibleHives={visibleHives}
          visibleFollowing={visibleFollowing}
          userInfo={userInfo}
        />
      </View>
      <View style={{backgroundColor: Colors.primaryYellow}}>
        <ProfileInfo profileData={userInfo} />
      </View>

      <View style={{flex: 1}}>
        <View style={styles.container}>
          <TabNavigation routesList={profileTabs} />
        </View>
      </View>
      <WhiteOpacity />
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
