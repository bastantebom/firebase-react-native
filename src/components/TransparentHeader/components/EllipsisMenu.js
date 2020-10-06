import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import Modal from 'react-native-modal';
import {Colors, normalize} from '@/globals';
import {UserContext} from '@/context/UserContext';
import ConfirmationOtherProfile from './ConfirmationOtherProfile.js';

import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
} from '@/assets/images/icons';
import Report from './Report';

const EllipsisMenu = ({
  toggleEllipsisState,
  togglePostModal,
  userInfo,
  userID,
  //blockUser,
}) => {
  const {username} = userInfo;
  //console.log(userID);
  const [reportUser, setReportUser] = useState(false);

  const toggleReportUser = () => {
    setReportUser(!reportUser);
    if (reportUser) toggleEllipsisState();
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
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
          <TouchableOpacity activeOpacity={0.7} onPress={toggleReportUser}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <ProfileReport />
              <AppText customStyle={{marginLeft: 8}} textStyle="body2">
                Report @{username}
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              closeHandler();
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
                customStyle={{marginLeft: 8}}
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
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmationOtherProfile
          toggleEllipsisState={toggleEllipsisState}
          userID={userID}
        />
      </Modal>
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
          username={username}
          userID={userID}
          type="user"
        />
      </Modal>
    </>
  );
};

export default EllipsisMenu;
