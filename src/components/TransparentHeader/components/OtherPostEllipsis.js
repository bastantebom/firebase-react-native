import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';
import {ProfileReport, PostRemove} from '@/assets/images/icons';
import Modal from 'react-native-modal';
import Report from './Report';

const OtherPostEllipsis = ({
  toggleEllipsisState,
  togglePostModal,
  postTitle,
  postId,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reportUser, setReportUser] = useState(false);

  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal);
  };

  const closeHandler = (value) => {
    cancelModalToggle();
    setTimeout(() => {
      togglePostModal = {togglePostModal};
    }, 200);

    cancelModalToggle();
  };

  const toggleReportUser = () => {
    setReportUser(!reportUser);
    if (reportUser) {
      toggleEllipsisState();
      //togglePostModal();
    }
  };

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
        <TouchableOpacity activeOpacity={0.7}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <PostRemove />
            <AppText
              customStyle={{marginLeft: 8}}
              color={Colors.red}
              textStyle="body2">
              Hide Post
            </AppText>
          </View>
          <View style={{marginBottom: 16}}>
            <AppText
              customStyle={{marginLeft: 8, paddingLeft: normalize(22)}}
              textStyle="caption"
              color={Colors.red}>
              Hide this post from your feed.
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={toggleReportUser}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ProfileReport />
            <AppText customStyle={{marginLeft: 8}} textStyle="body2">
              Report Post
            </AppText>
          </View>
          <View style={{marginBottom: 16, paddingLeft: normalize(22)}}>
            <AppText customStyle={{marginLeft: 8}} textStyle="caption">
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
        isVisible={reportUser}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <Report
          toggleReportUser={toggleReportUser}
          postId={postId}
          postTitle={postTitle}
          type="post"
        />
      </Modal>
    </View>
  );
};

export default OtherPostEllipsis;
