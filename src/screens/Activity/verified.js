import React, { useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import typography from '@/globals/typography'

import { VerifiedIllustration } from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import Button from '@/components/Button'
import StatusBar from '@/components/StatusBar'

const Verified = ({ navigation }) => {
  const { userInfo } = useContext(UserContext)

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
        <View style={styles.contentWrapper}>
          <VerifiedIllustration />
          <Text
            style={[
              typography.body2narrow,
              typography.medium,
              {
                marginBottom: 10,
                fontSize: normalize(16),
                textAlign: 'center',
              },
            ]}>
            Yay, {userInfo.display_name || userInfo.full_name}! You're now
            bee-rified!
          </Text>
          <Text style={[typography.body2, { textAlign: 'center' }]}>
            Here's a badge for creating a buzz, and for being awesome in the
            community. Keep unlocking those achievements.
          </Text>
          <Button
            label="View Profile"
            type="primary"
            style={[
              typography.button2,
              {
                marginTop: normalize(20),
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(60),
              },
            ]}
            onPress={() => {
              navigation.navigate('TabStack', { screen: 'You' })
            }}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: getStatusBarHeight(),
  },
  contentWrapper: {
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: normalize(24),
  },
})

export default Verified
