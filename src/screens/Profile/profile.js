import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
  SafeAreaView,
} from 'react-native'

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
  StickyHeader,
} from '@/components'

import StickyParallaxHeader from 'react-native-sticky-parallax-header'

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo, Reviews } from './Tabs'
import ProfileInfo from './components/ProfileInfo'
import ProfileButtons from './components/ProfileButtons'
import { GuestProfile } from './components/GuestProfile'
import { VerificationStatus } from './components'
import { CircleTick, Warning } from '@/assets/images/icons'
import { PostService } from '@/services'

const ProfileScreen = ({
  profileViewType = 'own',
  backFunction,
  uid,
  ...props
}) => {
  const { user, signOut, userInfo, userStatus } = useContext(UserContext)
  const {
    openNotification,
    closeNotification,
    posts,
    userPosts,
    setUserPosts,
    needsRefresh,
    setNeedsRefresh,
  } = useContext(Context)
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

  const [offsetHeight, setOffsetHeight] = useState(0)

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
    setVisibleFollowing(!visibleFollowing)
  }

  const toggleProfileList = () => {
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
    closeNotificationTimer()
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  const triggerNotify = notify => {
    if (notify) {
      triggerNotification('Profile has been updated successfully!', 'success')
    } else {
      triggerNotification('Profile update Failed!', 'danger')
    }
  }

  const statusPercentage =
    Object.values(userStatus?.verified || {}).reduce(
      (a, status) => a + (status === 'completed' ? 1 : 0),
      0
    ) * 0.25

  useEffect(() => {
    let isMounted = true
    if (isMounted && needsRefresh) {
      refreshPosts()
    }
    return () => (isMounted = false)
  }, [needsRefresh])

  const [lastPID, setLastPID] = useState(0)
  const [fetchMore, setFetchMore] = useState(false)
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const getMorePost = async () => {
    try {
      setFetchMore(true)

      if (!thereIsMoreFlag) {
        setFetchMore(false)
        return
      }

      const getPostsParams = {
        uid: user.uid,
        limit: 5,
        page: lastPID,
      }

      const res = await PostService.getUserPosts(getPostsParams)
      if (res.success) {
        setLastPID(lastPID + 1)
        setUserPosts(res.data ? [...userPosts, ...res.data] : [...userPosts])
        setFetchMore(false)
      } else {
        setThereIsMoreFlag(false)
        setFetchMore(false)
      }
    } catch (err) {
      setFetchMore(false)
    }
  }

  const refreshPosts = async () => {
    try {
      setUserPosts([])
      setLastPID(0)
      setRefresh(true)

      const params = {
        uid: user.uid,
        limit: 5,
        page: 0,
      }
      const res = await PostService.getUserPosts(params)
      setLastPID(1)
      setIsLoading(false)

      if (res.data.length) {
        setUserPosts(res.data)
        setNeedsRefresh(false)
      }
      setRefresh(false)
    } catch (err) {
      setRefresh(false)
    }
  }

  const [scroll] = useState(new Animated.Value(0))

  const renderForeground = () => {
    return (
      <View
        style={{ display: 'flex' }}
        onLayout={event => {
          const layout = event.nativeEvent.layout
          setOffsetHeight(layout.height)
        }}>
        <Notification
          type={notificationType}
          containerStyle={{
            position: 'absolute',
            top: normalize(30),
          }}
          icon={notificationType === 'danger' ? <Warning /> : <CircleTick />}>
          {notificationMessage}
        </Notification>
        <View>
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
          <ProfileInfo profileData={userInfo} />

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
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    const MAX_OPACITY = normalize(250)
    const MIN_OPACITY = normalize(255)

    const opacity = scroll.interpolate({
      inputRange: [0, MAX_OPACITY, MIN_OPACITY],
      outputRange: [0, 0, 1],
    })

    return (
      <Animated.View
        style={{
          opacity: opacity,
          borderBottomColor: Colors.neutralsZircon,
          borderBottomWidth: 5,
        }}>
        <StickyHeader
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
          userInfo={userInfo}
        />
      </Animated.View>
    )
  }

  const profileTabs = [
    {
      title: 'Posts',
      content: (
        <UserPosts
          type="own"
          data={userPosts}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          userID={user.uid}
          isFetching={fetchMore}
        />
      ),
    },
    {
      title: 'More Info',
      content: <MoreInfo profileInfo={userInfo} />,
    },
  ]

  useEffect(() => {
    scroll.addListener(({ value }) => value)
    return () => scroll.removeListener(({ value }) => value)
  }, [scroll])

  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = event => {
    const position = event.nativeEvent.contentOffset.y
    setScrollPosition(position)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StickyParallaxHeader
        foreground={renderForeground()}
        header={renderHeader()}
        parallaxHeight={
          offsetHeight
            ? offsetHeight
            : statusPercentage < 1
            ? normalize(574.857)
            : normalize(479.23)
        }
        headerHeight={scrollPosition < 100 ? 0 : normalize(60)}
        headerSize={() => {}}
        scrollEvent={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroll } } }],
          {
            useNativeDriver: false,
            listener: event => handleScroll(event),
          }
        )}
        snapToEdge={false}
        transparentHeader={scrollPosition < 300 ? true : false}
        onEndReached={getMorePost}
        refreshControl={
          <RefreshControl
            style={{ zIndex: 1 }}
            refreshing={refresh}
            titleColor="#2E3034"
            tintColor="#2E3034"
            title="Refreshing"
            onRefresh={refreshPosts}
          />
        }
        tabs={profileTabs}
        tabTextStyle={styles.tabTextStyle}
        tabTextActiveStyle={{
          color: Colors.secondaryRoyalBlue,
        }}
        tabTextContainerStyle={{
          flexGrow: 1,
          left: normalize(-18),
        }}
        tabTextContainerActiveStyle={{
          borderBottomColor: Colors.secondaryRoyalBlue,
          borderBottomWidth: 2,
        }}
        tabsContainerStyle={{
          height: normalize(50),
          width: Dimensions.get('window').width + normalize(18) * 2,
          backgroundColor: Colors.neutralsWhite,
        }}
        contentContainerStyles={{
          backgroundColor: Colors.neutralsWhite,
        }}></StickyParallaxHeader>
      <WhiteOpacity />
    </SafeAreaView>
  )
}

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
  tabTextStyle: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: normalize(2),
    width: '50%',
    flexGrow: 1,
  },
})

export default ProfileScreen
