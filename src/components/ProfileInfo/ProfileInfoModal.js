import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
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

import { ProfileHeaderDefault } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context/index'

import { MoreInfo, Reviews } from '@/screens/Profile/Tabs'
import ProfileInfo from '@/screens/Profile/components/ProfileInfo'

function ProfileInfoModal(props) {
  const { profileViewType = 'other', uid } = props.route?.params

  const navigation = useNavigation()
  const { user, signOut, userInfo, setUserInfo } = useContext(UserContext)
  const { userPosts, otherUserPosts } = useContext(Context)
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
      renderPage: <MoreInfo profileInfo={otherUserInfo} />,
    },
  ]

  return (
    <>
      <TransparentHeader
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

      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <TabNavigation routesList={profileTabs} />
        </View>
      </View>
    </>
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
})
