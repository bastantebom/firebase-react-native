import { Images } from '@/assets/images'
import Button from '@/components/Button'
import StatusBar from '@/components/StatusBar'
import { Context } from '@/context'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const GuestPostScreen = () => {
  const { setAuthType, openSlider } = useContext(Context)
  const handleOnJoinPress = () => {
    setAuthType('signup')
    openSlider()
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Images.Post height={normalize(275)} width={normalize(375)} />
          <View style={styles.content}>
            <Text
              style={[
                typography.display5,
                typography.textCenter,
                { marginTop: normalize(24), color: Colors.primaryMidnightBlue },
              ]}>
              Raket, Benta, Search
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              Post your offers, side gigs, and more! Find what you need in your
              community.
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
  },
  scrollView: {
    paddingTop: normalize(32),
  },
  button: {
    width: normalize(250),
    marginTop: normalize(24),
  },
})

export default GuestPostScreen
