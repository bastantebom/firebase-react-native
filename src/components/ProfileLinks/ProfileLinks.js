import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { normalize, Colors } from '@/globals'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { ProfileList } from '@/components'
import Hives from './components/hives'
import Modal from 'react-native-modal'

import Api from '@/services/Api'
import { AppText } from '@/components'

const ProfileLinks = ({
  visibleHives,
  profileList,
  toggleHives,
  toggleProfileList,
  userInfo,
  addFollowers,
  viewType,
}) => {
  const { uid } = userInfo
  const [followers, setFollowers] = useState(0)
  const [postCount, setPostCount] = useState(0)

  const getProfileCounters = async () => {
    try {
      const followersResponse = await Api.getFollowers({ uid })
      if (followersResponse.success) setFollowers(followersResponse.data.length)
      const postCountResponse = await Api.getUserPostsCount({ uid })
      if (postCountResponse.success) setPostCount(postCountResponse.count)
    } catch (error) {
      console.log(error.message || error)
    }
  }

  useEffect(() => {
    if (uid) getProfileCounters()
  }, [uid])

  useEffect(() => {
    if (addFollowers !== null) {
      if (addFollowers) setFollowers(followers + 1)
      else setFollowers(followers - 1)
    }
  }, [addFollowers])

  return (
    <>
      <View style={styles.profileLinksWrapper}>
        <View style={styles.firstLink}>
          <AppText textStyle="subtitle1">{postCount}</AppText>
          <AppText
            textStyle="captionDashboard"
            color={Colors.profileLink}
            customStyle={{ paddingLeft: normalize(8) }}>
            {postCount < 2 ? 'Post' : 'Posts'}
          </AppText>
        </View>
        <TouchableOpacity onPress={toggleProfileList}>
          <View style={styles.individualLink}>
            <AppText textStyle="subtitle1">{followers}</AppText>
            <AppText textStyle="captionDashboard" color={Colors.profileLink}>
              {followers < 2 ? 'Follower' : 'Followers'}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={profileList}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleProfileList}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <ProfileList
          viewType={viewType}
          toggleProfileList={toggleProfileList}
          viewUserInfo={userInfo}
        />
      </Modal>

      <Modal
        isVisible={visibleHives}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleHives}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <Hives toggleHives={toggleHives} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  profileLinksWrapper: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(14),
    height: normalize(48),
  },

  firstLink: {
    alignItems: 'center',
  },

  individualLink: {
    alignItems: 'center',
    marginLeft: normalize(24),
  },
})

export default ProfileLinks
