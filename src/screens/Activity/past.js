import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { Calendar, ArrowLeft } from '@/assets/images/icons'
import NotificationsCard from '../Activity/components/NotificationsCard'
import IllustActivity from '@/assets/images/activity-img1.svg'

const Past = () => {
  const [pastActivity, setPastActivity] = useState({
    activities: [],
  })

  const oldNotificationsCards = [
    {
      category: 'Follow',
      badge: 'Red',
      name: 'Trisha Paredes',
      time: '3w',
    },
    {
      category: 'Approve',
      badge: 'Yellow',
      hiveName: 'Pixel',
      time: '4m',
    },
    {
      category: 'Default',
      name: 'Wayne',
      message:
        "Hey Wayne! Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love.",
      time: '6m',
    },
  ]

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="Past Activities"
      />
      {pastActivity.activities.length == 0 ? (
        <View
          style={{
            paddingHorizontal: normalize(12),
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <IllustActivity width={normalize(250)} height={normalize(200)} />
          <AppText
            textStyle="body1"
            customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
            Get Active and Whatnots {'\n'} & Click Like or Whatever eh!
          </AppText>
          <View style={styles.descHolder}>
            <AppText customStyle={{ textAlign: 'center' }}>
              Get projects, buy and sell items, start your own online business,
              or just bookmark posts—do all these and more on Servbees.
            </AppText>
          </View>
          <TouchableOpacity
            style={{
              paddingVertical: normalize(10),
              paddingHorizontal: normalize(20),
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: '#FFD400',
              borderRadius: 3,
            }}
            onPress={() => navigation.navigate('dashboard')}>
            <AppText textStyle="button3">Explore Postings Near You</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ paddingTop: normalize(20), paddingTop: normalize(30) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar
              height={normalize(20)}
              width={normalize(20)}
              style={{ marginRight: 10 }}
            />
            <AppText textStyle="caption2">Last 6 Months</AppText>
          </View>
          <View style={{ paddingTop: 15 }}>
            <View>
              <AppText customStyle={{ color: '#91919C' }}>2020</AppText>
            </View>
            {oldNotificationsCards.map((info, i) => {
              return (
                <View key={i}>
                  <NotificationsCard info={info} />
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(16),
    paddingHorizontal: normalize(16),
    backgroundColor: 'white',
  },
  descHolder: {
    paddingTop: normalize(10),
    paddingBottom: normalize(25),
  },
})

export default Past
