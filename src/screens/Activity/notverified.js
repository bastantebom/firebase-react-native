import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import StatusBar from '@/components/StatusBar'

const NotVerified = ({ navigation, route }) => {
  const { date, reasons } = route.params.item

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={2} />
        <View style={styles.contentWrapper}>
          <AppText textStyle="body3" customStyle={{ marginBottom: 10 }}>
            Unsuccessful Verification
          </AppText>
          <AppText textStyle="body2" customStyle={{ marginBottom: 10 }}>
            {new Date(date.seconds * 1000).toString()}
          </AppText>
          <AppText textStyle="body2">Reason/s</AppText>
          {reasons.reject_reasons.map((reason, index) => {
            if (reason)
              return (
                <AppText key={index} textStyle="body2">
                  {reason}
                </AppText>
              )
          })}
        </View>
        <View style={{ padding: normalize(24) }}>
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: getStatusBarHeight(),
  },
  contentWrapper: {
    paddingTop: normalize(70),
    padding: 24,
  },
})

export default NotVerified
