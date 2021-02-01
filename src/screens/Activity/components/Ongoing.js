import React, { useState, useEffect, useContext } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import Api from '@/services/Api'
import PostService from '@/services/Post/PostService'

import { AppText, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import { IllustActivity, NoReview, NoPost, NoInfo } from '@/assets/images'
import ActivitiesCard from './ActivitiesCard'

const Ongoing = ({ sortCategory }) => {
  const { initChats } = useContext(Context)
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const [onGoing, setOnGoing] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const initOwnOrders = async () => {
    const ownOrdersResponse = await Api.getOwnOrders({ uid: user?.uid })
    if (ownOrdersResponse.success) {
      if (!ownOrdersResponse.data.length) return true
      let ownOrderData = await Promise.all(
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
              return true
            }
            if (getPostResponse.success && getUserReponse.success) {
              const {
                full_name,
                display_name,
                profile_photo,
              } = getUserReponse.data

              return {
                profilePhoto: profile_photo,
                name: display_name || full_name,
                cardType: 'own',
                status: order.status,
                time: order.date._seconds,
                orderID: order.id,
                payment: order.payment_method,
                price: order.total_price,
                postData: getPostResponse.data,
              }
            }
          } else return
        })
      )
      ownOrderData = ownOrderData.filter(el => el)
      setOnGoing(onGoing =>
        [...onGoing, ...ownOrderData].sort((a, b) => b.time - a.time)
      )
      return true
    }
  }

  const initSellerOrders = async () => {
    const getOwnPostResponse = await PostService.getUserPosts({
      uid: user?.uid,
    })
    if (getOwnPostResponse.success) {
      if (!getOwnPostResponse.data) return true
      let sellerOrderData = await Promise.all(
        getOwnPostResponse.data.map(async post => {
          const responseOrders = await Api.getOrders({
            uid: user?.uid,
            pid: post.id,
          })
          if (responseOrders.success) {
            const { full_name, display_name, profile_photo } = userInfo
            let latestTimeStampOrder = post.date_posted._seconds
            let sortedOrders = responseOrders.data
            if (Object.keys(sortedOrders).length) {
              latestTimeStampOrder = await getLatest(responseOrders.data)
              sortedOrders = await getSorted(responseOrders.data)
            }

            return {
              profilePhoto: profile_photo,
              name: display_name || full_name,
              cardType: 'seller',
              time: latestTimeStampOrder,
              cover_photos: post.cover_photos,
              orders: sortedOrders,
              postData: post,
            }
          } else return true
        })
      )

      setOnGoing(onGoing =>
        [...onGoing, ...sellerOrderData].sort((a, b) => b.time - a.time)
      )
      return true
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

  const getSorted = async orderData => {
    let sortedOrders = {}
    for (const [key, orders] of Object.entries(orderData)) {
      sortedOrders[`${key}`] = orders.sort(
        (a, b) => b.date._seconds - a.date._seconds
      )
    }
    return sortedOrders
  }

  const callAllOrders = async () => {
    await Promise.all([initOwnOrders(), initSellerOrders()])
    setIsLoading(false)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    setIsRefreshing(true)
    setOnGoing([])
    await initChats(user?.uid)
    await callAllOrders()
    setIsRefreshing(false)
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setIsLoading(true)
      callAllOrders()
    }
    return () => (isMounted = false)
  }, [])

  return (
    <SafeAreaView>
      <TransitionIndicator loading={isLoading} />
      {!onGoing.filter(post =>
        sortCategory.value === 'all'
          ? post
          : post.cardType === sortCategory.value
      ).length &&
      !isLoading &&
      sortCategory.value === 'past' ? (
        <ScrollView contentContainerStyle={{ padding: normalize(15) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <IllustActivity width={normalize(250)} height={normalize(200)} />
            <AppText
              textStyle="display5"
              color={Colors.primaryMidnightBlue}
              customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
              Start buzzing on Servbees!
            </AppText>
            <View style={styles.descHolder}>
              <AppText
                customStyle={{
                  textAlign: 'center',
                }}
                textStyle="body2">
                Get busy with more projects, buying and selling items, boosting
                your online business or just browsing what’s new in your
                neighborhood.
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
      ) : !onGoing.filter(post =>
          sortCategory.value === 'all'
            ? post
            : post.cardType === sortCategory.value
        ).length &&
        !isLoading &&
        sortCategory.value !== 'past' ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: normalize(16),
            paddingBottom: normalize(25),
          }}>
          <View style={styles.emptyState}>
            {sortCategory.value === 'all' ? (
              <NoPost />
            ) : sortCategory.value === 'own' ? (
              <NoReview />
            ) : (
              <NoInfo />
            )}
            <AppText
              textStyle="display6"
              customStyle={{
                marginBottom: normalize(4),
                marginTop: normalize(15),
              }}>
              {sortCategory.value === 'all'
                ? `No activities yet`
                : sortCategory.value === 'own'
                ? `No orders yet`
                : `No offers yet`}
            </AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              {sortCategory.value === 'all'
                ? `Start checking what you can offer and discover the best deals in your area.`
                : sortCategory.value === 'own'
                ? `Keep on posting about your products to attract orders, Buzzybee!`
                : `Getting projects starts by making offers, Buzzybee! `}
            </AppText>
          </View>
        </ScrollView>
      ) : (
        !isLoading && (
          <ScrollView
            refreshControl={
              <RefreshControl
                style={{ zIndex: 1 }}
                refreshing={isRefreshing}
                titleColor="#2E3034"
                tintColor="#2E3034"
                onRefresh={handleRefresh}
              />
            }>
            <View style={{ paddingTop: normalize(15) }}>
              <View style={{ paddingHorizontal: normalize(15) }}>
                {onGoing.filter(post =>
                  sortCategory.value === 'all'
                    ? post
                    : post.cardType === sortCategory.value
                ).length && (
                  <AppText
                    textStyle="eyebrow1"
                    customStyle={{
                      color: '#91919C',
                      paddingTop: normalize(15),
                    }}>
                    NEW
                  </AppText>
                )}
              </View>
              {onGoing
                .filter(post =>
                  sortCategory.value === 'all'
                    ? post
                    : post.cardType === sortCategory.value
                )
                .map((info, i) => {
                  return (
                    <View key={i}>
                      <ActivitiesCard info={info} />
                    </View>
                  )
                })}
            </View>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  descHolder: {
    paddingTop: normalize(10),
    paddingBottom: normalize(25),
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

export default Ongoing
