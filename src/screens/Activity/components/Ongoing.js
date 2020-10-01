import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View
} from 'react-native';

import ActivitesCard from './ActivitesCard';

const Ongoing = () => {
  const ongoingCards = [
    {
      unread: true,
      status: 'Ongoing',
      name: 'Wayne Tayco',
      time: '2h',
      availed: '1',
      pending: '1',
      title: '🍔 Wayne’s Burgers and Smoothies!',
    },
    {
      status: 'Confirmed',
      name: 'Pia Samson',
      time: '2h',
      date: 'Fri, May 15',
      price: '500.00',
      title: 'Hello neighbors, any pasabuys to SM...',
      reply: 'Will start shopping now! Let me know if you need...'
    },
    {
      status: 'Declined',
      name: 'Wayne Tayco',
      time: '2h',
      offers: '2',
      title: 'Contact me for custom wood craft!!!',
    },
    {
      status: 'Ready for Delivery',
      name: 'Wayne Tayco',
      time: '2h',
      offers: '0',
      title: 'Anyone selling leather?'
    }
  ]

  return (
    <SafeAreaView>
      <ScrollView>
        {ongoingCards.map((info, i) => {
          return (
              <View key={i}>
                <ActivitesCard 
                  info={info}
                />
              </View>
            )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Ongoing
