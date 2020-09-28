import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppText } from '@/components';
import { normalize } from '@/globals';
import { Calendar } from '@/assets/images/icons';
import NotificationCard from './NotificationCard';

const Notifications = () => {
  const notifications = [
    {
      name: 'Grae Joquico',
      groupName: 'Tropang Woodlands',
      position: 'Member Bee'
    },
    {
      name: 'Trisha Paredes'
    }
  ]

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Calendar height={normalize(20)} width={normalize(20)} style={{ marginRight: 10 }} />
        <AppText textStyle="caption2">Today</AppText>
      </View>
      <View>
        <AppText customStyle={{color: '#91919C'}}>NEW</AppText>
      </View>
      {notifications.map((info, i) => {
        return (
          <NotificationCard 
            key={i} 
            props={info}
          />
        )
      })}
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
