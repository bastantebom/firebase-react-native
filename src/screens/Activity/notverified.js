import React from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'

import { VerifiedIllustration } from '@/assets/images/icons'

const NotVerified = props => {
  const { date } = props.route?.params
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={2} />
      <View style={styles.contentWrapper}>
        <AppText textStyle="body3" customStyle={{ marginBottom: 10 }}>
          Unsuccessful Verification
        </AppText>
        <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>
          {new Date(date.seconds * 1000).toString()}
        </AppText>
        <AppText textStyle="body2">Reason/s</AppText>
        <AppText textStyle="body2">Blurry Gov't ID</AppText>
        <TouchableOpacity
          style={{
            marginTop: normalize(20),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(60),
            alignItems: 'flex-start',
            justifyContent: 'center',

            backgroundColor: '#FFD400',
            borderRadius: 3,
          }}>
          <AppText textStyle="button2">Verify Again</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: normalize(70),
    alignItems: 'flex-start',
    height: '100%',
    padding: 24,
  },
})

export default NotVerified
