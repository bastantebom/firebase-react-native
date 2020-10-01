//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  ProfileInfo,
} from '@/components';
import {CloseDark} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {UserContext} from '@/context/UserContext';
import AdminFunctionService from '@/services/Admin/AdminFunctions';

// create a component
const BlockList = ({toggleBlockedUser}) => {
  const {userInfo, user, setUserInfo} = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState({});
  const {blocked_users} = userInfo;
  const [blockUsers, setBlockUsers] = useState(blocked_users);

  //console.log(userInfo);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const cancelModalToggle = (user) => {
    setShowCancelModal(!showCancelModal);
    setSelectedUser(user);
  };

  const closeHandler = (value) => {
    setShowCancelModal(!showCancelModal);
  };

  const unBlockUser = async () => {
    //body: { uid, pid }
    return await AdminFunctionService.unBlockUser({
      uid: user?.uid,
      reported_uid: selectedUser.uid,
    }).then((res) => {
      if (res.success) {
        console.log(res);
        setBlockUsers(res.blocked_users);
        setUserInfo({...userInfo, blocked_users: res.blocked_users});
      }
      closeHandler();
    });
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={{paddingHorizontal: normalize(16)}}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Blocked Users"
            close={toggleBlockedUser}
          />
        </View>
        <View
          style={{
            marginTop: normalize(10),
            borderTopColor: Colors.neutralGray,
            borderTopWidth: 2,
          }}>
          {blockUsers && blockUsers.length > 0 ? (
            blockUsers.map((user, index) => {
              return (
                <ProfileInfo
                  key={index}
                  userInfo={user}
                  type="block-user"
                  cancelModalToggle={() => {
                    cancelModalToggle(user);
                  }}
                />
              );
            })
          ) : (
            <AppText textStyle="caption">You don't have any block user</AppText>
          )}
        </View>

        {/* About Servbees Modal */}
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
            <View style={{flex: 1, backgroundColor: 'black'}} />
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
          <AppText textStyle="display6" customStyle={{marginBottom: 16}}>
            Unblock {selectedUser.display_name}?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{textAlign: 'center'}}
            customStyle={{marginBottom: 16}}>
            Are you sure you want to unblock {selectedUser.display_name}?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              unBlockUser();
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
            style={{paddingVertical: 14, width: '100%', alignItems: 'center'}}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutralsZircon,
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderBottomColor: Colors.neutralsWhite,
    borderBottomWidth: 1,
  },
  list2: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutralsWhite,
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderBottomColor: Colors.neutralsWhite,
    borderBottomWidth: 1,
  },
});

//make this component available to the app
export default BlockList;
