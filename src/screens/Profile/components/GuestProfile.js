import React, { useContext } from 'react'
import Button from '@/components/Button'
import { Context } from '@/context'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { OnboardingIllustration4 } from '@/assets/images'
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const GuestProfile = () => {
  const { setAuthType, openSlider } = useContext(Context)
  const handleOnJoinPress = () => {
    setAuthType('signup')
    openSlider()
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <OnboardingIllustration4
          height={normalize(275)}
          width={normalize(375)}
        />
        <View style={styles.content}>
          <Text
            style={[
              typography.display5,
              typography.textCenter,
              { marginTop: normalize(24), color: Colors.primaryMidnightBlue },
            ]}>
            Join the bustling {'\n'} Servbees community
          </Text>
          <Text
            style={[
              typography.body2,
              typography.textCenter,
              { marginTop: normalize(8) },
            ]}>
            Be a Buzzybee and connect, hustle, and earn—all on your own terms.
          </Text>

          <Button
            style={styles.button}
            label="Join Now"
            type="primary"
            onPress={handleOnJoinPress}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
    paddingBottom: normalize(15),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(32),
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: normalize(32),
  },
  button: {
    width: normalize(250),
    marginTop: normalize(24),
  },
})
