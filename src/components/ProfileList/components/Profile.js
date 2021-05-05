import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import Modal from 'react-native-modal'
import { AppText } from '@/components'
import { normalize, Colors } from '@/globals'
import { FollowingEllipsis } from '@/assets/images/icons'

import FollowEllipsis from './FollowEllipsis'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { useNavigation } from '@react-navigation/native'
import ProfileInfoService from '@/services/Profile/ProfileInfo'
import Avatar from '@/components/Avatar/avatar'

const Profile = ({ data, type, viewType, toggleProfileList }) => {
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)
  const { setRefreshFollowerList } = useContext(Context)
  const {
    profile_photo,
    username,
    display_name,
    full_name,
    uid,
    is_following,
  } = data
  const [isFollowing, setIsFollowing] = useState(is_following)
  const [showMute, setShowMute] = useState(false)
  const [showEllipsis, setShowEllipsis] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const showEllipsisToggle = () => {
    setShowEllipsis(!showEllipsis)
  }

  const showMuteToggle = () => {
    setShowMute(!showMute)
  }

  const followUser = selectedUser => {
    connectUser(selectedUser.uid, false)
  }

  const unFollowUser = selectedUser => {
    connectUser(selectedUser.uid, true)
  }

  const connectUser = (selectUid, connectionType) => {
    setIsLoading(true)
    ProfileInfoService.follow(selectUid, connectionType)
      .then(response => {
        if (viewType === 'own-links') {
          setRefreshFollowerList(true)
        }
        setIsFollowing(response.data.is_following)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }

  const name = display_name ? display_name : full_name

  const openProfileHandler = () => {
    toggleProfileList()
    if (user?.uid === uid) {
      navigation.navigate('TabStack', { screen: 'You' })
    } else {
      navigation.goBack()
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: uid },
      })
    }
  }

  const FollowUnfollowButton = ({ userId }) => {
    if (isFollowing) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => unFollowUser(data)}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.primaryYellow}
            />
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 4,
                backgroundColor: Colors.primaryYellow,
              }}>
              <AppText textStyle="caption2">Following</AppText>
            </View>
          )}
        </TouchableOpacity>
      )
    }

    if (!isFollowing && userInfo.uid !== userId) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => followUser(data)}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              size="small"
              color={Colors.primaryYellow}
            />
          ) : (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 4,
                backgroundColor: Colors.neutralsWhite,
                borderWidth: 1,
                borderColor: Colors.contentEbony,
              }}>
              <AppText textStyle="caption2">Follow</AppText>
            </View>
          )}
        </TouchableOpacity>
      )
    }

    if (!isFollowing && userInfo.uid === userId) {
      return null
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row', flex: 1 }}
        activeOpacity={0.7}
        onPress={openProfileHandler}>
        <View style={styles.userInfoImageContainer}>
          <Avatar
            path={profile_photo}
            size="64x64"
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <AppText textStyle="body1">
            {name.length > 19 ? `${name.substring(0, 19)}...` : name}
          </AppText>
          <AppText textStyle="metadata">@{username}</AppText>
        </View>
      </TouchableOpacity>

      {viewType === 'own-links' && type === 'followers' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FollowUnfollowButton userId={uid} uName={username} />
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={showEllipsisToggle}>
            <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      ) : null}

      {viewType === 'own-links' && type === 'following' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={showEllipsisToggle}>
            <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      ) : null}

      {viewType === 'other-user-links' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FollowUnfollowButton userId={uid} uName={username} />
        </View>
      ) : null}
      <Modal
        isVisible={showEllipsis}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={showMuteToggle}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={showEllipsisToggle}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <FollowEllipsis
            userInfo={data}
            showEllipsisToggle={showEllipsisToggle}
            isFollowing={isFollowing}
            connectUser={(UID, cT) => connectUser(UID, cT)}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
    borderColor: Colors.neutralsZirconLight,
    borderWidth: 1,
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginTop: 8,
    marginBottom: 32,
  },
})

export default Profile
