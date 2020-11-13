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

const Notifications = () => {
  const { user } = useContext(UserContext)

  const {
    notificationsList,
    setNotificationsList,
    initNotifications,
  } = useContext(Context)
  const [notifications, setNotifications] = useState({
    notificationsActivity: [1],
  })
  const uponSignupCard = [
    {
      category: 'Default',
      message:
        'Welcome to Servbees, Buzzybee! Explore what you can do on Servbees and create your first post today.',
      time: 'now',
    },
  ]

  const newNotificationsCards = [
    {
      new: 'true',
      category: 'Order Approved',
      seller: 'Wayne’s Burgers and Smoothies',
      time: '3s',
    },
    {
      new: 'true',
      category: 'Order Declined',
      seller: 'Wayne’s Burgers and Smoothies',
      time: '3s',
    },
    {
      new: 'true',
      category: 'Default',
      message: "You're rewarded with <badge>",
      time: 'now',
      withButton: true,
    },
    {
      new: 'true',
      category: 'Verified',
      name: 'Wayne',
      time: 'now',
      badge: 'Verified',
    },
    {
      new: 'true',
      category: 'Not Verified',
      name: 'Wayne',
      time: 'now',
      badge: 'Not Verified',
    },
  ]

  const oldNotificationsCards = [
    {
      category: 'Invite',
      badge: 'Yellow',
      name: 'Grae Joquico',
      groupName: 'Tropang Woodlands',
      position: 'Member Bee',
      time: '3s',
    },
    {
      category: 'Follow',
      badge: 'Red',
      name: 'Trisha Paredes',
      time: '2h',
    },
    {
      category: 'Approve',
      badge: 'Yellow',
      hiveName: 'Pixel',
      time: '2h',
    },
    {
      category: 'Default',
      message:
        "Hey Wayne! Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love.",
      time: '2h',
    },
  ]

  const navigation = useNavigation()

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
          {notificationsList?.filter(notif => !notif.read).length > 0 && (
            <View style={{ paddingTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar
                  height={normalize(20)}
                  width={normalize(20)}
                  style={{ marginRight: 10 }}
                />
                <AppText textStyle="body3">Today</AppText>
              </View>
              <View>
                <AppText
                  textStyle="eyebrow1"
                  customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                  NEW
                </AppText>
              </View>
              {notificationsList
                ?.filter(notif => !notif.read)
                .map((info, i) => {
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
          {notificationsList?.filter(notif => notif.read).length > 0 && (
            <View style={{ paddingTop: 15 }}>
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                EARLIER
              </AppText>
              {notificationsList
                ?.filter(notif => notif.read)
                .map((info, i) => {
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
