import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { RadioButton } from 'react-native-paper';

import { AppText } from '@/components';
import { normalize, Colors } from '@/globals';
import { Search } from '@/assets/images/icons';

import ActivitesCard from './ActivitesCard';

const Ongoing = () => {
  const [active, setActive] = useState(true)
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

  const activeButton = () => {
    setActive(!active);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.filterWrapper}>
          <View style={styles.filterBtns}>
            <TouchableOpacity
              style={[styles.btn, active && styles.btnActive]}
              onPress={activeButton}>
              <AppText textStyle="metadata">All</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, active && styles.btnActive]}
              onPress={activeButton}>
              <AppText textStyle="metadata">Services</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, active && styles.btnActive]}
              onPress={activeButton}>
              <AppText textStyle="metadata">Sell</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, active && styles.btnActive]}
              onPress={activeButton}>
              <AppText textStyle="metadata">Need</AppText>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.searchBtn}>
              <Search width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </View>
        </View>
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

const styles = StyleSheet.create({
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16)
  },
  filterBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 5,
    backgroundColor: Colors.neutralsZircon,
    // backgroundColor: active == true ? Colors.primarySalomie : Colors.neutralsZircon,
    borderRadius: 20
  },
  btnActive: {
    backgroundColor: Colors.primarySalomie,
  },
  searchBtn: {
    padding: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray
  },
  radioButton: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioIcon: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    marginLeft: 10,
    fontSize: 20
  },
});

export default Ongoing;
