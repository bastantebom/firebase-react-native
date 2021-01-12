import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { AppText, ScreenHeaderTitle, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import {
  Chat,
  PostCash,
  ChevronUp,
  ChevronDown,
  GreenTick,
  Icons,
  PostClock,
  PayoutWallet,
} from '@/assets/images/icons'

import ActivitiesCard from './components/ActivitiesCard'
import ItemCard from './components/ItemCard'
import Api from '@/services/Api'

const OngoingItem = ({ route, navigation }) => {
  const [pendingPayment, showPendingPayment] = useState(false)
  const [requests, showRequests] = useState(false)
  const [ongoing, showOngoing] = useState(false)
  const [readyForDelivery, showReadyForDelivery] = useState(false)
  const [readyForPickup, showReadyForPickup] = useState(false)
  const [completed, showCompleted] = useState(false)

  const { orders, name, title, type, postData } = route?.params?.info
  const [pending, setPending] = useState([])

  const [isPendingLoading, setIsPendingLoading] = useState(false)

  const initPending = async orders => {
    if (!orders?.length) return
    setIsPendingLoading(true)
    const orderedList = orders.sort((a, b) => a.date._seconds - b.date._seconds)
    const done = await Promise.all(
      orderedList.map(async (order, index) => {
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
            cardType: order.status,
            amount: order.total_price
              ? order.total_price
              : order.items[0].price,
            timeStamp: order.date._seconds,
            paymentMode: order.payment_method,
            orderID: order.id,
            numOfItems: order.items?.length ? order.items?.length : 0,
            postId: order.post_id,
            type: postData.type,
          }
        } else return {}
      })
    )
    setPending(pending => [...pending, ...done])
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      initPending(orders?.pending)
      initPending(orders?.confirmed)
      initPending(orders?.paid)
      initPending(orders?.delivering)
      initPending(orders?.pickup)
      initPending(orders?.completed)
    }
    return () => (isMounted = false)
  }, [orders])

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <ScrollView>
        <TransitionIndicator loading={isPendingLoading} />
        <View style={styles.itemCardContainer}>
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title={name}
            paddingSize={2}
            iconSize={normalize(16)}
            rightIcon={
              <View>
                <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: Colors.secondaryBrinkPink,
                    top: normalize(-7),
                    right: normalize(-8),
                    paddingHorizontal: normalize(6),
                    borderRadius: 16,
                  }}>
                  <AppText textStyle="eyebrow" color={Colors.neutralsWhite}>
                    2
                  </AppText>
                </View>
              </View>
            }
            rightIconEvent={() =>
              navigation.navigate('NBTScreen', { screen: 'PostChat' })
            }
          />
          <ActivitiesCard info={route?.params?.info} />
        </View>

        {pending?.filter(order => order.cardType === 'pendingPayment').length >
          0 && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              onPress={() => showPendingPayment(!pendingPayment)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={styles.iconText}>
                <Icons.WalletGray
                  width={normalize(18)}
                  height={normalize(18)}
                />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Awaiting Payment
                </AppText>
                <View
                  style={[
                    styles.iconBadge,
                    { backgroundColor: Colors.secondaryBrinkPink },
                  ]}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      pending?.filter(
                        order => order.cardType === 'pendingPayment'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {pendingPayment ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>
            {pendingPayment && (
              <View style={{ marginTop: normalize(8) }}>
                {pending
                  ?.filter(order => order.cardType === 'pendingPayment')
                  .map((item, i) => {
                    return (
                      <View key={i}>
                        <ItemCard item={item} />
                      </View>
                    )
                  })}
              </View>
            )}
          </View>
        )}

        {pending?.filter(order => order.cardType === 'pending').length > 0 && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              onPress={() => showRequests(!requests)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={styles.iconText}>
                <Icons.ChatGray />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Requests
                </AppText>
                <View
                  style={[
                    styles.iconBadge,
                    { backgroundColor: Colors.secondaryDarkTangerine },
                  ]}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      pending?.filter(order => order.cardType === 'pending')
                        .length
                    }
                  </AppText>
                </View>
              </View>
              {requests ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>
            {requests && (
              <View style={{ marginTop: normalize(8) }}>
                {pending
                  ?.filter(order => order.cardType === 'pending')
                  .map((item, i) => {
                    return (
                      <View key={i}>
                        <ItemCard item={item} />
                      </View>
                    )
                  })}
              </View>
            )}
          </View>
        )}

        {pending?.filter(
          order => order.cardType === 'confirmed' || order.cardType === 'paid'
        ).length > 0 && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              onPress={() => showOngoing(!ongoing)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={styles.iconText}>
                <PostClock />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  {type === 'sell' ? 'Confirmed and Paid' : 'Ongoing'}
                </AppText>
                <View
                  style={[
                    styles.iconBadge,
                    { backgroundColor: Colors.secondaryShamrock },
                  ]}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      pending?.filter(
                        order =>
                          order.cardType === 'confirmed' ||
                          order.cardType === 'paid'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {ongoing ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>
            {ongoing && (
              <View style={{ marginTop: normalize(8) }}>
                {pending
                  ?.filter(
                    order =>
                      order.cardType === 'confirmed' ||
                      order.cardType === 'paid'
                  )
                  .map((item, i) => {
                    return (
                      <View key={i}>
                        <ItemCard item={item} />
                      </View>
                    )
                  })}
              </View>
            )}
          </View>
        )}

        {(pending?.filter(order => order.cardType === 'delivering').length >
          0 ||
          pending?.filter(order => order.cardType === 'pickup').length > 0) && (
          <View style={styles.itemCard}>
            {pending?.filter(order => order.cardType === 'delivering').length >
              0 && (
              <View>
                <TouchableOpacity
                  onPress={() => showReadyForDelivery(!readyForDelivery)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={styles.iconText}>
                      <AppText textStyle="body1medium">
                        Ready for Delivery
                      </AppText>
                      <View
                        style={[
                          styles.iconBadge,
                          { backgroundColor: Colors.secondaryShamrock },
                        ]}>
                        <AppText
                          textStyle="metadata"
                          color={Colors.neutralsWhite}>
                          {
                            pending?.filter(
                              order => order.cardType === 'delivering'
                            ).length
                          }
                        </AppText>
                      </View>
                    </View>
                    {readyForDelivery ? (
                      <ChevronUp width={normalize(16)} height={normalize(16)} />
                    ) : (
                      <ChevronDown
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {readyForDelivery && (
                  <>
                    {pending
                      ?.filter(order => order.cardType === 'delivering')
                      .map((item, i) => {
                        return (
                          <View key={i}>
                            <ItemCard item={item} />
                          </View>
                        )
                      })}
                  </>
                )}
              </View>
            )}
            {pending?.filter(order => order.cardType === 'pickup').length >
              0 && (
              <View>
                <TouchableOpacity
                  onPress={() => showReadyForPickup(!readyForPickup)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={styles.iconText}>
                      <AppText textStyle="body1medium">
                        Ready for Pick up
                      </AppText>
                      <View
                        style={[
                          styles.iconBadge,
                          { backgroundColor: Colors.secondaryShamrock },
                        ]}>
                        <AppText
                          textStyle="metadata"
                          color={Colors.neutralsWhite}>
                          {
                            pending?.filter(
                              order => order.cardType === 'pickup'
                            ).length
                          }
                        </AppText>
                      </View>
                    </View>
                    {readyForPickup ? (
                      <ChevronUp width={normalize(16)} height={normalize(16)} />
                    ) : (
                      <ChevronDown
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {readyForPickup && (
                  <>
                    {pending
                      ?.filter(order => order.cardType === 'pickup')
                      .map((item, i) => {
                        return (
                          <View key={i}>
                            <ItemCard item={item} />
                          </View>
                        )
                      })}
                  </>
                )}
              </View>
            )}
          </View>
        )}

        {pending?.filter(order => order.cardType === 'completed').length >
          0 && (
          <View style={styles.itemCard}>
            <TouchableOpacity onPress={() => showCompleted(!completed)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={styles.iconText}>
                  <GreenTick />
                  <AppText
                    textStyle="body1medium"
                    customStyle={{ marginLeft: normalize(10) }}>
                    Completed
                  </AppText>
                </View>
                {completed ? (
                  <ChevronUp width={normalize(16)} height={normalize(16)} />
                ) : (
                  <ChevronDown width={normalize(16)} height={normalize(16)} />
                )}
              </View>
            </TouchableOpacity>
            {completed && (
              <View style={{ marginTop: normalize(8) }}>
                {pending
                  ?.filter(order => order.cardType === 'completed')
                  .map((item, i) => {
                    return (
                      <View key={i}>
                        <ItemCard item={item} />
                      </View>
                    )
                  })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Past')}>
          <AppText textStyle="body1medium" color={Colors.contentOcean}>
            View Past Orders
          </AppText>
        </TouchableOpacity>
      </View>
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
  },
  itemCardContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 8,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: normalize(10),
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(16),
  },
  iconBadge: {
    borderRadius: 50,
    marginLeft: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(18),
    height: normalize(18),
  },
  bottomBtnContainer: {
    marginTop: normalize(8),
    paddingVertical: normalize(25),
    paddingHorizontal: normalize(25),
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: 'white',
  },
})

export default OngoingItem
