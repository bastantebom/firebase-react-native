import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

import ProfileInfoService from '@/services/Profile/ProfileInfo';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import {
  AppText,
  AppButton,
  ProfileImageUpload,
  HexagonBorder,
  TransparentHeader,
  TabNavigation,
  ProfileLinks,
  WhiteOpacity,
  UserPosts,
  OtherUserPosts,
} from '@/components';
import PostFilter from '@/components/Post/PostFilter';
import {TabView, SceneMap} from 'react-native-tab-view';

import {ProfileHeaderDefault} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context/index';

import {MoreInfo, Reviews} from '@/screens/Profile/Tabs';
import ProfileInfo from '@/screens/Profile/components/ProfileInfo';
// import {GuestProfile} from './components/GuestProfile';

function ProfileInfoModal({profileViewType = 'other', backFunction, uid}) {
  const {user, signOut} = useContext(UserContext);
  const {userPosts, otherUserPosts} = useContext(Context);
  //const {userInfo, userDataAvailable} = useContext(ProfileInfoContext);
  const [userInfo, setUserInfo] = useState({});
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

  const width = Dimensions.get('window').width;

  // if (!user) {
  //   return <GuestProfile />;
  // }

  useEffect(() => {
    let mounted = true;

    setIsDataLoading(true);
    ProfileInfoService.getUser(uid)
      .then((response) => {
        if (mounted) setUserInfo(response);
      })
      .catch((err) => {
        console.log('Err: ' + err);
      })
      .finally(() => {
        if (mounted) {
          console.log('FINALLY');
          setIsDataLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const profileTabs = [
    {
      key: 'ownpost',
      title: 'Posts',
      renderPage: (
        <OtherUserPosts
          type="own"
          data={otherUserPosts}
          isLoading={isDataLoading}
          setIsLoading={setIsDataLoading}
          userID={uid}
        />
      ),
    },
    {
      key: 'moreinfo',
      title: 'More Info',
      renderPage: <MoreInfo />,
    },
  ];

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
        userInfo={userInfo}
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
          <HexagonBorder size={140} imgSrc={userInfo.profile_photo} />
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
        <LoadingUserInfo isLoading={isDataLoading}>
          <ProfileInfo profileData={userInfo} />
        </LoadingUserInfo>
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

const LoadingUserInfo = ({children, isLoading}) => {
  return (
    <SkeletonContent
      containerStyle={{flexDirection: 'column', backgroundColor: 'white'}}
      isLoading={isLoading}
      layout={[
        {
          marginHorizontal: 20,
          width: normalize(190),
          height: normalize(24),
        },
        {
          marginHorizontal: 20,
          flexDirection: 'row',
          marginTop: 8,
          children: [
            {
              width: normalize(120),
              height: normalize(20),
              marginRight: 16,
            },
            {
              width: normalize(100),
              height: normalize(20),
            },
          ],
        },
        {
          alignSelf: 'center',
          width: normalize(375 - 40),
          height: normalize(2),
          marginVertical: 16,
        },
        {
          marginHorizontal: 20,
          flexDirection: 'row',
          marginTop: 8,
          children: [
            {
              width: normalize(120),
              height: normalize(20),
              marginRight: 16,
            },
            {
              width: normalize(120),
              height: normalize(20),
            },
          ],
        },
      ]}>
      {children}
    </SkeletonContent>
  );
};

export default ProfileInfoModal;

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
    top: Dimensions.get('window').height > 850 ? '-17%' : '-21%',
    paddingLeft: normalize(24),
    //backgroundColor: 'red',
  },
});
