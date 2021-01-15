import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import { Colors, normalize } from '@/globals'
import { ProfileReport, PostRemove } from '@/assets/images/icons'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'

const OtherPostEllipsis = ({
  toggleEllipsisState,
  togglePostModal,
  postTitle,
  postId,
  hidePost,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const navigation = useNavigation()

  const handleReportPress = () => {
    navigation.navigate('NBTScreen', {
      screen: 'report',
      params: {
        post: {
          id: postId,
          title: postTitle,
        },
      },
    })
    toggleEllipsisState()
  }

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

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <TouchableOpacity activeOpacity={0.7} onPress={closeHandler}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <PostRemove />
            <AppText
              customStyle={{ marginLeft: 8 }}
              color={Colors.red}
              textStyle="body2">
              Hide Post
            </AppText>
          </View>
          <View style={{ marginBottom: 16 }}>
            <AppText
              customStyle={{ marginLeft: 8, paddingLeft: normalize(22) }}
              textStyle="caption"
              color={Colors.red}>
              Hide this post from your feed.
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={handleReportPress}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ProfileReport />
            <AppText customStyle={{ marginLeft: 8 }} textStyle="body2">
              Report Post
            </AppText>
          </View>
          <View style={{ marginBottom: 16, paddingLeft: normalize(22) }}>
            <AppText customStyle={{ marginLeft: 8 }} textStyle="caption">
              Report this post for action by Servbees.
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
            Hide this Post?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{ textAlign: 'center' }}
            customStyle={{ marginBottom: 16 }}>
            Are you sure you want to hide this post?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              hidePost()
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
    </View>
  )
}

export default OtherPostEllipsis
