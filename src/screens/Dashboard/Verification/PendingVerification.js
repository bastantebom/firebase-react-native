import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText, AppButton } from '@/components';
import { OnboardingIllustration1, Verification } from '@/assets/images';
import { UserContext } from '@/context/UserContext';

export const PendingVerification = ({ goToDashboard, reviewVerification }) => {
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Verification/>
            <AppText textStyle="subtitle1" customStyle={{ marginTop: 35 }}>We’ve received your details</AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center', marginTop: 10 }}>Some text here how being currently bla bla under 24hrs</AppText>
          </View>
          <AppButton
            text="Go to Dashboard"
            type="primary"
            onPress={goToDashboard}
          />
          <AppButton
            text="Review Verification"
            type="secondary"
            onPress={reviewVerification}
          />
        </View>
      </PaddingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginBottom: 16
  }
})
