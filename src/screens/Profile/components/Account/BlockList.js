import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import {
  ScreenHeaderTitle,
  AppText,
  ProfileInfo,
  TransitionIndicator,
} from '@/components'

import { normalize, Colors } from '@/globals'
import Modal from 'react-native-modal'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

const BlockList = ({ toggleBlockedUser }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const [selectedUser, setSelectedUser] = useState({})
  const [blockUsers, setBlockUsers] = useState([])
  const [showCancelModal, setShowCancelModal] = useState(false)
  const cancelModalToggle = user => {
    setShowCancelModal(!showCancelModal)
    setSelectedUser(user)
  }
  const [isLoading, setIsLoading] = useState(false)

  const closeHandler = value => {
    setShowCancelModal(!showCancelModal)
  }

  const unBlockUser = async () => {
    const unblockUser = await Api.unblockUser({ uid: selectedUser.uid })
    if (unblockUser.success) {
      setIsLoading(true)
      setBlockUsers([])
      getBlockUsers()
    }
    closeHandler()
  }

  const getBlockUsers = async () => {
    try {
      const blockUsers = await Api.getBlockedUsers({ uid: user?.uid })
      if (!blockUsers.success) return
      else {
        const blockList = await Promise.all(
          blockUsers.blocked_users.map(async blocked => {
            const getUser = await Api.getUser({ uid: blocked.blocked_uid })
            if (!getUser.success) return
            else {
              return {
                ...getUser.data,
              }
            }
          })
        )
        const filtered = blockList.filter(user => user)
        setBlockUsers(blockUsers => [...blockUsers, ...filtered])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error || error.message)
    }
  }

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    if (isMounted) getBlockUsers()
    return () => (isMounted = false)
  }, [])

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TransitionIndicator loading={isLoading} />
        <View style={{ padding: normalize(16) }}>
          <ScreenHeaderTitle title="Blocked Users" close={toggleBlockedUser} />
        </View>
        <View
          style={{
            marginTop: normalize(10),
            borderTopColor: Colors.neutralGray,
            borderTopWidth: 1,
          }}>
          {blockUsers?.length
            ? blockUsers.map((user, index) => {
                return (
                  <ProfileInfo
                    key={index}
                    userInfo={user}
                    type="block-user"
                    cancelModalToggle={() => {
                      cancelModalToggle(user)
                    }}
                  />
                )
              })
            : !isLoading && (
                <View style={{ padding: 16 }}>
                  <AppText textStyle="caption">
                    You don't have any block user
                  </AppText>
                </View>
              )}
        </View>
      </SafeAreaView>
      <Modal
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={450}
        animationOut="bounceOut"
        animationOutTiming={450}
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
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{ marginBottom: 16 }}>
            Unblock {selectedUser.display_name}?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{ textAlign: 'center' }}
            customStyle={{ marginBottom: 16 }}>
            Are you sure you want to unblock {selectedUser.display_name}?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              unBlockUser()
            }}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Continue</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => closeHandler('cancel')}
            style={{
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
            }}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

// define your styles

//make this component available to the app
export default BlockList
