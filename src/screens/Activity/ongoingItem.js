import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { AppText, ScreenHeaderTitle, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import {
  Chat,
  PostCash,
  ChevronUp,
  ChevronDown,
  GreenTick,
} from '@/assets/images/icons'

import ActivitiesCard from './components/ActivitiesCard'
import ItemCard from './components/ItemCard'
import Api from '@/services/Api'

const OngoingItem = ({ route }) => {
  const navigation = useNavigation()
  const [readyForDelivery, showReadyForDelivery] = useState(false)
  const [readyForPickup, showReadyForPickup] = useState(false)

  const { orders, name, title, type } = route?.params?.info
  const [pending, setPending] = useState([])
  const [ongoingDelivery, setOngoingDelivery] = useState([])
  const [ongoingPickup, setOngoingPickup] = useState([])
  const [completed, setCompleted] = useState([])

  const [isPendingLoading, setIsPendingLoading] = useState(false)

  const initPending = async orders => {
    if (!orders?.length) return
    setIsPendingLoading(true)
    const done = await Promise.all(
      orders.map(async (order, index) => {
        const getUserResponse = await Api.getUser({ uid: order.buyer_id })
        if (getUserResponse.success) {
          if (orders.length === index + 1) setIsPendingLoading(false)
          const {
            profile_photo,
            display_name,
            full_name,
          } = getUserResponse.data
          return {
            profilePhoto: profile_photo,
            customer: display_name ? display_name : full_name,
            cardType: 'pending',
            amount: order.total_price,
            timeStamp: order.date._seconds,
            paymentMode: 'Cash',
            orderID: order.id,
            numOfItems: order.items?.length ? order.items?.length : 0,
            postId: order.post_id,
            type,
          }
        } else return {}
      })
    )
    setPending(done)
  }

  useEffect(() => {
    initPending(orders?.pending)
  }, [orders])

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScrollView>
        <TransitionIndicator loading={isPendingLoading} />
        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            paddingBottom: 8,
          }}>
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title={title}
            paddingSize={2}
            iconSize={normalize(16)}
          />
          <ActivitiesCard info={route?.params?.info} />
        </View>
        {pending.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              marginVertical: normalize(10),
              paddingVertical: normalize(30),
              paddingHorizontal: normalize(16),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={styles.iconText}>
                <Chat />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Requests
                </AppText>
              </View>
              <TouchableOpacity>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  View All
                </AppText>
              </TouchableOpacity>
            </View>
            {pending.map((item, i) => {
              return (
                <View key={i}>
                  <ItemCard item={item} />
                </View>
              )
            })}
          </View>
        )}
        {ongoingDelivery.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              marginVertical: normalize(10),
              paddingVertical: normalize(30),
              paddingHorizontal: normalize(16),
            }}>
            <View style={styles.iconText}>
              <PostCash />
              <AppText
                textStyle="body1medium"
                customStyle={{ marginLeft: normalize(10) }}>
                Ongoing
              </AppText>
            </View>
            <View style={{ marginBottom: normalize(20) }}>
              <TouchableOpacity
                onPress={() => showReadyForDelivery(!readyForDelivery)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <AppText textStyle="body2medium">
                    Ready for Delivery (2)
                  </AppText>
                  {readyForDelivery ? (
                    <ChevronUp width={normalize(16)} height={normalize(16)} />
                  ) : (
                    <ChevronDown width={normalize(16)} height={normalize(16)} />
                  )}
                </View>
              </TouchableOpacity>
              {/* {readyForDelivery && (
              <>
                {ongoingDeliveryCards.map((item, i) => {
                  return (
                    <View key={i}>
                      <ItemCard item={item} />
                    </View>
                  )
                })}
              </>
            )} */}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => showReadyForPickup(!readyForPickup)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <AppText textStyle="body2medium">
                    Ready for Pick up (1)
                  </AppText>
                  {readyForPickup ? (
                    <ChevronUp width={normalize(16)} height={normalize(16)} />
                  ) : (
                    <ChevronDown width={normalize(16)} height={normalize(16)} />
                  )}
                </View>
              </TouchableOpacity>
              {/* {readyForPickup && (
              <>
                {ongoingPickupCards.map((item, i) => {
                  return (
                    <View key={i}>
                      <ItemCard item={item} />
                    </View>
                  )
                })}
              </>
            )} */}
            </View>
          </View>
        )}

        {completed.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              paddingVertical: normalize(30),
              paddingHorizontal: normalize(16),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={styles.iconText}>
                <GreenTick />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Completed
                </AppText>
              </View>
              <TouchableOpacity>
                <AppText textStyle="button2" color={Colors.contentOcean}>
                  View All
                </AppText>
              </TouchableOpacity>
            </View>
            {completed.map((item, i) => {
              return (
                <View key={i}>
                  <ItemCard item={item} />
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: normalize(10),
  },
})

export default OngoingItem
