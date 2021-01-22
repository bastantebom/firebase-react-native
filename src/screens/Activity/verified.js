import React from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'

import { VerifiedIllustration } from '@/assets/images/icons'

const Verified = props => {
  const navigation = useNavigation()
  const { name } = props.route?.params?.info[0]

  const badgeInfo = {
    name: 'Wayne',
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
      <View style={styles.contentWrapper}>
        <VerifiedIllustration />
        <AppText textStyle="body3" customStyle={{ marginBottom: 10 }}>
          Yay, {name}! You're now bee-rified!
        </AppText>
        <AppText textStyle="caption">
          Some text here saying more about the badge.
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: normalize(70),
    alignItems: 'center',
    height: '100%',
  },
})

export default Verified
