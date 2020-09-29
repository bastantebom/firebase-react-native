import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppText } from '@/components';
import { normalize } from '@/globals';
import { Calendar } from '@/assets/images/icons';
import InviteNotificationCard from './InviteNotificationCard';
import FollowNotificationCard from './FollowNotificationCard';
import ApprovedNotificationCard from './ApprovedNotificationCard';
import ReminderNotificationCard from './ReminderNotificationCard';

const Notifications = () => {
  const inviteNotifications = [
    {
      name: 'Grae Joquico',
      groupName: 'Tropang Woodlands',
      position: 'Member Bee'
    }
  ]

  const followNotifications = [
    {
      name: 'Trisha Paredes'
    }
  ]

  const approvedNotifications = [
    {
      groupName: 'Pixel',
    }
  ]

  const reminderNotifications = [
    {
      name: 'Wayne',
      reminder: "Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love."
    }
  ]

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar height={normalize(20)} width={normalize(20)} style={{ marginRight: 10 }} />
          <AppText textStyle="caption2">Today</AppText>
        </View>
        <View style={{paddingTop: 10}}>
          <View>
            <AppText customStyle={{color: '#91919C'}}>NEW</AppText>
          </View>
          {inviteNotifications.map((info, i) => {
            return (
              <>
                <InviteNotificationCard 
                  key={i} 
                  props={info}
                />
              </>
            )
          })}
        </View>
        <View style={{paddingTop: 10}}>
          <View>
            <AppText customStyle={{color: '#91919C'}}>EARLIER</AppText>
          </View>
          {followNotifications.map((info, j) => {
            return (
              <>
                <FollowNotificationCard 
                  key={j} 
                  props={info}
                />
              </>
            )
          })}
          {approvedNotifications.map((info, k) => {
            return (
              <>
                <ApprovedNotificationCard 
                  key={k} 
                  props={info}
                />
              </>
            )
          })}
          {reminderNotifications.map((info, l) => {
            return (
              <>
                <ReminderNotificationCard 
                  key={l} 
                  props={info}
                />
              </>
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
    paddingVertical: normalize(16),
    backgroundColor: 'white',
  }
});

export default Notifications
