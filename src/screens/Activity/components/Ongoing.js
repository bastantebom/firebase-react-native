import React, { useState, useEffect, useContext } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import PostService from '@/services/Post/PostService'

import { AppText, TransitionIndicator } from '@/components'
import { normalize, Colors } from '@/globals'
import IllustActivity from '@/assets/images/activity-img1.svg'
import ActivitiesCard from './ActivitiesCard'

const Ongoing = ({ sortCategory }) => {
  const navigation = useNavigation()
  const { user, userInfo } = useContext(UserContext)

  const [onGoing, setOnGoing] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const initOwnOrders = async () => {
    const ownOrdersResponse = await Api.getOwnOrders({ uid: user?.uid })
    if (ownOrdersResponse.success) {
      if (!ownOrdersResponse.data.length) return true
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
      return true
    }
  }

  const initSellerOrders = async () => {
    const getOwnPostResponse = await PostService.getUserPosts({
      uid: user?.uid,
    })
    if (getOwnPostResponse.success) {
      if (!getOwnPostResponse.data) return true
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
          } else return true
        })
      )
      setOnGoing(onGoing => [...onGoing, ...sellerOrderData])
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

  const callAllOrders = async () => {
    await Promise.all([initOwnOrders(), initSellerOrders()])
    setIsLoading(false)
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
      {!onGoing.length && !isLoading ? (
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
      ) : (
        !isLoading && (
          <ScrollView>
            <View style={{ paddingTop: normalize(15) }}>
              <View style={{ paddingHorizontal: normalize(15) }}>
                <AppText
                  textStyle="eyebrow1"
                  customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                  NEW
                </AppText>
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
})

export default Ongoing
