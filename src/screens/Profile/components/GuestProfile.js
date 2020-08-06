import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { AppText, AppButton } from '@/components';
import { OnboardingIllustration4 } from '@/assets/images';

export const GuestProfile = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <OnboardingIllustration4/>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AppText textStyle="display5">Some text here encouraging them to be part of the Servbees community</AppText>
        <AppText textStyle="caption">Additional benefits of joining Servbees here </AppText>
        <AppButton
          text="Join Now"
          type="primary"
          size="sm"
        />
      </View>
    </SafeAreaView>
  )
}