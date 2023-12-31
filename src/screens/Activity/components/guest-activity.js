import React, { useContext } from 'react'
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { Colors, normalize } from '@/globals'

import { ScrollView } from 'react-native-gesture-handler'
import { OnboardingIllustration2 } from '@/assets/images'
import { Context } from '@/context'

const GuestActivity = () => {
  const navigation = useNavigation()
  const { openSlider, setAuthType } = useContext(Context)

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}>
        <OnboardingIllustration2 />
        <AppText
          textStyle="display5"
          customStyle={styles.textStyle}
          color={Colors.primaryMidnightBlue}>
          Easily track all {'\n'} your activity
        </AppText>
        <AppText
          textStyle="body2"
          customStyle={{
            textAlign: 'center',
            paddingHorizontal: normalize(10),
          }}>
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
          onPress={() => {
            setAuthType('signup')
            openSlider()
          }}>
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
  textStyle: {
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(8),
    paddingHorizontal: normalize(15),
  },
})

export default GuestActivity
