import React, { useState, useEffect, useContext } from 'react'
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
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import PostService from '@/services/Post/PostService'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

import { AppText, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import { Search, Calendar } from '@/assets/images/icons'
import IllustActivity from '@/assets/images/activity-img1.svg'
import ActivitiesCard from './ActivitiesCard'

const Ongoing = () => {
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const [activeButton, setActive] = useState('All')
  const [onGoing, setOnGoing] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  const initOwnOrders = async () => {
    const ownOrdersResponse = await Api.getOwnOrders({ uid: user?.uid })
    if (ownOrdersResponse.success) {
      if (!ownOrdersResponse.data.length) {
        return
      } else {
        const ownOrderData = await Promise.all(
          ownOrdersResponse.data.map(async order => {
            if (
              order.status !== 'completed' &&
              order.status !== 'cancelled' &&
              order.status !== 'declined'
            ) {
              const getPostResponse = await Api.getPost({
                pid: order.post_id,
              })
              const getUserReponse = await Api.getUser({
                uid: order.seller_id || user?.uid,
              })
              if (!getPostResponse.success) {
                return
              }
              if (getPostResponse.success) {
                const {
                  full_name,
                  display_name,
                  profile_photo,
                } = getUserReponse.data

                return {
                  profilePhoto: profile_photo,
                  name: display_name ? display_name : full_name,
                  cardType: 'own',
                  status: order.status,
                  time: order.date._seconds,
                  orderID: order.id,
                  price: order.total_price,
                  postData: getPostResponse.data,
                }
              }
            } else return
          })
        )
        const filtered = ownOrderData.filter(el => el)
        setOnGoing(onGoing => [...onGoing, ...filtered])
        setIsLoading(false)
      }
    }
  }

  const initSellerOrders = async () => {
    const getOwnPostResponse = await PostService.getUserPosts({
      uid: user?.uid,
    })
    if (getOwnPostResponse.success) {
      if (!getOwnPostResponse.data) {
        return
      }
      const sellerOrderData = await Promise.all(
        getOwnPostResponse.data.map(async post => {
          const responseOrders = await Api.getOrders({
            uid: user?.uid,
            pid: post.id,
          })
          if (responseOrders.success) {
            const { full_name, display_name, profile_photo } = userInfo
            let latestTimeStampOrder = post.date_posted._seconds
            if (Object.keys(responseOrders.data).length)
              latestTimeStampOrder = await getLatest(responseOrders.data)

            return {
              profilePhoto: profile_photo,
              name: display_name ? display_name : full_name,
              cardType: 'seller',
              time: latestTimeStampOrder,
              cover_photos: post.cover_photos,
              orders: responseOrders.data,
              postData: post,
            }
          } else return
        })
      )
      setOnGoing(onGoing => [...onGoing, ...sellerOrderData])
      setIsLoading(false)
    }
  }

  const getLatest = async orderData => {
    const timeStampList = []
    for (const [key, orders] of Object.entries(orderData)) {
      orders.map(order => {
        timeStampList.push(order.date._seconds)
      })
    }
    return Math.max(...timeStampList)
  }

  useEffect(() => {
    setIsLoading(true)
    initOwnOrders()
    initSellerOrders()
  }, [])

  return (
    <SafeAreaView>
      <TransitionIndicator loading={isLoading} />
      {!onGoing.length ? (
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
              onPress={() => navigation.navigate('dashboard')}>
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
            {onGoing.map((info, i) => {
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
