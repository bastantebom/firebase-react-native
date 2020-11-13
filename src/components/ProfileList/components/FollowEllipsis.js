import React, { useState, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import Modal from 'react-native-modal'
import { Colors, normalize } from '@/globals'
import { UserContext } from '@/context/UserContext'
import UnfollowContent from './UnfollowContent'
//import RemoveFollowerContent from './RemovFollowerContent';
import ConfirmationOtherProfile from '@/components/TransparentHeader/components/ConfirmationOtherProfile'

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
  FollowUnfollow,
} from '@/assets/images/icons'
import Report from '@/components/TransparentHeader/components/Report'
import ReportContent from './ReportContent'

const FollowEllipsis = ({
  showEllipsisToggle,
  togglePostModal,
  userInfo,
  userID,
  isFollowing,
  connectUser,
}) => {
  const { username } = userInfo
  const [reportUser, setReportUser] = useState(false)
  const [unfollow, setUnfollow] = useState(false)

  const unfollowToggle = () => {
    if (isFollowing) {
      setUnfollow(!unfollow)
    } else {
      followingHandler()
    }
  }

  const toggleReportUser = () => {
    setReportUser(!reportUser)
    if (reportUser) showEllipsisToggle()
  }

  const [showCancelModal, setShowCancelModal] = useState(false)
  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal)
  }

  const closeHandler = value => {
    cancelModalToggle()
  }

  const followingHandler = () => {
    showEllipsisToggle()
    connectUser(userInfo.uid, isFollowing)
  }

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          paddingBottom: 24,
          borderTopEndRadius: 8,
          borderTopStartRadius: 8,
        }}>
        <BottomSheetHeader />
        <PaddingView paddingSize={2}>
          <TouchableOpacity activeOpacity={0.7} onPress={unfollowToggle}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              {isFollowing ? (
                <FollowUnfollow width={normalize(20)} height={normalize(20)} />
              ) : (
                <FollowUnfollow width={normalize(20)} height={normalize(20)} />
              )}
              <AppText customStyle={{ marginLeft: 8 }} textStyle="body2">
                {isFollowing ? 'Unfollow' : 'Follow'} @{username}
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={toggleReportUser}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <ProfileReport />
              <AppText customStyle={{ marginLeft: 8 }} textStyle="body2">
                Report @{username}
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              closeHandler()
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <ProfileBlockRed />
              <AppText
                color={Colors.red}
                customStyle={{ marginLeft: 8 }}
                textStyle="body2">
                Block @{username}
              </AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={showEllipsisToggle}>
            <View
              style={{
                backgroundColor: Colors.neutralsZircon,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
              }}>
              <AppText textStyle="button2">Cancel</AppText>
            </View>
          </TouchableOpacity>
        </PaddingView>
      </View>

      <Modal
        isVisible={reportUser}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={toggleReportUser}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={toggleReportUser}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <ReportContent
            data={userInfo}
            reportToggleUser={toggleReportUser}
            reportUserHandler={() => {}}
          />
        </View>
      </Modal>

      <Modal
        isVisible={unfollow}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={unfollowToggle}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={unfollowToggle}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <UnfollowContent
            data={userInfo}
            unfollowToggle={unfollowToggle}
            unfollowHandler={followingHandler}
            isFollowing={isFollowing}
            showEllipsisToggle={showEllipsisToggle}
          />
        </View>
      </Modal>
    </>
  )
}

export default FollowEllipsis
