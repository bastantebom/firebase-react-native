import React, { useState } from 'react'
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text
} from 'react-native'
import { List, Avatar } from 'react-native-paper';
import Modal from 'react-native-modal';
import { AppText, PaddingView, AppInput } from '@/components';
import {Colors} from '@/globals';


export const ProfileInformation = () => {
  return (
    <PaddingView paddingSize={3}>
      <AppText textStyle="body1">Public Profile</AppText>
      <AppInput
        label="Display Name"
      />
      <AppText textStyle="caption" color={Colors.contentPlaceholder}>Help people discover your account by using a name that describes you or your service. This could be the  name of your business, or your nickname. </AppText>
      <AppInput
        label="Full name"
      />
      <AppInput
        label="Username"
      />
    </PaddingView>
  )
}

const styles = StyleSheet.create({
})