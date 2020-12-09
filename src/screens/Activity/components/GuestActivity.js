import React from 'react'
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, AppButton, PaddingView } from '@/components'
import { Colors, normalize } from '@/globals'

import IllustHive from '@/assets/images/hive-img1.svg'
import { ScrollView } from 'react-native-gesture-handler'
import { OnboardingIllustration2 } from '@/assets/images'

const GuestActivity = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}>
        <OnboardingIllustration2 />
        <AppText
          textStyle="display5"
          customStyle={{
            textAlign: 'center',
            marginTop: normalize(10),
            marginBottom: normalize(8),
            maxWidth: normalize(250),
          }}
          color={Colors.primaryMidnightBlue}>
          Easily track all your activity
        </AppText>
        <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
          Notifications, receipts, transaction records, and updates—organized in
          one place.
        </AppText>
        <TouchableOpacity
          style={{
            marginTop: normalize(24),
            paddingVertical: 12,
            width: '100%',
            alignItems: 'center',
            backgroundColor: Colors.primaryYellow,
            borderRadius: 3,
            maxWidth: normalize(250),
          }}
          onPress={() => {}}>
          <AppText textStyle="body1medium">Join Now</AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
})

export default GuestActivity
