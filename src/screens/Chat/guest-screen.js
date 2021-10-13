import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import Button from '@/components/Button'
import { Images } from '@/assets/images'
import StatusBar from '@/components/StatusBar'

const GuestScreen = ({ navigation }) => {
  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <Images.ChatGuest height={normalize(275)} width={normalize(375)} />
          <View style={styles.content}>
            <Text
              style={[
                typography.display5,
                typography.textCenter,
                { marginTop: normalize(24), color: Colors.primaryMidnightBlue },
              ]}>
              Send messages and inquiries easily
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              PM is key, so we made it easy! Send direct messages to sellers,
              service providers, and customers via Servbees Chat.
            </Text>

            <Button
              style={styles.button}
              label="Go to Dashboard"
              type="primary"
              onPress={() => navigation.push('TabStack')}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(32),
    alignItems: 'center',
    paddingBottom: normalize(25),
  },
  scrollView: {
    paddingTop: normalize(32),
  },
  button: {
    width: normalize(250),
    marginTop: normalize(24),
  },
})

export default GuestScreen
