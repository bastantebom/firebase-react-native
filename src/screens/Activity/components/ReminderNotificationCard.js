import React, {useState} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet
} from 'react-native';

import { AppText } from '@/components';
import {normalize} from '@/globals';

import { PostClock, Bee } from '@/assets/images/icons';

const ReminderNotificationCard = ({ name, reminder, props }) => {
  const [newNotif, setNewNotif] = useState(false)

  return (
    <SafeAreaView>
      <View style={[styles.notification, {backgroundColor: newNotif ? '#F2F7FF' : '#FBFBFB'}]}>
        <View style={styles.notification}>
          <View style={styles.holder}>
            <Bee width={normalize(30)} height={normalize(30)}/>
            <AppText 
              textStyle="caption" 
              customStyle={{marginLeft: 15, flex: 1, flexWrap: 'wrap'}}>
                Hey {props.name}! {props.reminder}
            </AppText>
          </View>
          <View style={styles.holder}>
            <PostClock width={normalize(16)} height={normalize(16)} />
            <AppText customStyle={{marginLeft: 3, color: '#8C8B98'}}>3s</AppText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notification: {
    paddingTop: 2,
    paddingBottom: 6,
    paddingHorizontal: 8,
    marginTop: 10,
    borderRadius: 4
  },
  notificationOld: {
    padding: 14,
    marginTop: 10,
    borderRadius: 4
  },
  holder: {
    flexDirection: 'row', 
  }
});

export default ReminderNotificationCard
