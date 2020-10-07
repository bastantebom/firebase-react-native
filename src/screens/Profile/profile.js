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
  Notification,
  UserPosts,
  CacheableImage,
} from '@/components';
import PostFilter from '@/components/Post/PostFilter';
import {TabView, SceneMap} from 'react-native-tab-view';

import {ProfileHeaderDefault} from '@/assets/images';
import {normalize, Colors} from '@/globals';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context/index';

import {MoreInfo, Reviews} from './Tabs';
import ProfileInfo from './components/ProfileInfo';
import {GuestProfile} from './components/GuestProfile';

function Profile({profileViewType = 'own', backFunction, uid, ...props}) {
  // console.log('Profile screen');
  // console.log(props.route.params.id);

  // if(props.route?.params?.id){
    
  // }

  const {user, signOut, userInfo, userDataAvailable} = useContext(UserContext);
  const {openNotification, closeNotification, posts, userPosts} = useContext(
    Context,
  );
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationType, setNotificationType] = useState();
  //const {userInfo, userDataAvailable} = useContext(ProfileInfoContext);
  //const [userInfo, setUserInfo] = useState({});
  //const [userDataAvailable, setUserDataAvailable] = useState(false);

  const [ellipsisState, setEllipsisState] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [QR, setQR] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const triggerNotification = (message, type) => {
    setNotificationType(type);
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>,
    );
    openNotification();
    //setIsScreenLoading(false);
    closeNotificationTimer();
  };

  if (!user) {
    return <GuestProfile />;
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  };

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
  };

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType();
      setNotificationMessage();
      closeNotification();
    }, 5000);
  };

  const profileTabs = [
    {
      key: 'ownpost',
      title: 'Posts',
      renderPage: (
        <UserPosts
          type="own"
          data={userPosts}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          userID={user.uid}
          //hideLocationComponent={hideLocationComponent}
          //showLocationComponent={showLocationComponent}
        />
      ),

      //<></>
    },
    //{key: 'ownpost', title: 'Posts', renderPage: <></>},
    // {key: 'review', title: 'Reviews', renderPage: <Reviews />},
    {
      key: 'moreinfo',
      title: 'More Info',
      renderPage: <MoreInfo profileInfo={userInfo} />,
    },
  ];

  useEffect(() => {
    //console.log(posts);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  //console.log(height);

  const triggerNotify = (notify) => {
    if (notify) {
      triggerNotification('Profile has been updated successfully!', 'success');
    } else {
      triggerNotification('Profile update Failed!', 'error');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Notification
        message={notificationMessage}
        type={notificationType}
        top={normalize(30)}
        position="absolute"
      />
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
        triggerNotify={triggerNotify}
      />

      <View
        style={{backgroundColor: Colors.buttonDisable, height: normalize(158)}}>
        {userInfo.cover_photo ? (
          <CacheableImage
            source={{uri: userInfo.cover_photo}}
            style={{width: normalize(375), height: normalize(158)}}
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
        <ProfileInfo profileData={userInfo} />
      </View>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <TabNavigation routesList={profileTabs} />
        </View>
      </View>
      <WhiteOpacity />
    </View>
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
    width: normalize(160),
    height: normalize(160),
    top: Dimensions.get('window').height > 850 ? '-17%' : '-21%',
    paddingLeft: normalize(24),
    //backgroundColor: 'red',
  },
});
