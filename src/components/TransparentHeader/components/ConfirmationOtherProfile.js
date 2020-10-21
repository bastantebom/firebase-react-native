//import liraries
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { AppText, BottomSheetHeader, PaddingView } from '@/components';
import Modal from 'react-native-modal';
import { Colors, normalize } from '@/globals';
import { UserContext } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import AdminFunctionService from '@/services/Admin/AdminFunctions';

// create a component
const ConfirmationOtherProfile = ({ userID, toggleEllipsisState, cancelModalToggle }) => {
  const { user, userInfo, setUserInfo } = useContext(UserContext);
  const navigation = useNavigation();

  const blockUser = async () => {
    //body: { uid, pid }
    return await AdminFunctionService.blockUser({
      uid: user?.uid,
      reported_uid: userID,
    }).then((res) => {
      //console.log(res);
      if (res.success) {
        setUserInfo({ ...userInfo, blocked_users: res.data });
        toggleEllipsisState();
        navigation.goBack();
      }
    });
  };

  return (
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
        Block this User?
      </AppText>

      <AppText
        textStyle="caption"
        customStyle={{ textAlign: 'center' }}
        customStyle={{ marginBottom: 16 }}>
        Are you sure you want to block this user?
      </AppText>

      <TouchableOpacity
        onPress={() => {
          blockUser();
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
        onPress={cancelModalToggle}
        style={{ paddingVertical: 14, width: '100%', alignItems: 'center' }}>
        <AppText textStyle="button2" color={Colors.contentOcean}>
          Cancel
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

//make this component available to the app
export default ConfirmationOtherProfile;
