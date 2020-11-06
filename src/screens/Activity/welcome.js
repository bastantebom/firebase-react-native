import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppText, ScreenHeaderTitle } from '@/components';
import { normalize } from '@/globals';

const Welcome = () => {
  const navigation = useNavigation();
  const joinInfo = {
    joinDate: 'October 13, 2020',
    joinTime: '7:13 AM'
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        paddingSize={2}
      />
      <View style={styles.contentWrapper}>
        <AppText textStyle="body3">Welcome to Servbees!</AppText>
        <AppText textStyle="caption" customStyle={{marginVertical: normalize(8)}}>{joinInfo.joinDate}{" "}{joinInfo.joinTime}</AppText>
        <AppText textStyle="caption">Some text here saying more about the things they can do in Servbees.</AppText>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(16),
    height: '100%'
  }
});

export default Welcome;