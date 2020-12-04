import React, { useState, useEffect, useContext } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { normalize } from '@/globals'
import { Calendar } from '@/assets/images/icons'
import NotificationsCard from './NotificationsCard'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import _ from 'lodash'

const Notifications = () => {
  const { user } = useContext(UserContext)
  const { notificationsList } = useContext(Context)
  const [notifications, setNotifications] = useState({
    notificationsActivity: [1],
  })
  const [groupNotifications, setGroupNotifications] = useState([])
  const navigation = useNavigation()

  const assembleNotification = () => {
    let postGroup = []
    let idGroup = []
    const allPending = notificationsList?.filter(
      notif => notif?.status === 'pending'
    )
    const restStatus = notificationsList?.filter(
      notif => notif?.status !== 'pending'
    )
    if (allPending.length)
      postGroup = _.groupBy(allPending, notif => notif.postId)
    if (restStatus.length) idGroup = _.groupBy(restStatus, notif => notif.id)
    const combinedGroup = { ...postGroup, ...idGroup }

    const tempNotifList = []
    for (const [key, notification] of Object.entries(combinedGroup)) {
      tempNotifList.push(notification)
    }
    setGroupNotifications(tempNotifList)
  }

  useEffect(() => {
    if (notificationsList) assembleNotification()
  }, [notificationsList])

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
          {groupNotifications.length > 0 && (
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
