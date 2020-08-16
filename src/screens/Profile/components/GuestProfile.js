import React from 'react';
import { View, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { AppText, AppButton, PaddingView, } from '@/components';
import { OnboardingIllustration4 } from '@/assets/images';
import { Colors } from '@/globals';

const {width, height} = Dimensions.get('window');

export const GuestProfile = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}> 
        <OnboardingIllustration4 width={width} height={width * .8}/>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <AppText 
            textStyle="display5" 
            customStyle={styles.textStyle}
            color={Colors.primaryMidnightBlue}
          >
            Some text here encouraging them to be part of the Servbees community
          </AppText>
          <AppText textStyle="caption" customStyle={styles.textStyle}>Additional benefits of joining Servbees here </AppText>
          <AppButton
            text="Join Now"
            type="primary"
            size="sm"
            customStyle={{ marginTop: 18 }}
          />
        </View>
      </PaddingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center', 
    marginBottom: 8
  }
})
