import React, { useState } from 'react'
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import { Colors, normalize } from '@/globals'
import { PostPencil, PostRemove } from '@/assets/images/icons'
import Modal from 'react-native-modal'

const PostEllipsis = ({
  toggleEllipsisState,
  editPostFunction,
  deletePostFunction,
  togglePostModal,
}) => {
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

  const deletePostHandler = () => {
    alert('Post has been deleted.')
    deletePostFunction()
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
        <TouchableOpacity activeOpacity={0.7} onPress={editPostFunction}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <PostPencil width={normalize(24)} height={normalize(24)} />
            <AppText customStyle={{ marginLeft: 8 }} textStyle="body2">
              Edit Post
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={closeHandler}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <PostRemove width={normalize(24)} height={normalize(24)} />
            <AppText
              color={Colors.red}
              customStyle={{ marginLeft: 8 }}
              textStyle="body2">
              Remove Post
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
              Remove Post?
            </AppText>

            <AppText
              textStyle="caption"
              customStyle={{ textAlign: 'center' }}
              customStyle={{ marginBottom: 16 }}>
              Are you sure you want to remove this post?
            </AppText>

            <TouchableOpacity
              onPress={deletePostHandler}
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
      </PaddingView>
    </View>
  )
}

export default PostEllipsis
