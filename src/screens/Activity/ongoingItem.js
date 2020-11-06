import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AppText, ScreenHeaderTitle } from '@/components';
import { normalize, Colors } from '@/globals';
import { 
  Chat,
  PostCash,
  ChevronUp,
  ChevronDown,
  GreenTick
} from '@/assets/images/icons';

import ActivitiesCard from './components/ActivitiesCard';
import ItemCard from './components/ItemCard';

const OngoingItem = () => {
  const navigation = useNavigation();
  const [readyForDelivery, showReadyForDelivery] = useState(false);
  const [readyForPickup, showReadyForPickup] = useState(false);

  const info = {
    status: 'Ongoing',
    name: 'Wayne Tayco',
    time: '2h',
    availed: '1',
    pending: '1',
    title: '🍔 Wayne’s Burgers and Smoothies!',
  }

  const requestCards = [
    {
      category: 'Sell',
      new: true,
      customer: 'Pia Samson',
      verified: true,
      date: 'September 29, 2020',
      time: '11:01AM',
      amount: '150',
      paymentMode: 'Cash On Delivery',
      numOfItems: '5'
    },
    {
      category: 'Sell',
      new: true,
      customer: 'Trishia Paredes',
      verified: true,
      date: 'September 29, 2020',
      time: '11:04AM',
      amount: '1,050,000',
      paymentMode: 'Cash On Pick-Up',
      numOfItems: '1'
    },
    {
      category: 'Sell',
      timeStamp: '1h',
      customer: 'Raine',
      verified: true,
      date: 'September 29, 2020',
      time: '11:01AM',
      amount: '150',
      paymentMode: 'Cash On Delivery',
      numOfItems: '1'
    },
    {
      category: 'Sell',
      timeStamp: '2h',
      customer: 'Reynan',
      verified: true,
      date: 'September 29, 2020',
      time: '9:01AM',
      amount: '950',
      paymentMode: 'Credit Card',
      numOfItems: '5,000'
    }
  ]

  const ongoingDeliveryCards = [
    {
      category: 'Sell',
      timeStamp: '1h',
      customer: 'Raine',
      verified: true,
      date: 'September 29, 2020',
      time: '11:01AM',
      amount: '150',
      paymentMode: 'Cash On Delivery',
      numOfItems: '5'
    },
    {
      category: 'Sell',
      timeStamp: '1h',
      customer: 'Raine',
      verified: true,
      date: 'September 29, 2020',
      time: '11:04AM',
      amount: '1,050,000',
      paymentMode: 'Cash On Pick-Up',
      numOfItems: '1'
    }
  ]

  const ongoingPickupCards = [
    {
      category: 'Sell',
      timeStamp: '1h',
      customer: 'Raine',
      verified: true,
      date: 'September 29, 2020',
      time: '11:01AM',
      amount: '150',
      paymentMode: 'Cash On Delivery',
      numOfItems: '5'
    }
  ]

  const completedCards = [
    {
      category: 'Sell',
      timeStamp: '2h',
      customer: 'Pia Samson',
      verified: true,
      date: 'September 29, 2020',
      time: '11:01AM',
      amount: '150',
      paymentMode: 'Cash On Delivery',
      numOfItems: '5'
    }
  ]

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            paddingBottom: 8
          }}
        >
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title="🍔 Wayne’s Burgers and Smoothies!"
            paddingSize={2}
            iconSize={normalize(16)}
          />
          <ActivitiesCard
            info={info}
          />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            marginVertical: normalize(10),
            paddingVertical: normalize(30),
            paddingHorizontal: normalize(16)
          }}
        >
          <View 
            style={{
              flexDirection: 'row', 
              justifyContent: 'space-between'
            }}>
            <View style={styles.iconText}>
              <Chat />
              <AppText 
                textStyle="body1medium"
                customStyle={{ marginLeft: normalize(10) }}
              >
                Requests
              </AppText>
            </View>
            <TouchableOpacity>
              <AppText
                textStyle="button2"
                color={Colors.contentOcean}
              >
                View All
              </AppText>
            </TouchableOpacity>
          </View>
          {requestCards.map((item, i) => {
            return (
              <View key={i}>
                <ItemCard
                  item={item}
                />
              </View>
            )
          })}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            marginVertical: normalize(10),
            paddingVertical: normalize(30),
            paddingHorizontal: normalize(16)
          }}
        >
          <View style={styles.iconText}>
            <PostCash />
            <AppText 
              textStyle="body1medium"
              customStyle={{ marginLeft: normalize(10) }}
            >
              Ongoing
            </AppText>
          </View>
          <View style={{marginBottom: normalize(20)}}>
            <TouchableOpacity onPress={() => showReadyForDelivery(!readyForDelivery)}  >
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <AppText textStyle="body2medium">Ready for Delivery (2)</AppText>
                {readyForDelivery ? 
                
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              : 
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              }
              </View>
            </TouchableOpacity>
            {readyForDelivery && (
              <>
                {ongoingDeliveryCards.map((item, i) => {
                  return (
                    <View key={i}>
                      <ItemCard
                        item={item}
                      />
                    </View>
                  )
                })}
              </>
            )}
          </View>
          <View>
            <TouchableOpacity onPress={() => showReadyForPickup(!readyForPickup)}  >
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <AppText textStyle="body2medium">Ready for Pick up (1)</AppText>
                {readyForPickup ? 
                
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              : 
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              }
              </View>
            </TouchableOpacity>
            {readyForPickup && (
              <>
                {ongoingPickupCards.map((item, i) => {
                  return (
                    <View key={i}>
                      <ItemCard
                        item={item}
                      />
                    </View>
                  )
                })}
              </>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            paddingVertical: normalize(30),
            paddingHorizontal: normalize(16)
          }}
        >
        <View 
          style={{
            flexDirection: 'row', 
            justifyContent: 'space-between'
          }}>
          <View style={styles.iconText}>
            <GreenTick />
            <AppText 
              textStyle="body1medium"
              customStyle={{ marginLeft: normalize(10) }}
            >
              Completed
            </AppText>
          </View>
          <TouchableOpacity>
            <AppText
              textStyle="button2"
              color={Colors.contentOcean}
            >
              View All
            </AppText>
          </TouchableOpacity>
        </View>
        {completedCards.map((item, i) => {
            return (
              <View key={i}>
                <ItemCard
                  item={item}
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
    flex: 1
  },
  iconText: {
    flexDirection: 'row',
    alignItems:'center',
    paddingBottom: normalize(10)
  }
});

export default OngoingItem
