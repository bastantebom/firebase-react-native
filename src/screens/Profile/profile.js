import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import {
  AppText,
  HexagonBorder,
  TransparentHeader,
  TabNavigation,
  ProfileLinks,
  WhiteOpacity,
  Notification,
  UserPosts,
  CacheableImage,
} from '@/components'

import PostFilter from '@/components/Post/PostFilter'
import { TabView, SceneMap } from 'react-native-tab-view'

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo, Reviews } from './Tabs'
import ProfileInfo from './components/ProfileInfo'
import ProfileButtons from './components/ProfileButtons'
import { GuestProfile } from './components/GuestProfile'
import { VerificationStatus } from './components'

function Profile({ profileViewType = 'own', backFunction, uid, ...props }) {
  const { user, signOut, userInfo, userStatus } = useContext(UserContext)
  const { openNotification, closeNotification, posts, userPosts } = useContext(
    Context
  )
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()
  const [ellipsisState, setEllipsisState] = useState(false)
  const [following, setFollowing] = useState(false)
  const [menu, setMenu] = useState(false)
  const [QR, setQR] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [visibleHives, setVisibleHives] = useState(false)
  const [visibleFollowing, setVisibleFollowing] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [profileList, setProfileList] = useState(false)

  const [headerState, setHeaderState] = useState(profileViewType)

  const changeHeaderHandler = () => {
    headerState === 'own' ? setHeaderState('other') : setHeaderState('own')
  }

  const toggleQR = () => {
    setQR(!QR)
  }

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState)
  }

  const toggleFollowing = () => {
    setFollowing(!following)
  }

  const toggleMenu = () => {
    setMenu(!menu)
  }

  const toggleHives = () => {
    setVisibleHives(!visibleHives)
  }
  const toggleConnections = () => {
    //alert('text');
    setVisibleFollowing(!visibleFollowing)
  }

  const toggleProfileList = () => {
    //alert('text');
    setProfileList(!profileList)
  }

  const triggerNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>
    )
    openNotification()
    //setIsScreenLoading(false);
    closeNotificationTimer()
  }

  if (!user) {
    return <GuestProfile />
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  }

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
  }

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType()
      setNotificationMessage()
      closeNotification()
    }, 5000)
  }

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
        />
      ),
    },
    {
      key: 'moreinfo',
      title: 'More Info',
      renderPage: <MoreInfo profileInfo={userInfo} />,
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const triggerNotify = notify => {
    if (notify) {
      triggerNotification('Profile has been updated successfully!', 'success')
    } else {
      triggerNotification('Profile update Failed!', 'error')
    }
  }

  const statusPercentage =
    Object.values(userStatus).reduce(
      (a, status) => a + (status === 'completed' ? 1 : 0),
      0
    ) * 0.25

  return (
    <View style={{ flex: 1 }}>
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
        style={{
          backgroundColor: Colors.buttonDisable,
          height: normalize(158),
        }}>
        {userInfo.cover_photo ? (
          <CacheableImage
            source={{ uri: userInfo.cover_photo }}
            style={{ width: normalize(375), height: normalize(158) }}
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
          <HexagonBorder size={140} imgSrc={userInfo.profile_photo} />
        </View>

        <ProfileLinks
          toggleHives={toggleHives}
          toggleProfileList={toggleProfileList}
          profileList={profileList}
          visibleHives={visibleHives}
          visibleFollowing={visibleFollowing}
          userInfo={userInfo}
          viewType="own-links"
        />
      </View>
      <View style={{ backgroundColor: Colors.primaryYellow }}>
        <ProfileInfo profileData={userInfo} />
      </View>

      {statusPercentage < 1 ? (
        <VerificationStatus statusPercentage={statusPercentage} />
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.neutralsWhite,
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}>
        <ProfileButtons triggerNotify={triggerNotify} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <TabNavigation routesList={profileTabs} />
        </View>
      </View>
      <WhiteOpacity />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
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
  },
})
