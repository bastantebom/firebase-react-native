import React, { useContext } from 'react'
import { View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'

import { VerifiedIllustration } from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'

const Verified = ({ navigation }) => {
  const { userInfo } = useContext(UserContext)

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
        <View style={styles.contentWrapper}>
          <VerifiedIllustration />
          <AppText textStyle="body3" customStyle={{ marginBottom: 10 }}>
            Yay, {userInfo.display_name || userInfo.full_name}! You're now
            bee-rified!
          </AppText>
          <AppText
            textStyle="body2Dashboard"
            customStyle={{ textAlign: 'center' }}>
            Here's a badge for creating a buzz, and for being awesome in the
            community. Keep unlocking those achievements.
          </AppText>
          <TouchableOpacity
            style={{
              marginTop: normalize(20),
              paddingVertical: normalize(10),
              paddingHorizontal: normalize(60),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#FFD400',
              borderRadius: 3,
            }}
            onPress={() => {
              navigation.navigate('TabStack', { screen: 'You' })
            }}>
            <AppText textStyle="button2">View Profile</AppText>
          </TouchableOpacity>
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
