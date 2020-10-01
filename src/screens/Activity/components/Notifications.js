import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';

import { AppText } from '@/components';
import { normalize } from '@/globals';
import { Calendar } from '@/assets/images/icons';
import NotificationsCard from './NotificationsCard';

const Notifications = () => {
  const newNotificationsCards = [
    {
      new: true,
      category: 'Invite',
      badge: 'Yellow',
      name: 'Grae Joquico',
      groupName: 'Tropang Woodlands',
      position: 'Member Bee',
      time: '3s'
    },
  ]

  const oldNotificationsCards = [
    {
      category: 'Follow',
      badge: 'Red',
      name: 'Trisha Paredes',
      time: '2h'
    },
    {
      category: 'Approve',
      badge: 'Yellow',
      hiveName: 'Pixel',
      time: '2h'
    },
    {
      category: 'Reminder',
      name: 'Wayne',
      reminder: "Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love.",
      time: '2h'
    }
  ]

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScrollView style={{paddingHorizontal: 15}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar height={normalize(20)} width={normalize(20)} style={{ marginRight: 10 }} />
          <AppText textStyle="caption2">Today</AppText>
        </View>
        <View style={{paddingTop: 15}}>
          <View>
            <AppText customStyle={{color: '#91919C'}}>NEW</AppText>
          </View>
          {newNotificationsCards.map((info, i) => {
            return (
              <View key={i}>
                 <NotificationsCard 
                  info={info}
                 />
              </View>
            )
          })}
        </View>
        <View style={{paddingTop: 15}}>
          <View>
            <AppText customStyle={{color: '#91919C'}}>EARLIER</AppText>
          </View>
          {oldNotificationsCards.map((info, i) => {
            return (
              <View key={i}>
                 <NotificationsCard 
                  info={info}
                 />
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
  }
});

export default Notifications
