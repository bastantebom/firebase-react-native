import React, { useContext } from 'react'
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AppText, TabNavigation } from '@/components'
import { Colors, normalize } from '@/globals'

import Ongoing from './components/Ongoing'
import Notifications from './components/Notifications'
import { Context } from '@/context'

const Activity = () => {
  const { notificationsList } = useContext(Context)
  const uploadTabs = [
    {
      key: 'ongoing',
      title: 'ONGOING',
      numberBadge: '4',
      renderPage: <Ongoing />,
    },
    {
      key: 'notifications',
      title: 'NOTIFICATIONS',
      numberBadge: notificationsList?.filter(notif => !notif.read).length,
      renderPage: <Notifications />,
    },
  ]

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            paddingBottom: normalize(20),
          }}>
          <AppText textStyle="body3">My Activities</AppText>
          <TouchableOpacity
            style={{ position: 'absolute', right: 16 }}
            onPress={() => navigation.navigate('Past')}>
            <AppText color={Colors.contentOcean} textStyle="body2">
              Past
            </AppText>
          </TouchableOpacity>
        </View>
        <TabNavigation routesList={uploadTabs} activityTab />
      </>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  descHolder: {
    paddingTop: 10,
    paddingBottom: 30,
  },
})

export default Activity
