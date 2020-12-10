import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native'

import ProfileInfoService from '@/services/Profile/ProfileInfo'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'
import { useNavigation } from '@react-navigation/native'

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
  CacheableImage,
} from '@/components'
import PostFilter from '@/components/Post/PostFilter'
import { TabView, SceneMap } from 'react-native-tab-view'

import StickyParallaxHeader from 'react-native-sticky-parallax-header'
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view'

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo, Reviews } from '@/screens/Profile/Tabs'
import ProfileInfo from '@/screens/Profile/components/ProfileInfo'
import StickyHeader from '../TransparentHeader/StickyHeader'
import { PostService } from '@/services'

function ProfileInfoModal(props) {
  const { profileViewType = 'other', uid } = props.route?.params

  const navigation = useNavigation()
  const { user, signOut, userInfo, setUserInfo } = useContext(UserContext)
  const { userPosts, otherUserPosts, setOtherUserPosts } = useContext(Context)
  const [otherUserInfo, setOtherUserInfo] = useState({})

  const [ellipsisState, setEllipsisState] = useState(false)
  const [following, setFollowing] = useState(false)
  const [menu, setMenu] = useState(false)
  const [QR, setQR] = useState(false)

  const [visibleHives, setVisibleHives] = useState(false)
  const [profileList, setProfileList] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const [headerState, setHeaderState] = useState(profileViewType)
  const [isFollowing, setIsFollowing] = useState(false)
  const [addFollowers, setAddFollowers] = useState(null)

  const [offsetHeight, setOffsetHeight] = useState(0)

  const changeHeaderHandler = () => {
    headerState === 'own' ? setHeaderState('other') : setHeaderState('own')
  }

  const toggleQR = () => {
    setQR(!QR)
  }

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState)
  }

  const toggleMenu = () => {
    setMenu(!menu)
  }

  const toggleHives = () => {
    setVisibleHives(!visibleHives)
  }
  const toggleProfileList = () => {
    setProfileList(!profileList)
  }

  const toggleFollowing = () => {
    connectUser()
  }

  const connectUser = () => {
    ProfileInfoService.follow(uid, isFollowing)
      .then(response => {
        setIsFollowing(response.data.is_following)
        setAddFollowers(response.data.is_following)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const [profileImageUrl, setProfileImageUrl] = useState('')

  const width = Dimensions.get('window').width

  useEffect(() => {
    let mounted = true

    setIsDataLoading(true)
    ProfileInfoService.getUser(uid)
      .then(response => {
        if (mounted) setOtherUserInfo(response.data)
        setIsFollowing(response.data.is_following)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        if (mounted) {
          setIsDataLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  // fetch posts

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
        uid: uid,
        limit: 5,
        page: lastPID,
      }

      const res = await PostService.getUserPosts(getPostsParams)
      if (res.success) {
        setLastPID(lastPID + 1)
        setOtherUserPosts([...otherUserPosts, ...res.data])
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
      setOtherUserPosts([])
      setLastPID(0)
      setRefresh(true)

      const params = {
        uid: uid,
        limit: 5,
        page: 0,
      }

      const res = await PostService.getUserPosts(params)
      setLastPID(1)
      setIsLoading(false)

      if (res.data.length > 0) {
        setOtherUserPosts(res.data)
      }

      setNeedsRefresh(false)
      setRefresh(false)
    } catch (err) {
      setRefresh(false)
    }
  }

  // sticky header

  const [scroll] = useState(new Animated.Value(0))

  const renderForeground = () => {
    return (
      <View
        style={{ display: 'flex' }}
        onLayout={event => {
          const layout = event.nativeEvent.layout
          setOffsetHeight(layout.height)
        }}>
        <TransparentHeader
          type={headerState}
          ellipsisState={ellipsisState}
          toggleEllipsisState={toggleEllipsisState}
          toggleFollowing={toggleFollowing}
          following={isFollowing}
          toggleMenu={toggleMenu}
          menu={menu}
          signOut={signOut}
          toggleQR={toggleQR}
          QR={QR}
          backFunction={() => navigation.goBack()}
          userInfo={otherUserInfo}
          userID={uid}
        />
        <View
          style={{
            backgroundColor: Colors.buttonDisable,
            height: normalize(158),
          }}>
          {otherUserInfo.cover_photo ? (
            <CacheableImage
              source={{ uri: otherUserInfo.cover_photo }}
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
            <HexagonBorder size={140} imgSrc={otherUserInfo.profile_photo} />
          </View>

          <ProfileLinks
            toggleHives={toggleHives}
            toggleProfileList={toggleProfileList}
            visibleHives={visibleHives}
            profileList={profileList}
            userInfo={otherUserInfo}
            addFollowers={addFollowers}
            viewType="other-user-links"
          />
        </View>
        <View style={{ backgroundColor: Colors.primaryYellow }}>
          <LoadingUserInfo isLoading={isDataLoading}>
            <ProfileInfo profileData={otherUserInfo} />
          </LoadingUserInfo>
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
      <>
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
            isFollowing={isFollowing}
            toggleMenu={toggleMenu}
            menu={menu}
            signOut={signOut}
            toggleQR={toggleQR}
            QR={QR}
            backFunction={() => navigation.goBack()}
            userInfo={otherUserInfo}
            userID={uid}
          />
        </Animated.View>
      </>
    )
  }

  const profileTabs = [
    {
      title: 'Posts',
      content: (
        <OtherUserPosts
          type="own"
          data={otherUserPosts}
          isLoading={isDataLoading}
          setIsLoading={setIsDataLoading}
          userID={uid}
          isFetching={fetchMore}
        />
      ),
    },
    {
      title: 'More Info',
      content: <MoreInfo profileInfo={otherUserInfo} />,
    },
  ]

  useEffect(() => {
    scroll.addListener(({ value }) => value)
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
        parallaxHeight={offsetHeight ? offsetHeight : normalize(425.9)}
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
            titleColor="white"
            tintColor="white"
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
    </SafeAreaView>
  )
}

const LoadingUserInfo = ({ children, isLoading }) => {
  return (
    <SkeletonContent
      containerStyle={{ flexDirection: 'column', backgroundColor: 'white' }}
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
  )
}

export default ProfileInfoModal

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
    width: '40%',
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
