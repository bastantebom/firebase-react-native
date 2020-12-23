import AppText from '@/components/AppText/AppText'
import React from 'react'
import { FlatList, View } from 'react-native'

import Profile from './Profile'
import { FollowersEmpty, FollowingEmpty } from '@/assets/images'
import { normalize } from '@/globals'

const Profiles = ({ data, type, viewType, toggleProfileList, followCount }) => {
  const renderItem = ({ item }) => (
    <Profile
      data={item}
      type={type}
      viewType={viewType}
      toggleProfileList={toggleProfileList}
    />
  )

  if (!followCount) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        {type === 'followers' ? <FollowersEmpty /> : <FollowingEmpty />}
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
