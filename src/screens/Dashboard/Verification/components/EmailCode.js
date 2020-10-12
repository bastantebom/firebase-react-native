import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText, AppButton } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight
} from '@/assets/images/icons';
import { VerifyMap } from './Map';
import Modal from 'react-native-modal';
import { VerifyAccount } from '@/screens/Authentication';

export const EmailCode = ({back, toggleEmailCode}) => {

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <VerifyAccount/>
    </SafeAreaView>
  )
}