import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native'

import ProfileInfoService from '@/services/Profile/ProfileInfo'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'
import { useNavigation } from '@react-navigation/native'

import {
  HexagonBorder,
  TransparentHeader,
  ProfileLinks,
  CacheableImage,
} from '@/components'

import StickyParallaxHeader from 'react-native-sticky-parallax-header'

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo } from '@/screens/Profile/Tabs'
import ProfileInfo from '@/screens/Profile/components/ProfileInfo'
import StickyHeader from '../TransparentHeader/StickyHeader'

import Posts from '@/screens/Dashboard//components/posts'
import { cloneDeep } from 'lodash'
import Api from '@/services/Api'
import ImageApi from '@/services/image-api'
import { isUrl } from '@/globals/Utils'

function ProfileInfoModal(props) {
  const { profileViewType = 'profile', uid } = props.route?.params

  const navigation = useNavigation()
  const { user, signOut } = useContext(UserContext)
  const { needsRefresh } = useContext(Context)
  const [otherUserPosts, setOtherUserPosts] = useState({})
  const [otherUserInfo, setOtherUserInfo] = useState({})

  const [ellipsisState, setEllipsisState] = useState(false)
  const [menu, setMenu] = useState(false)
  const [QR, setQR] = useState(false)

  const [visibleHives, setVisibleHives] = useState(false)
  const [profileList, setProfileList] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const [headerState, setHeaderState] = useState(profileViewType)
  const [isFollowing, setIsFollowing] = useState(false)
  const [addFollowers, setAddFollowers] = useState(null)

  const [offsetHeight, setOffsetHeight] = useState(0)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null)

  const toggleQR = () => setQR(!QR)

  const toggleEllipsisState = () => setEllipsisState(!ellipsisState)

  const toggleMenu = () => setMenu(!menu)

  const toggleHives = () => setVisibleHives(!visibleHives)

  const toggleProfileList = () => setProfileList(!profileList)

  const toggleFollowing = () => {
    ProfileInfoService.follow(uid, isFollowing)
      .then(response => {
        setIsFollowing(response.data.is_following)
        setAddFollowers(response.data.is_following)
      })
      .catch(err => {
        console.log(err)
      })
  }

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

  const updateCoverPhotoUrl = async () => {
    setCoverPhotoUrl(null)
    const path = otherUserInfo.cover_photo
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
    updateCoverPhotoUrl()
  }, [otherUserInfo.cover_photo])

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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [totalPages, setTotalPages] = useState(Infinity)

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

        setOtherUserPosts(posts => ({ ...posts, ...userPosts }))

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

  const getDeferredData = post => {
    return Promise.all([
      Api.getUser({ uid: post.uid }).then(response => {
        setOtherUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            user: response.data,
          },
        }))
      }),
      Api.getPostLikes({ pid: post.id }).then(response => {
        setOtherUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            likes: response.likes,
          },
        }))
      }),
    ])
      .then(() => {
        setOtherUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $isLoading: false,
          },
        }))
      })
      .catch(() => {
        setOtherUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $hasErrors: true,
          },
        }))
      })
  }

  const refreshPosts = async () => {
    try {
      setOtherUserPosts({})
      setLastPID(0)
      setRefresh(true)

      const params = {
        uid: uid,
        limit: 5,
        page: 0,
      }
      const res = await Api.getUserPosts(params)
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

        setOtherUserPosts(posts => ({ ...posts, ...userPosts }))

        setLastPID(1)
        setIsLoading(false)
      }

      setNeedsRefresh(false)
      setRefresh(false)
    } catch (err) {
      setRefresh(false)
    }
  }

  const handlePostPress = post => {
    navigation.navigate('NBTScreen', {
      screen: 'OthersPost',
      params: {
        data: post,
        viewing: true,
        created: false,
        edited: false,
        othersView: user?.uid !== post.uid,
      },
    })
  }

  const handleLikePress = async post => {
    const oldLikes = cloneDeep(post.likes)
    const newLikes = cloneDeep(post.likes)

    const liked = post.likes?.includes(user.uid)
    if (liked) newLikes.splice(newLikes.indexOf(user.uid), 1)
    else newLikes.push(user.uid)

    setOtherUserPosts(posts => ({
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

      setOtherUserPosts(posts => ({
        ...posts,
        [post.id]: {
          ...posts[post.id],
          likes: oldLikes,
        },
      }))
    }
  }

  useEffect(() => {
    Object.values(otherUserPosts)
      .filter(post => !post.$promise)
      .forEach(post => {
        setOtherUserPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $promise: getDeferredData(post),
          },
        }))
      })
  }, [otherUserPosts])

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
          type="other"
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
          {otherUserInfo.cover_photo && coverPhotoUrl ? (
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
              path={otherUserInfo.profile_photo}
              dimensions="256x256"
            />
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
            coverPhotoUrl={coverPhotoUrl}
          />
        </Animated.View>
      </>
    )
  }

  const profileTabs = [
    {
      title: 'Posts',
      content: (
        <Posts
          posts={otherUserPosts}
          onPostPress={handlePostPress}
          onLikePress={handleLikePress}
          isLoadingMoreItems={isDataLoading}
          showsVerticalScrollIndicator={false}
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
    return () => scroll.removeListener(({ value }) => value)
  }, [scroll])

  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = event => {
    const position = event.nativeEvent.contentOffset.y
    setScrollPosition(position)
  }

  return (
    <View style={{ flex: 1 }}>
      <StickyParallaxHeader
        foreground={renderForeground()}
        header={renderHeader()}
        parallaxHeight={offsetHeight ? offsetHeight : normalize(425.9)}
        headerHeight={scrollPosition < 100 ? 0 : normalize(115)}
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
          borderBottomColor: 'transparent',
          borderBottomWidth: normalize(4),
        }}
        tabTextContainerActiveStyle={{
          borderBottomColor: Colors.secondaryRoyalBlue,
          borderBottomWidth: normalize(4),
        }}
        tabsContainerStyle={{
          height: normalize(50),
          width: Dimensions.get('window').width + normalize(18) * 2,
          backgroundColor: Colors.neutralsWhite,
          borderBottomColor: Colors.neutralGray,
          borderBottomWidth: normalize(4),
        }}
        contentContainerStyles={{
          backgroundColor: Colors.neutralsWhite,
          borderBottomColor: Colors.neutralGray,
          borderBottomWidth: normalize(10),
        }}></StickyParallaxHeader>
    </View>
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
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: normalize(10),
  },
})
