import React from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { AppText, AppButton } from '@/components';

const NotificationCard = () => {
  return (
    <SafeAreaView>
      <View>
        <AppText>Grae Joquico invited you to join Tropang Woodlands as a Member Bee</AppText>
        <View style={styles.btnHolder}>
          <TouchableOpacity
            style={{ paddingVertical: 10, marginRight: 10, width: '45%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
            <AppText textStyle="button2">
              View Profile
              </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingVertical: 10, width: '45%', alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
            <AppText textStyle="button2">
              Decline
              </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btnHolder: {
    flexDirection: 'row'
  },
});

export default NotificationCard
