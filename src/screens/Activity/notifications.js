import React, { useEffect, useState, useContext } from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { groupBy } from 'lodash'
import { AppText, ScreenHeaderTitle, TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import { Calendar } from '@/assets/images/icons'

import Toast from '@/components/toast'
import Welcome from '@/screens/Activity/components/notifications/welcome'
import Verification from '@/screens/Activity/components/notifications/verification'
import Follow from '@/screens/Activity/components/notifications/follow'
import Order from '@/screens/Activity/components/notifications/order'
import Payment from '@/screens/Activity/components/notifications/payment'
import Grouped from '@/screens/Activity/components/notifications/grouped'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { useNavigation } from '@react-navigation/native'
import Api from '@/services/Api'
import moment from 'moment'
import StatusBar from '@/components/StatusBar'

const Notifications = () => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRereshing, setIsRereshing] = useState(false)
  const [lastItemId, setLastItemId] = useState(undefined)
  const [noMoreNotifications, setNoMoreNorifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [newNotifications, setNewNotification] = useState([])
  const [earlierNotifications, setEarlierNotification] = useState([])
  const [followings, setFollowings] = useState([])

  const dateNow = new Date() / 1000
  const today = moment().startOf('day').unix()
  const yesterday = moment().startOf('day').subtract(1, 'days').unix()
  const thisweek = moment().startOf('day').subtract(7, 'days').unix()
  const thismonth = moment().startOf('day').subtract(30, 'days').unix()

  const groupByToday = () => {
    return earlierNotifications?.filter(
      notif => dateNow - notif[0].date._seconds <= dateNow - today
    )
  }

  const groupByYesterday = () => {
    return earlierNotifications?.filter(
      notif =>
        dateNow - notif[0].date._seconds <= dateNow - yesterday &&
        dateNow - notif[0].date._seconds > dateNow - today
    )
  }

  const groupByThisWeek = () => {
    return earlierNotifications?.filter(
      notif =>
        dateNow - notif[0].date._seconds <= dateNow - thisweek &&
        dateNow - notif[0].date._seconds > dateNow - yesterday
    )
  }

  const groupByThisMonth = () => {
    return earlierNotifications?.filter(
      notif =>
        dateNow - notif[0].date._seconds <= dateNow - thismonth &&
        dateNow - notif[0].date._seconds > dateNow - thisweek
    )
  }

  const groupByPastMonths = () => {
    return earlierNotifications?.filter(
      notif => dateNow - notif[0].date._seconds > dateNow - thismonth
    )
  }

  const loadNotifications = async ({ isLoadMore }) => {
    if (isLoadingMore) return

    let notificationQuery = firestore()
      .collection('activities')
      .doc(user.uid)
      .collection('notifications')
      .orderBy('date', 'desc')

    if (lastItemId && isLoadMore) {
      const lastItemRef = await firestore()
        .collection('activities')
        .doc(user.uid)
        .collection('notifications')
        .where('id', '==', lastItemId)
        .get()
      const lastItemDoc = lastItemRef.docs[0]

      notificationQuery = notificationQuery.startAfter(lastItemDoc)
    }
    notificationQuery = notificationQuery.limit(10)

    const notificationRef = await notificationQuery.get()
    const notificationsData = notificationRef.docs.map(doc => doc.data())

    if (!notificationsData.length) {
      setNoMoreNorifications(true)
      return
    }

    setLastItemId(notificationsData[notificationsData.length - 1].id)

    const pendingOrderNotifications =
      groupBy(
        notificationsData.filter(notif => notif.status === 'pending'),
        notif => notif.post_id
      ) || {}

    const otherNotifications =
      groupBy(
        notificationsData.filter(notif => notif.status !== 'pending'),
        notif => notif.id
      ) || {}

    const currentNotification = []
    Object.values({
      ...pendingOrderNotifications,
      ...otherNotifications,
    }).forEach(notification => currentNotification.push(notification))

    setIsLoading(false)
    setIsRereshing(false)
    setIsLoadingMore(false)
    setNotifications(
      isLoadMore
        ? [...notifications, ...currentNotification]
        : currentNotification
    )
  }

  const loadMoreNotifiations = () => {
    if (noMoreNotifications) return
    setIsLoadingMore(true)
    loadNotifications({ isLoadMore: true })
  }

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    )
  }

  const getFollowing = async () => {
    try {
      const response = await Api.getFollowing({ uid: user.uid })

      if (!response.success) throw new Error(response.message)

      setFollowings(response.data)
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  useEffect(() => {
    loadNotifications({ isLoadMore: false })
    getFollowing()
  }, [])

  useEffect(() => {
    const sortedMulitpleNotifications = notifications.map(item => {
      if (item.length > 1)
        item.sort((a, b) => b.date._seconds - a.date._seconds)

      return item
    })

    sortedMulitpleNotifications.sort(
      (a, b) => b[0].date._seconds - a[0].date._seconds
    )

    setNewNotification(
      sortedMulitpleNotifications.filter(
        notification =>
          new Date() / 1000 - notification[0].date._seconds <= 36000
      )
    )

    setEarlierNotification(
      sortedMulitpleNotifications.filter(
        notification =>
          new Date() / 1000 - notification[0].date._seconds > 36000
      )
    )
  }, [notifications])

  const unreadNotification = async id => {
    if (!id && !user?.uid) return
    const docRef = firestore()
      .collection('activities')
      .doc(user.uid)
      .collection('notifications')
      .doc(id)

    await docRef.update({
      read: true,
    })
  }

  const renderCard = notification => {
    if (notification.type === 'welcome') {
      return (
        <Welcome unreadNotification={unreadNotification} item={notification} />
      )
    } else if (notification.type === 'verification') {
      return (
        <Verification
          unreadNotification={unreadNotification}
          item={notification}
        />
      )
    } else if (notification.type === 'follow') {
      return (
        <Follow
          unreadNotification={unreadNotification}
          item={notification}
          followings={followings}
        />
      )
    } else if (notification.type === 'order') {
      return (
        <Order unreadNotification={unreadNotification} item={notification} />
      )
    } else if (notification.type === 'payment') {
      return (
        <Payment unreadNotification={unreadNotification} item={notification} />
      )
    }
  }

  const renderGroupedNotification = notification => {
    return (
      <Grouped unreadNotification={unreadNotification} item={notification} />
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'Notifications')}
      />
      <TransitionIndicator loading={isLoading} />
      <View style={styles.contentWrapper}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          title="Notifications"
          paddingSize={3}
        />
        <View
          style={{
            paddingHorizontal: normalize(15),
            paddingBottom: normalize(90),
          }}>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) loadMoreNotifiations()
            }}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRereshing}
                titleColor={Colors.primaryMidnightBlue}
                tintColor={Colors.primaryYellow}
                onRefresh={() => {
                  setNoMoreNorifications(false)
                  setIsRereshing(true)
                  loadNotifications({ isLoadMore: false })
                }}
              />
            }>
            {!!groupByToday().length ||
              (!!newNotifications.length && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calendar
                    height={normalize(20)}
                    width={normalize(20)}
                    style={{ marginRight: 10 }}
                  />
                  <AppText textStyle="body3">Today</AppText>
                </View>
              ))}

            {!!newNotifications.length && (
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                NEW
              </AppText>
            )}

            {newNotifications.map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {!!groupByToday().length && (
              <AppText
                textStyle="eyebrow1"
                customStyle={{ color: '#91919C', paddingTop: normalize(15) }}>
                EARLIER
              </AppText>
            )}

            {groupByToday().map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {!!groupByYesterday().length && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(15),
                }}>
                <Calendar
                  height={normalize(20)}
                  width={normalize(20)}
                  style={{ marginRight: 10 }}
                />
                <AppText textStyle="body3">Yesterday</AppText>
              </View>
            )}

            {groupByYesterday().map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {!!groupByThisWeek().length && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(15),
                }}>
                <Calendar
                  height={normalize(20)}
                  width={normalize(20)}
                  style={{ marginRight: 10 }}
                />
                <AppText textStyle="body3">This Week</AppText>
              </View>
            )}

            {groupByThisWeek().map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {!!groupByThisMonth().length && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(15),
                }}>
                <Calendar
                  height={normalize(20)}
                  width={normalize(20)}
                  style={{ marginRight: 10 }}
                />
                <AppText textStyle="body3">This Month</AppText>
              </View>
            )}

            {groupByThisMonth().map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {!!groupByPastMonths().length && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(15),
                }}>
                <Calendar
                  height={normalize(20)}
                  width={normalize(20)}
                  style={{ marginRight: 10 }}
                />
                <AppText textStyle="body3">Past Months</AppText>
              </View>
            )}

            {groupByPastMonths().map(notification => {
              return (
                <View key={notification[0].id}>
                  {notification.length === 1
                    ? renderCard(notification[0])
                    : renderGroupedNotification(notification)}
                </View>
              )
            })}

            {noMoreNotifications && (
              <Text style={styles.noMorePost}>No new buzz right now.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  activeIndicator: {
    paddingVertical: normalize(20),
  },
  noMorePost: {
    paddingVertical: normalize(20),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    textAlign: 'center',
    color: '#A8AAB7',
  },
})

export default Notifications
