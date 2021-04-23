import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native'

import {
  AppText,
  HexagonBorder,
  TransparentHeader,
  ProfileLinks,
  CacheableImage,
  StickyHeader,
  Divider,
} from '@/components'

import StickyParallaxHeader from 'react-native-sticky-parallax-header'

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors, GlobalStyle } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo, UserPostEmpty } from './Tabs'
import ProfileInfo from './components/ProfileInfo'
import ProfileButtons from './components/ProfileButtons'
import { VerificationStatus } from './components'

import Posts from '@/screens/Dashboard/components/posts'
import { cloneDeep, isEmpty } from 'lodash'

import Api from '@/services/Api'
import ImageApi from '@/services/image-api'
import { isUrl } from '@/globals/Utils'
import Toast from '@/components/toast'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const ProfileScreen = ({
  profileViewType = 'profile',
  backFunction,
  navigation,
}) => {
  const { user, signOut, userInfo, userStatus } = useContext(UserContext)
  const { needsRefresh, setNeedsRefresh } = useContext(Context)
  const [userPosts, setUserPosts] = useState({})

  const [ellipsisState, setEllipsisState] = useState(false)
  const [following, setFollowing] = useState(false)
  const [menu, setMenu] = useState(false)
  const [QR, setQR] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [visibleHives, setVisibleHives] = useState(false)
  const [visibleFollowing, setVisibleFollowing] = useState(false)
  const [profileList, setProfileList] = useState(false)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null)

  const [offsetHeight, setOffsetHeight] = useState(0)

  const [headerState, setHeaderState] = useState(profileViewType)

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

  const toggleProfileList = () => {
    setProfileList(!profileList)
  }

  const handlePostPress = post => {
    navigation.navigate('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'published-post',
        params: {
          post,
        },
      },
    })
  }

  const statusPercentage =
    Object.values(userStatus?.verified || {}).reduce(
      (a, status) => a + (status === 'completed' ? 1 : 0),
      0
    ) * 0.25

  const updateCoverPhotoUrl = async () => {
    setCoverPhotoUrl(null)
    const path = userInfo.cover_photo
    if (!path) return
    if (isUrl(path)) setCoverPhotoUrl(path)
    else if (path) {
      const url =
        (await ImageApi.getUrl({ path, size: '375x157' })) ||
        (await ImageApi.getUrl({ path }))
      setCoverPhotoUrl(url)
    }
  }

  useEffect(() => {
    if (needsRefresh) refreshPosts()
  }, [needsRefresh])

  useEffect(() => {
    updateCoverPhotoUrl()
  }, [userInfo.cover_photo])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const [lastPID, setLastPID] = useState(0)
  const [fetchMore, setFetchMore] = useState(false)
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const getDeferredData = post => {
    return Promise.all([
      Api.getUser({ uid: post.uid }).then(response => {
        setUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            user: response.data,
          },
        }))
      }),
      Api.getPostLikes({ pid: post.id }).then(response => {
        setUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            likes: response.likes,
          },
        }))
      }),
    ])
      .then(() => {
        setUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $hasErrors: true,
          },
        }))
      })
  }

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

      const res = await Api.getUserPosts(getPostsParams)
      if (!res.success) throw new Error(res.message)

      if (res.data) {
        const userPosts = res.data
          .map(post => ({ ...post, $isLoading: true }))
          .reduce(
            (_posts, post) => ({
              ..._posts,
              [post.id]: post,
            }),
            {}
          )

        setUserPosts(posts => ({ ...posts, ...userPosts }))

        setLastPID(lastPID + 1)
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
      setUserPosts({})
      setLastPID(0)
      setRefresh(true)

      const params = {
        uid: user.uid,
        limit: 5,
        page: 0,
      }
      const res = await Api.getUserPosts(params)
      if (!res.success) throw new Error(res.message)

      if (res.data.length) {
        const userPosts = res.data
          .map(post => ({ ...post, $isLoading: true }))
          .reduce(
            (_posts, post) => ({
              ..._posts,
              [post.id]: post,
            }),
            {}
          )

        setUserPosts(posts => ({ ...posts, ...userPosts }))
        setLastPID(1)
        setIsLoading(false)
        setNeedsRefresh(false)
      }
      setRefresh(false)
    } catch (err) {
      setRefresh(false)
    }
  }

  const handleLikePress = async post => {
    const oldLikes = cloneDeep(post.likes || [])
    const newLikes = cloneDeep(post.likes || [])

    const liked = post.likes?.includes(user.uid)
    if (liked) newLikes.splice(newLikes.indexOf(user.uid), 1)
    else newLikes.push(user.uid)

    setUserPosts(posts => ({
      ...posts,
      [post.id]: {
        ...posts[post.id],
        likes: newLikes,
      },
    }))

    try {
      const response = await Api[liked ? 'unlikePost' : 'likePost']({
        pid: post.id,
      })

      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error.message || error)

      setUserPosts(posts => ({
        ...posts,
        [post.id]: {
          ...posts[post.id],
          likes: oldLikes,
        },
      }))
    }
  }

  useEffect(() => {
    Object.values(userPosts)
      .filter(post => !post.$promise)
      .forEach(post => {
        setUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $promise: getDeferredData(post),
          },
        }))
      })
  }, [userPosts])

  const [scroll] = useState(new Animated.Value(0))

  const renderForeground = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Toast
          containerStyle={{
            marginTop: getStatusBarHeight() + normalize(8),
          }}
          ref={ref => Toast.setRef(ref, 'profile')}
        />
        <View
          style={{ display: 'flex' }}
          onLayout={event => {
            const layout = event.nativeEvent.layout
            setOffsetHeight(layout.height)
          }}>
          <View>
            <TransparentHeader
              type="own"
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
              style={{
                backgroundColor: Colors.buttonDisable,
                height: normalize(158),
              }}>
              {userInfo.cover_photo && isUrl(coverPhotoUrl) ? (
                <CacheableImage
                  source={{ uri: coverPhotoUrl }}
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
                <HexagonBorder
                  size={140}
                  path={userInfo.profile_photo}
                  dimensions="256x256"
                />
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
            <View style={{ marginBottom: normalize(8) }} />

            {!userInfo.account_verified ? (
              <VerificationStatus statusPercentage={statusPercentage} />
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.neutralsWhite,
                paddingHorizontal: normalize(24),
                paddingVertical: normalize(16),
              }}>
              <ProfileButtons />
            </View>

            <Divider
              style={[
                GlobalStyle.dividerStyle,
                {
                  marginVertical: normalize(8),
                  backgroundColor: Colors.neutralsZircon,
                  height: normalize(4),
                },
              ]}
            />
          </View>
        </View>
      </>
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
          userInfo={userInfo}
          coverPhotoUrl={coverPhotoUrl}
        />
      </Animated.View>
    )
  }

  const profileTabs = [
    {
      title: 'Posts',
      content: !isEmpty(userPosts) ? (
        <Posts
          posts={userPosts}
          onPostPress={handlePostPress}
          onLikePress={handleLikePress}
          isLoadingMoreItems={fetchMore}
          scrollEnabled={true}
        />
      ) : (
        <UserPostEmpty userInfo={userInfo} />
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
    <>
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
        headerHeight={scrollPosition < 100 ? 0 : normalize(116)}
        headerSize={() => {}}
        scrollEvent={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroll } } }],
          {
            useNativeDriver: false,
            listener: event => handleScroll(event),
          }
        )}
        snapToEdge={false}
        transparentHeader={scrollPosition < 250 ? true : false}
        onEndReached={getMorePost}
        refreshControl={
          <RefreshControl
            style={{ zIndex: 1 }}
            refreshing={refresh}
            titleColor="#2E3034"
            tintColor="#2E3034"
            onRefresh={refreshPosts}
          />
        }
        tabs={profileTabs}
        tabTextStyle={styles.tabTextStyle}
        tabTextActiveStyle={{
          color: Colors.contentOcean,
        }}
        tabTextContainerStyle={{
          flexGrow: 1,
          borderBottomColor: 'transparent',
          borderBottomWidth: normalize(4),
        }}
        tabTextContainerActiveStyle={{
          borderBottomColor: Colors.contentOcean,
          borderBottomWidth: normalize(4),
          borderRadius: 2,
        }}
        tabsContainerStyle={{
          height: normalize(40),
          width: Dimensions.get('window').width + normalize(18) * 2,
          backgroundColor: 'white',
        }}
        contentContainerStyles={{
          backgroundColor: Colors.neutralsWhite,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#DADCE0',
          ...Platform.select({
            ios: {
              height: Dimensions.get('window').height * 0.8,
            },
            android: {
              flexGrow: 1,
            },
          }),
        }}></StickyParallaxHeader>
    </>
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
    top:
      Platform.OS === 'android'
        ? -Dimensions.get('window').height * 0.1
        : Dimensions.get('window').height > 850
        ? '-17%'
        : Dimensions.get('window').height > 660
        ? '-21%'
        : '-28%',
    paddingLeft: normalize(24),
  },
  tabTextStyle: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: normalize(2),
    flexGrow: 1,
    paddingHorizontal: normalize(10),
  },
})

export default ProfileScreen
