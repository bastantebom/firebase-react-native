import React from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { AppText } from '@/components';
import { normalize } from '@/globals';
import { Calendar, ArrowLeft} from '@/assets/images/icons';
import FollowNotificationCard from '../Activity/components/FollowNotificationCard';
import ApprovedNotificationCard from '../Activity/components/ApprovedNotificationCard';
import ReminderNotificationCard from '../Activity/components/ReminderNotificationCard';

const Past = () => {
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

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={{flexDirection: 'row' , alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Activity')}
          style={{position: 'absolute', left: 0}}
        >
          <ArrowLeft />
        </TouchableOpacity>
        <AppText textStyle="body3">Past Activities</AppText>
      </View>
      <ScrollView style={{paddingTop: 20}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar height={normalize(20)} width={normalize(20)} style={{ marginRight: 10 }} />
          <AppText textStyle="caption2">Last 6 Months</AppText>
        </View>
        <View style={{paddingTop: 15}}>
          <View>
            <AppText customStyle={{color: '#91919C'}}>2020</AppText>
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
    padding: normalize(16),
    backgroundColor: 'white',
  }
});

export default Past
