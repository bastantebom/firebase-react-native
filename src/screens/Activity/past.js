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
import NotificationsCard from '../Activity/components/NotificationsCard';

const Past = () => {
  const oldNotificationsCards = [
    {
      category: 'Follow',
      badge: 'Red',
      name: 'Trisha Paredes',
      time: '3w'
    },
    {
      category: 'Approve',
      badge: 'Yellow',
      hiveName: 'Pixel',
      time: '4m'
    },
    {
      category: 'Reminder',
      name: 'Wayne',
      reminder: "Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love.",
      time: '6m'
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
         {oldNotificationsCards.map((info, i) => {
            return (
              <View key={i}>
                 <NotificationsCard 
                  info={info}
                 />
              </View>
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
