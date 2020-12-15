import React from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'

import { VerifiedIllustration } from '@/assets/images/icons'

const NotVerified = props => {
  const { date, reasons } = props.route?.params?.info[0]

  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={2} />
      <View style={styles.contentWrapper}>
        <AppText textStyle="body3" customStyle={{ marginBottom: 10 }}>
          Unsuccessful Verification
        </AppText>
        <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>
          {new Date(date.seconds * 1000).toString()}
        </AppText>
        <AppText textStyle="body2">Reason/s</AppText>
        {reasons.reject_reasons.map(reason => {
          if (reason) return <AppText textStyle="body2">{reason}</AppText>
        })}
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', padding: 24 }}>
        <TouchableOpacity
          style={{
            marginTop: normalize(20),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(60),
            alignItems: 'center',
            backgroundColor: '#FFD400',
            borderRadius: 3,
          }}
          onPress={() => {
            navigation.navigate('NBTScreen', {
              screen: 'Verification',
            })
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
    padding: 24,
  },
})

export default NotVerified
