import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import Modal from 'react-native-modal'
import { Colors, normalize } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'
import firestore from '@react-native-firebase/firestore'
import ConfirmationOtherProfile from './ConfirmationOtherProfile.js'

import {
  ProfileReport,
  ProfileBlockRed,
  HeaderFollowingBlack,
  HeaderFollowBlack,
  SendMessage,
} from '@/assets/images/icons'

const EllipsisMenu = ({
  toggleEllipsisState,
  togglePostModal,
  userInfo,
  userID,
  isFollowing,
  toggleFollowing,
}) => {
  const { username } = userInfo
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const handleReportPress = () => {
    navigation.navigate('NBTScreen', {
      screen: 'report',
      params: { user: userInfo },
    })
    toggleEllipsisState()
  }

  const [showCancelModal, setShowCancelModal] = useState(false)
  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal)
  }

  const closeHandler = value => {
    cancelModalToggle()
    setTimeout(() => {
      togglePostModal = { togglePostModal }
    }, 200)
    cancelModalToggle()
  }

  const followingHandler = () => {
    toggleEllipsisState?.()

    toggleFollowing()
  }

  const handleChatPress = async () => {
    let channel
    try {
      if (!user?.uid) return
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [user.uid]: true,
          [userID]: true,
        })
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')

        const { id } = await ref.add({
          members: {
            [user.uid]: true,
            [userID]: true,
          },
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }
      toggleEllipsisState()
      navigation.navigate('Chat', { user, channel })
    } catch (error) {
      console.log(error)
    }
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
          {/* <TouchableOpacity activeOpacity={0.7}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileMute />
            <AppText customStyle={{marginLeft: 8}} textStyle="body2">
              Mute @{username}
            </AppText>
          </View>
        </TouchableOpacity> */}
          <TouchableOpacity activeOpacity={0.7} onPress={followingHandler}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              {isFollowing ? (
                <HeaderFollowingBlack
                  width={normalize(20)}
                  height={normalize(20)}
                />
              ) : (
                <HeaderFollowBlack
                  width={normalize(20)}
                  height={normalize(20)}
                />
              )}
              <AppText customStyle={{ marginLeft: 8 }} textStyle="body2">
                {isFollowing ? 'Following' : 'Follow'}
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={handleReportPress}>
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

          <TouchableOpacity activeOpacity={0.7} onPress={toggleEllipsisState}>
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
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={250}
        animationOut="bounceOut"
        animationOutTiming={200}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmationOtherProfile
          toggleEllipsisState={toggleEllipsisState}
          userID={userID}
        />
      </Modal>
    </>
  )
}

export default EllipsisMenu
