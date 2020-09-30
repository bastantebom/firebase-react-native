import React from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { AppText } from '@/components';
import ActivitesCard from './ActivitesCard';

const Ongoing = () => {
  return (
    <SafeAreaView>
      <AppText>Ongoing tab content</AppText>
      <ActivitesCard />
    </SafeAreaView>
  )
}

export default Ongoing
