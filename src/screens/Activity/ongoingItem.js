import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { AppText, ScreenHeaderTitle, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import {
  ChevronUp,
  ChevronDown,
  GreenTick,
  Icons,
  PostClock,
} from '@/assets/images/icons'

import { UserContext } from '@/context/UserContext'
import ActivitiesCard from './components/ActivitiesCard'
import ItemCard from './components/ItemCard'
import Api from '@/services/Api'
import _ from 'lodash'
import { NoPost } from '@/assets/images'

const OngoingItem = ({ route, navigation }) => {
  const { user } = useContext(UserContext)
  const [pendingPayment, showPendingPayment] = useState(false)
  const [requests, showRequests] = useState(false)
  const [ongoing, showOngoing] = useState(false)
  const [readyForDelivery, showReadyForDelivery] = useState(false)
  const [readyForPickup, showReadyForPickup] = useState(false)
  const [completed, showCompleted] = useState(false)
  const [postChats, setPostChats] = useState([])
  const { orders, name, title, type, postData } = route?.params?.info
  const [pending, setPending] = useState([])

  const [isPendingLoading, setIsPendingLoading] = useState(false)

  const initPending = async orders => {
    if (!orders?.length) return

    const orderedList = orders.sort((a, b) => a.date._seconds - b.date._seconds)
    const done = await Promise.all(
      orderedList.map(async (order, index) => {
        const getUserResponse = await Api.getUser({ uid: order.buyer_id })
        if (getUserResponse.success) {
          const {
            profile_photo,
            display_name,
            full_name,
          } = getUserResponse.data

          const room = await firestore()
            .collection('chat_rooms')
            .where('post_id', '==', order.post_id)
            .where('members', '==', {
              [user?.uid]: true,
              [order.buyer_id]: true,
            })
            .get()

          let roomChat = []
          setPostChats()
          if (room.docs.length) {
            let channel = room.docs[0].data()

            roomChatRef = await firestore()
              .collection('chat_rooms')
              .doc(channel.id)
              .collection('messages')
              .orderBy('createdAt', 'desc')
              .get()

            if (roomChatRef.docs.length) {
              roomChatRef.docs.map(chat => {
                roomChat = [...roomChat, chat.data()]
              })
            }
          }
          return {
            profilePhoto: profile_photo,
            customer: display_name ? display_name : full_name,
            customerUID: order.buyer_id,
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
            chat: roomChat,
          }
        } else return {}
      })
    )

    setPending(pending => [...pending, ...done])
    setIsPendingLoading(false)
  }

  const handleChatPress = async (members, postId) => {
    let channel
    try {
      if (!user?.uid) return
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', members)
        .where('post_id', '==', postId)
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')
        const { id } = await ref.add({
          members: members,
          post_id: postId,
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }

      navigation.navigate('NBTScreen', {
        screen: 'Chat',
        params: {
          user,
          channel,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setIsPendingLoading(true)
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
      <TransitionIndicator loading={isPendingLoading} />
      <View style={styles.itemCardContainer}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          title={name}
          customTitleStyle={{
            textTransform: 'none',
            maxWidth: '80%',
          }}
          paddingSize={3}
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
                  0
                </AppText>
              </View>
            </View>
          }
          rightIconEvent={() =>
            navigation.navigate('NBTScreen', {
              screen: 'PostChat',
              params: { post: route?.params?.info },
            })
          }
        />
        <ActivitiesCard info={route?.params?.info} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {pending.length ? (
          <View>
            {pending?.filter(order => order.cardType === 'pendingPayment')
              .length > 0 && (
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
                      <AppText
                        textStyle="metadata"
                        color={Colors.neutralsWhite}>
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
                            <ItemCard
                              item={item}
                              handleChatPress={handleChatPress}
                            />
                          </View>
                        )
                      })}
                  </View>
                )}
              </View>
            )}

            {pending?.filter(order => order.cardType === 'pending').length >
              0 && (
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
                      <AppText
                        textStyle="metadata"
                        color={Colors.neutralsWhite}>
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
                            <ItemCard
                              item={item}
                              handleChatPress={handleChatPress}
                            />
                          </View>
                        )
                      })}
                  </View>
                )}
              </View>
            )}

            {pending?.filter(
              order =>
                order.cardType === 'confirmed' || order.cardType === 'paid'
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
                      <AppText
                        textStyle="metadata"
                        color={Colors.neutralsWhite}>
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
                            <ItemCard
                              item={item}
                              handleChatPress={handleChatPress}
                            />
                          </View>
                        )
                      })}
                  </View>
                )}
              </View>
            )}

            {(pending?.filter(order => order.cardType === 'delivering').length >
              0 ||
              pending?.filter(order => order.cardType === 'pickup').length >
                0) && (
              <View style={styles.itemCard}>
                {pending?.filter(order => order.cardType === 'delivering')
                  .length > 0 && (
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
                          <ChevronUp
                            width={normalize(16)}
                            height={normalize(16)}
                          />
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
                                <ItemCard
                                  item={item}
                                  handleChatPress={handleChatPress}
                                />
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
                          <ChevronUp
                            width={normalize(16)}
                            height={normalize(16)}
                          />
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
                                <ItemCard
                                  item={item}
                                  handleChatPress={handleChatPress}
                                />
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
                      <ChevronDown
                        width={normalize(16)}
                        height={normalize(16)}
                      />
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
                            <ItemCard
                              item={item}
                              handleChatPress={handleChatPress}
                            />
                          </View>
                        )
                      })}
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <NoPost />
            <AppText
              textStyle="display6"
              customStyle={{ marginBottom: normalize(4) }}>
              Bee Patient
            </AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Keep posting and soon your order notifications will be buzzing.
            </AppText>
          </View>
        )}
      </ScrollView>

      {pending.length > 0 && (
        <View style={styles.bottomBtnContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Past')}>
            <AppText textStyle="body2medium" color={Colors.contentOcean}>
              View Past Orders
            </AppText>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(25),
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: 'white',
  },
  emptyState: {
    backgroundColor: Colors.neutralsWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(8),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flex: 1,
    padding: normalize(16),
  },
})

export default OngoingItem
