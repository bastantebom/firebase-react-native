import React, { useState, useContext } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { Calendar } from '@/assets/images/icons'
import NotificationsCard from './components/NotificationsCard'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { useNavigation } from '@react-navigation/native'

const Notifications = ({ route }) => {
  const navigation = useNavigation()
  const groupNotifications = route?.params?.groupNotifications
  const [notifications, setNotifications] = useState({
    notificationsActivity: [1],
  })
  const { user } = useContext(UserContext)

  const openNotificationHandler = async readDocId => {
    if (!readDocId && !user?.uid) return
    const docRef = firestore()
      .collection('activities')
      .doc(user?.uid)
      .collection('notifications')
      .doc(readDocId)
    await docRef.update({
      read: true,
    })
  }

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="Notifications"
        paddingSize={3}
        iconSize={normalize(16)}
      />
      {notifications.notificationsActivity.length == 0 ? (
        <View style={{ paddingHorizontal: normalize(15) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar
              height={normalize(20)}
              width={normalize(20)}
              style={{ marginRight: 10 }}
            />
            <AppText textStyle="body3">Today</AppText>
          </View>
          <AppText
            textStyle="eyebrow1"
            customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
            NEW
          </AppText>
          {uponSignupCard.map((info, i) => {
            return (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NBTScreen', {
                      screen: 'Welcome',
                      params: {
                        screen: 'WelcomeScreen',
                      },
                    })
                  }}>
                  <NotificationsCard info={info} />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: normalize(15) }}>
          {groupNotifications && (
            <View style={{ paddingTop: 15 }}>
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                EARLIER
              </AppText>
              {groupNotifications.map((info, i) => {
                return (
                  <View key={i}>
                    <NotificationsCard
                      info={info}
                      openNotificationHandler={readDocId =>
                        openNotificationHandler(readDocId)
                      }
                    />
                  </View>
                )
              })}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default Notifications
