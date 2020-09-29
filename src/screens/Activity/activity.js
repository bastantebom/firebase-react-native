import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Button
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { AppText, TabNavigation } from '@/components';
import { Colors, normalize } from '@/globals';

import IllustActivity from '@/assets/images/activity-img1.svg';
import Ongoing from './components/Ongoing';
import Notifications from './components/Notifications';

const Activity = () => {
  const [activity, setActivity] = useState({
    onGoing: ['a'],
    notifications: []
  });

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
      numberBadge: '4',
      renderPage: <Notifications />,
    },
  ];

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.contentWrapper}>
      {activity.onGoing.length == 0 && activity.notifications.length == 0 ? (
        <>
          <IllustActivity />
          <AppText
            textStyle="body1"
            customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
            Get Active and Whatnots {"\n"} & Click Like or Whatever eh!
            </AppText>
          <View style={styles.descHolder}>
            <AppText
              customStyle={{ textAlign: 'center' }}>
              Ang mas-tarush mong Shamcey Supsup ay nag-jembot-jembot ng eklat.
              </AppText>
          </View>
          <TouchableOpacity
            style={{ paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}>
            <AppText textStyle="button2">
              Explore Postings Near You
              </AppText>
          </TouchableOpacity>
        </>
      ) : (
          <>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', paddingBottom: normalize(20) }}>
              <AppText textStyle="body3">My Activities</AppText>
              <TouchableOpacity 
                style={{ position: 'absolute', right: 0 }}
                onPress={() => navigation.navigate('Past')}
              >
                <AppText 
                  color={Colors.contentOcean} 
                  textStyle="body2">Past</AppText>
              </TouchableOpacity>
            </View>
            <TabNavigation routesList={uploadTabs} activityTab />
          </>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  descHolder: {
    paddingTop: 10,
    paddingBottom: 30
  }
});

export default Activity;
