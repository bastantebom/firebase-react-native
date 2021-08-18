import React, { useContext, useCallback } from 'react'
import Button from '@/components/Button'
import { Context } from '@/context'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { OnboardingIllustration4 } from '@/assets/images'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation, useRoute } from '@react-navigation/native'

import { PaddingView, ScreenHeaderTitle } from '@/components'

const GuestProfileScreen = () => {
  const navigation = useNavigation()
  const { params } = useRoute()

  const { setAuthType, openSlider } = useContext(Context)
  const handleOnJoinPress = () => {
    setAuthType('signup')
    openSlider()
  }

  const handleOnBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }, [navigation])

  return (
    <View style={styles.wrapper}>
      {!!params?.showNavigation && (
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle title="" close={handleOnBackPress} />
        </PaddingView>
      )}

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
    backgroundColor: Colors.neutralsWhite,
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

export default GuestProfileScreen
