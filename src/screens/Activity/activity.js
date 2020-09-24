import React from 'react'
import {
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { AppText } from '@/components';
import {Colors, normalize} from '@/globals';

import IllustActivity from '@/assets/images/activity-img1.svg';

const Activity = () => {
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      <IllustActivity />
      <AppText>Get Active and Whatnots & Click Like or Whatever eh!</AppText>
      <AppText>Ang mas-tarush mong Shamcey Supsup ay nag-jembot-jembot ng eklat.</AppText>
      <TouchableOpacity
        style={{ paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400'}}>
        <AppText textStyle="button2">
        Explore Posting Near You
        </AppText>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Activity;
