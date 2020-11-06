import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

import { AppText } from '@/components'
import { normalize, Colors } from '@/globals'
import { Search, Calendar } from '@/assets/images/icons'
import IllustActivity from '@/assets/images/activity-img1.svg'
import ActivitiesCard from './ActivitiesCard'

const Ongoing = () => {
  const navigation = useNavigation()
  const [activeButton, setActive] = useState('All')
  const [ongoing, setOngoing] = useState({
    ongoingActivity: [''],
  })

  const newOngoingCards = [
    {
      unread: true,
      status: 'Ongoing',
      name: 'Wayne Tayco',
      time: '2h',
      availed: '1',
      pending: '1',
      title: '🍔 Wayne’s Burgers and Smoothies!',
    },
  ]

  const oldOngoingCards = [
    {
      status: 'Confirmed',
      name: 'Pia Samson',
      time: '2h',
      date: 'Fri, May 15',
      price: '500.00',
      title: 'Hello neighbors, any pasabuys to SM',
      reply: 'Will start shopping now! Let me know if you need',
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
      title: 'Anyone selling leather?',
    },
  ]

  const filterBtns = [
    {
      value: 'All',
    },
    {
      value: 'Services',
    },
    {
      value: 'Sell',
    },
    {
      value: 'Need',
    },
  ]

  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 16,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <SafeAreaView>
      {ongoing.ongoingActivity.length == 0 ? (
        <ScrollView contentContainerStyle={{ padding: normalize(15) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <IllustActivity width={normalize(250)} height={normalize(200)} />
            <AppText
              textStyle="body1"
              customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
              Start buzzing on Servbees!
            </AppText>
            <View style={styles.descHolder}>
              <AppText
                customStyle={{
                  textAlign: 'center',
                  paddingHorizontal: normalize(60),
                }}>
                Get more project leads, buy and sell items, start your own
                online business, or just bookmark posts for future reference—do
                all these and more on Servbees.
              </AppText>
            </View>
            <TouchableOpacity
              style={{
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(20),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                backgroundColor: '#FFD400',
                borderRadius: 3,
              }}
              onPress={() => navigation.navigate('Servbees')}>
              <AppText textStyle="button3">Explore Postings Near You</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          <View style={styles.filterWrapper}>
            <View style={styles.filterBtns}>
              {filterBtns.map((btn, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      activeButton === btn.value
                        ? styles.btnActive
                        : styles.btn,
                    ]}
                    onPress={() => setActive(btn.value)}>
                    <AppText textStyle="caption">{btn.value}</AppText>
                  </TouchableOpacity>
                )
              })}
            </View>
            <Animated.View style={[styles.search, { width: inputLength }]}>
              <TextInput onBlur={onBlur} onFocus={onFocus} />
              <View style={[styles.searchIcon]}>
                <Search width={normalize(20)} height={normalize(20)} />
              </View>
            </Animated.View>
          </View>
          <View style={{ paddingTop: normalize(15) }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: normalize(15),
              }}>
              <Calendar
                height={normalize(20)}
                width={normalize(20)}
                style={{ marginRight: 10 }}
              />
              <AppText textStyle="body3">Today</AppText>
            </View>
            <View style={{ paddingHorizontal: normalize(15) }}>
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                NEW
              </AppText>
            </View>
            {newOngoingCards.map((info, i) => {
              return (
                <View key={i}>
                  <ActivitiesCard info={info} />
                </View>
              )
            })}
          </View>
          <View>
            <View style={{ paddingHorizontal: normalize(15) }}>
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                EARLIER
              </AppText>
            </View>
            {oldOngoingCards.map((info, i) => {
              return (
                <View key={i}>
                  <ActivitiesCard info={info} />
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 72,
    borderBottomColor: '#00000033',
    paddingTop: 100,
  },
  search: {
    height: normalize(45),
    paddingHorizontal: normalize(16),
    position: 'absolute',
    right: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    backgroundColor: 'white',
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
    paddingHorizontal: normalize(16),
  },
  filterBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(14),
    marginRight: 8,
    backgroundColor: Colors.neutralsZircon,
    borderRadius: 20,
  },
  btnActive: {
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(14),
    marginRight: 8,
    backgroundColor: Colors.primarySalomie,
    borderRadius: 20,
  },
  searchBtn: {
    position: 'relative',
    width: normalize(45),
    height: normalize(45),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
  },
  searchIcon: {
    position: 'absolute',
    top: 13,
    right: 12,
    zIndex: -1,
  },
  descHolder: {
    paddingTop: normalize(10),
    paddingBottom: normalize(25),
  },
})

export default Ongoing
