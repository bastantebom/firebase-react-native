import React from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { AppText } from '@/components';
import { normalize } from '@/globals';
import { Calendar } from '@/assets/images/icons';
import NotificationCard from './NotificationCard';

const Notifications = () => {
  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Calendar height={normalize(24)} width={normalize(24)} style={{ marginRight: 10 }} />
        <AppText textStyle="body1medium">Today</AppText>
      </View>
      <View>
        <AppText>NEW</AppText>
      </View>
      <NotificationCard />
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
