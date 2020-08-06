import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText, AppButton } from '@/components';
import { OnboardingIllustration1 } from '@/assets/images';

export const VerifiedAccount = () => {
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <OnboardingIllustration1/>
            <AppText textStyle="subtitle1" customStyle={{ marginTop: 35 }}>Yay, Wayne! You're now bee-rified!</AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center', marginTop: 10 }}>Some text here how being verified will help the Servbees community</AppText>
          </View>
          <AppButton
            text="Okay"
            type="primary"
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
