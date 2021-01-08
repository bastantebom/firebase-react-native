import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { AppText, Switch, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'

const NotificationSettings = ({ close }) => {
  const [pause, setPause] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 8 }}>
      <ScreenHeaderTitle
        close={close}
        title="Notifications"
        paddingSize={2}
        iconSize={normalize(20)}
      />
      <View style={styles.container}>
        <View style={styles.withBorder}>
          <AppText textStyle="body1">Push Notifications</AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">Pause All</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <AppText textStyle="body2medium">Email Notifications</AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New posts</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New offer</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New chat</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New followers</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New hive invites</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">New reviews</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">From Servbees</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">Marketing and Promotions</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: normalize(8),
            }}>
            <AppText textStyle="body2">App Updates</AppText>
            <Switch
              value={pause}
              onValueChange={() => {
                setPause(!pause)
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  withBorder: {
    paddingVertical: 20,
  },
})

export default NotificationSettings
