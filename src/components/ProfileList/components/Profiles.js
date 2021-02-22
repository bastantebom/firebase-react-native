import AppText from '@/components/AppText/AppText'
import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import Profile from './Profile'
import { FollowersEmpty, FollowingEmpty } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Api from '@/services/Api'
import TransitionIndicator from '@/components/TransitionIndicator/TransitionIndicator'

const Profiles = ({
  data,
  type,
  viewType,
  toggleProfileList,
  followCount,
  viewUserInfo,
  isLoading,
}) => {
  const { user } = useContext(UserContext)
  const { setRefreshFollowerList } = useContext(Context)

  const renderItem = ({ item }) => (
    <Profile
      data={item}
      type={type}
      viewType={viewType}
      toggleProfileList={toggleProfileList}
    />
  )

  const handleFollow = async () => {
    try {
      const followResponse = await Api.followUser({ uid: viewUserInfo?.uid })
      if (followResponse.success) {
        setRefreshFollowerList(true)
      }
    } catch (error) {}
  }

  if (!followCount) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        {type === 'followers' ? <FollowersEmpty /> : <FollowingEmpty />}
        {viewUserInfo?.uid === user?.uid ? (
          <>
            <AppText
              textStyle="body1medium"
              customStyle={{
                marginTop: normalize(50),
                marginBottom: normalize(8),
              }}>
              {type === 'followers'
                ? 'Where’s your buzz?'
                : 'You are not following anyone yet'}
            </AppText>
            <AppText
              textStyle="body2"
              customStyle={{ textAlign: 'center', maxWidth: '90%' }}>
              {type === 'followers'
                ? 'Post about your biz and the bees will follow.'
                : 'Add more Buzzybees and bee-uild your Beeyanihan network! '}
            </AppText>
          </>
        ) : (
          <>
            <AppText
              textStyle="body1medium"
              customStyle={{
                marginTop: normalize(50),
                marginBottom: normalize(8),
              }}>
              {type === 'followers'
                ? `${viewUserInfo.full_name} has no followers yet`
                : `${viewUserInfo.full_name} is not following anyone yet`}
            </AppText>
            <AppText
              textStyle="body2"
              customStyle={{ textAlign: 'center', maxWidth: '90%' }}>
              {type === 'followers'
                ? `Bee a friend today. Connect with ${viewUserInfo.full_name}`
                : ''}
            </AppText>
            {type === 'followers' && (
              <TouchableOpacity onPress={handleFollow}>
                <AppText
                  textStyle="body2medium"
                  customStyle={{
                    textAlign: 'center',
                    color: Colors.contentOcean,
                    marginTop: normalize(16),
                  }}>
                  Follow
                </AppText>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  )
}

export default Profiles
