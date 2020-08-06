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
import { VerifyMap } from './components/Map';
import Modal from 'react-native-modal';

export const MobileVerification = ({back, toggleMobileCode}) => {

  return (
    <SafeAreaView style={{ flex: 1 }}  >
      <PaddingView paddingSize={3}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={back}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0 }}
              >
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">&nbsp;</AppText>
            </View>
            <AppText 
              textStyle="body1"
              customStyle={{ marginBottom: 8 }}
            >Add and verify mobile number</AppText>
            <AppText textStyle="body2" color={Colors.contentPlaceholder}>We'll use this number for notifications, transaction updates, and login help</AppText>
            <AppInput
              label="Mobile"
              customStyle={styles.customInput}
            />
          </View>
          <AppButton
            text="Verify"
            type="primary"
            onPress={toggleMobileCode}
          />
        </View>
      </PaddingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginTop: 40
  }
})