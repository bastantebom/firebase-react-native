import React, { useState, useEffect, useContext } from 'react'
import { View, TouchableOpacity, SafeAreaView } from 'react-native'

import { AppText, PaddingView, TabNavigation } from '@/components'
import { HeaderBackGray } from '@/assets/images/icons'
import { normalize } from '@/globals'
import Profiles from './components/Profiles'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import Api from '@/services/Api'
import TransitionIndicator from '../TransitionIndicator/TransitionIndicator'

const ProfileList = ({ toggleProfileList, viewUserInfo, viewType }) => {
  const { user } = useContext(UserContext)
  const { refreshFollowerList } = useContext(Context)
  const { uid } = viewUserInfo
  const [followersList, setFollowersList] = useState([])
  const [followersCount, setFollowersCount] = useState()
  const [followingsList, setFollowingsList] = useState([])
  const [followingsCount, setFollowingsCount] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const getConnectionList = async () => {
    setIsLoading(true)
    try {
      const followers = await Api.getFollowers({ uid })
      const following = await Api.getFollowing({ uid })
      if (!followers.success || !following.success)
        throw new Error(following.message || followers.message)
      setFollowersList(followers.data.sort(a => (a.uid === user.uid ? -1 : 1)))
      setFollowersCount(followers.data.length)
      setFollowingsList(following.data.sort(a => (a.uid === user.uid ? -1 : 1)))
      setFollowingsCount(following.data.length)
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let mounted = true
    if (uid && mounted) getConnectionList()
    return () => {
      mounted = false
    }
  }, [uid])

  useEffect(() => {
    let mounted = true
    if (refreshFollowerList && mounted) getConnectionList()
    return () => {
      mounted = false
    }
  }, [refreshFollowerList])

  const routes = [
    {
      key: 'followers',
      title: `Followers`,
      renderPage: (
        <View style={{ flex: 1, padding: 16 }}>
          <Profiles
            data={followersList}
            toggleProfileList={toggleProfileList}
            type="followers"
            viewType={viewType}
            followCount={followersCount}
            viewUserInfo={viewUserInfo}
          />
        </View>
      ),
      numberBadge: followersCount,
    },
    {
      key: 'following',
      title: `Following`,
      renderPage: (
        <View style={{ flex: 1, padding: 16 }}>
          <Profiles
            data={followingsList}
            toggleProfileList={toggleProfileList}
            type="following"
            viewType={viewType}
            followCount={followingsCount}
            viewUserInfo={viewUserInfo}
          />
        </View>
      ),
      numberBadge: followingsCount,
    },
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isLoading} />
      <View style={{ flex: 1 }}>
        <PaddingView paddingSize={3}>
          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={toggleProfileList}
              activeOpacity={0.7}
              style={{
                position: 'absolute',
                left: normalize(-6),
                padding: normalize(6),
              }}>
              <HeaderBackGray width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
            <AppText textStyle="body3">
              {viewUserInfo.display_name
                ? viewUserInfo.display_name
                : viewUserInfo.full_name}
            </AppText>
          </View>
        </PaddingView>
        <TabNavigation routesList={routes} />
      </View>
    </SafeAreaView>
  )
}

export default ProfileList
