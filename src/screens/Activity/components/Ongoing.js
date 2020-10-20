import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get("window");
const PADDING = 16;
const SEARCH_FULL_WIDTH =  width - PADDING * 2; 
const SEARCH_SHRINK_WIDTH = normalize(56);

import { AppText } from '@/components';
import { normalize, Colors } from '@/globals';
import { Search } from '@/assets/images/icons';

import ActivitesCard from './ActivitesCard';

const Ongoing = () => {
  const [activeButton, setActive] = useState('All')
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

  const filterBtns = [
    {
      value: 'All'
    },
    {
      value: 'Services'
    },
    {
      value: 'Sell'
    },
    {
      value: 'Need'
    }
  ]

  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(cancelPosition, {
        toValue: 16,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  };

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.filterWrapper}>
          <View style={styles.filterBtns}>
            {filterBtns.map((btn, i) => {
              return(
                <TouchableOpacity
                  key={i}
                  style={[activeButton === btn.value ? styles.btnActive : styles.btn]}
                  onPress={() => setActive(btn.value)}>
                  <AppText textStyle="metadata">{btn.value}</AppText>
                </TouchableOpacity>
              )
            })}
          </View>
          <Animated.View
            style={[
                styles.search,{ width: inputLength},
              ]}
            >
            <TextInput
              style={styles.searchInput}
              onBlur={onBlur}
              onFocus={onFocus}
            />
            <View 
              style={[styles.searchIcon]}
            >
              <Search width={normalize(24)} height={normalize(24)} />
            </View>
          </Animated.View>
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
  searchContainer: {
    flexDirection: "row",
    height: 72,
    borderBottomColor: "#00000033",
    paddingTop: 100
  },
  search: {
    flex: 1,
    flexDirection: "row",
    height: normalize(56),
    paddingHorizontal: normalize(16),
    position: "absolute",
    right: 16,
    alignSelf: "flex-end",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    backgroundColor: 'white'
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: normalize(30),
    paddingBottom: normalize(16),
    paddingHorizontal: normalize(16)
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
    borderRadius: 20
  },
  btnActive: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 5,
    backgroundColor: Colors.primarySalomie,
    borderRadius: 20
  },
  searchBtn: {
    position: 'relative',
    width: normalize(56),
    height: normalize(56),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray
  },
  searchIcon: {
    position: 'absolute',
    top: 17,
    right: 17,
    zIndex: -1
  }
});

export default Ongoing;
