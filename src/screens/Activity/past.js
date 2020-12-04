import React, { useState, useEffect, useContext } from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  AppText,
  ScreenHeaderTitle,
  PaddingView,
  TransitionIndicator,
} from '@/components'
import { normalize } from '@/globals'
import { Calendar, ArrowLeft } from '@/assets/images/icons'
import ActivitiesCard from '../Activity/components/ActivitiesCard'
import { UserContext } from '@/context/UserContext'
import IllustActivity from '@/assets/images/activity-img1.svg'
import Api from '@/services/Api'

const Past = () => {
  const [pastActivity, setPastActivity] = useState({
    activities: [],
  })
  const [past, setPast] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, userInfo } = useContext(UserContext)

  const oldNotificationsCards = [
    {
      category: 'Follow',
      badge: 'Red',
      name: 'Trisha Paredes',
      time: '3w',
    },
    {
      category: 'Approve',
      badge: 'Yellow',
      hiveName: 'Pixel',
      time: '4m',
    },
    {
      category: 'Default',
      name: 'Wayne',
      message:
        "Hey Wayne! Don't forget, June 21st is Father's Day 🎁 Check out and shop our collection of brands that dads love.",
      time: '6m',
    },
  ]

  const initOwnPast = async () => {
    const ownOrdersResponse = await Api.getOwnOrders({ uid: user?.uid })
    if (ownOrdersResponse.success) {
      if (!ownOrdersResponse.data.length) {
        setIsLoading(false)
        return
      } else {
        const ownOrderData = await Promise.all(
          ownOrdersResponse.data.map(async order => {
            if (
              order.status === 'cancelled' ||
              order.status === 'declined' ||
              order.status === 'completed'
            ) {
              const getPostResponse = await Api.getPost({
                pid: order.post_id,
              })
              const getUserReponse = await Api.getUser({
                uid: order.seller_id,
              })
              if (!getPostResponse.success) {
                setIsLoading(false)
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
        setPast(past => [...past, ...filtered])
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    setIsLoading(true)
    initOwnPast()
  }, [])

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <TransitionIndicator loading={isLoading} />
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          title="Past Activities"
        />
      </PaddingView>
      {past.length == 0 ? (
        <View
          style={{
            paddingHorizontal: normalize(12),
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: 24,
          }}>
          <IllustActivity width={normalize(250)} height={normalize(200)} />
          <AppText
            textStyle="body1"
            customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
            Get Active and Whatnots {'\n'} & Click Like or Whatever eh!
          </AppText>
          <View style={styles.descHolder}>
            <AppText customStyle={{ textAlign: 'center' }}>
              Get projects, buy and sell items, start your own online business,
              or just bookmark posts—do all these and more on Servbees.
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
      ) : (
        <ScrollView
          style={{ paddingTop: normalize(20), paddingTop: normalize(30) }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}>
            <Calendar
              height={normalize(20)}
              width={normalize(20)}
              style={{ marginRight: 10 }}
            />
            <AppText textStyle="caption2">Last 6 Months</AppText>
          </View>
          <View style={{ paddingTop: 15 }}>
            {past.map((info, i) => {
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
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(16),
    paddingHorizontal: normalize(16),
    backgroundColor: 'white',
  },
  descHolder: {
    paddingTop: normalize(10),
    paddingBottom: normalize(25),
  },
})

export default Past
