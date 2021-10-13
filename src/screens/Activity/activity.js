import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native'
import Modal from 'react-native-modal'
import firestore from '@react-native-firebase/firestore'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { UserContext } from '@/context/UserContext'
import { Icons } from '@/assets/images/icons'
import { Images, NoInfo } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { TransitionIndicator } from '@/components'
import ActivitiesCard from '@/screens/Activity/components/card'
import ActivitySort from './components/sort-modal'
import Api from '@/services/Api'
import { HyperLink } from '@/components'
import { Context } from '@/context'
import StatusBar from '@/components/StatusBar'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Activity'>} param0 */
const Activity = ({ navigation }) => {
  const { userInfo, counts } = useContext(UserContext)
  const { setCreatePostPopupVisible } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortModal, setSortModal] = useState(false)
  const [sort, setSort] = useState({
    label: 'All Activities',
    value: 'all',
    description: 'These are all your activities',
  })
  const [activities, setActivities] = useState({})
  const [resDataLength, setResDataLength] = useState(0)
  const lastId = useRef(null)

  const renderEmptyIcon = () => {
    switch (sort.value) {
      case 'all':
        return <Images.NoPosts />
      case 'my offers':
      case 'my orders':
      case 'past':
        return <Images.NoReview />
      default:
        return <NoInfo />
    }
  }

  const renderEmptyHeadingText = () => {
    switch (sort.value) {
      case 'all':
        return 'Start getting buzy'
      case 'my offers':
        return 'No offers yet'
      case 'my orders':
        return 'No orders yet'
      case 'past':
        return 'No past orders yet'
      default:
        return ''
    }
  }

  const renderEmptyBodyText = () => {
    switch (sort.value) {
      case 'all':
        return 'Nothing here yet, Buzybee! Sell, offer service, shop, or save the best deals near you.'
      case 'my offers':
        return 'Getting projects starts by making offers, Buzzybee!'
      case 'my orders':
        return "Attract orders by posting more! And don't forget to support other bees by ordering, too. "
      default:
        return "Save posts you'd want to go back to or republish in the future. "
    }
  }

  const loadData = async () => {
    if (sort.value === 'all') {
      await loadActivities({ type: 'all' })
    } else if (sort.value === 'my offers') {
      await loadActivities({ type: 'offers' })
    } else if (sort.value === 'my orders') {
      await loadActivities({ type: 'orders' })
    } else if (sort.value === 'past') {
      await loadPast()
    }

    setIsLoading(false)
    setIsRefreshing(false)
  }

  const handleLoadMore = () => {
    if (resDataLength >= 10) loadData()
  }

  const handleActivitiesInfo = async data => {
    return await Promise.all(
      data.map(async item => {
        if (item.category === 'my offer') {
          const response = await Api.getPost({ pid: item.post_id })

          if (!response.success) throw new Error(response.message)

          item.user = userInfo
          item.post = response.data
        } else if (item.category === 'my order') {
          const orderDoc = await firestore()
            .collection('orders')
            .doc(item.order_id)
            .get()

          const { data: userData } = await Api.getUser({
            uid: orderDoc.data().seller_id,
          })

          item.user = userData
          item.order = orderDoc.data()
        }

        return item
      })
    )
  }

  const loadActivities = async ({ type }) => {
    try {
      const params = {
        type,
      }
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getActivities(params)

      if (!response.success) throw new Error(response.message)

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)
      const newItems = await handleActivitiesInfo(response.data)

      setActivities(activities => ({
        ...activities,
        ...newItems.reduce(
          (items, item) => ({
            ...items,
            [item.id]: item,
          }),
          {}
        ),
      }))
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadPast = async () => {
    try {
      const params = {}

      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getPastActivities()

      if (!response.success) throw new Error(response.message)

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)

      const newItems = await Promise.all(
        response.data.map(async item => {
          const { data: userData } = await Api.getUser({
            uid: item.seller_id,
          })

          return {
            category: 'my order',
            date: item.date,
            id: item.id,
            order_id: item.id,
            order: item,
            user: userData,
          }
        })
      )

      setActivities(activities => ({
        ...activities,
        ...newItems.reduce(
          (items, item) => ({
            ...items,
            [item.id]: item,
          }),
          {}
        ),
      }))
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setActivities({})
    lastId.current = null

    loadData()
  }, [sort])

  useEffect(() => {
    setActivities({})
    lastId.current = null

    loadData()
  }, [isRefreshing])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <TransitionIndicator loading={isLoading} />
      <View style={styles.contentWrapper}>
        <View style={[utilStyles.row, styles.headerWrapper]}>
          <TouchableOpacity
            style={utilStyles.row}
            onPress={() => setSortModal(true)}>
            <Text style={[typography.medium, styles.sortText]}>
              {sort.label}
            </Text>
            <Icons.ChevronDown
              style={{ color: 'black' }}
              width={normalize(24)}
              height={normalize(24)}
            />
          </TouchableOpacity>

          <View style={styles.flexRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'Notifications',
                })
              }>
              <Icons.MegaPhoneHeader
                width={normalize(24)}
                height={normalize(24)}
              />
              {!!counts.notification && (
                <View
                  style={{
                    ...styles.notifDot,
                    paddingHorizontal: normalize([
                      counts.notification > 9 ? 2 : 6,
                    ]),
                  }}>
                  <Text style={styles.countText}>
                    {counts.notification >= 99 ? 99 : counts.notification}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {!!Object.values(activities).length && (
          <View style={styles.activityWrapper}>
            <FlatList
              data={Object.values(activities)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ActivitiesCard item={item} />}
              onEndReachedThreshold={0.5}
              onEndReached={handleLoadMore}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  titleColor={Colors.primaryMidnightBlue}
                  tintColor={Colors.primaryYellow}
                  onRefresh={() => setIsRefreshing(true)}
                />
              }
            />
          </View>
        )}

        {!Object.values(activities).length && !isLoading && !isRefreshing && (
          <View style={styles.emptyState}>
            {renderEmptyIcon()}

            <Text style={[typography.subtitle1, styles.emptyHeaderText]}>
              {renderEmptyHeadingText()}
            </Text>

            <Text style={[typography.body2, styles.emptyBodyText]}>
              {renderEmptyBodyText()}
            </Text>
            <HyperLink
              onPress={() => setCreatePostPopupVisible(true)}
              style={[styles.createPostLink]}>
              Create Post
            </HyperLink>
          </View>
        )}
      </View>

      <Modal
        isVisible={sortModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        onSwipeComplete={() => setSortModal(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setSortModal(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setSortModal(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ActivitySort close={() => setSortModal(false)} setSort={setSort} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },

  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(25),
    paddingHorizontal: normalize(16),
    marginTop: getStatusBarHeight(),
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
  headerWrapper: {
    justifyContent: 'space-between',
  },
  notifDot: {
    position: 'absolute',
    top: normalize(-7),
    right: normalize(-8),

    flexWrap: 'wrap',
    paddingVertical: normalize(2),

    backgroundColor: Colors.secondaryBrinkPink,
    borderRadius: 16,
  },
  countText: {
    fontSize: normalize(10),
    letterSpacing: 1.5,
    color: Colors.neutralsWhite,
  },
  sortText: {
    marginRight: normalize(5),
    fontSize: normalize(18),
  },
  activityWrapper: {
    flex: 1,
    paddingTop: normalize(15),
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: normalize(40),
    paddingHorizontal: normalize(20),
  },
  emptyHeaderText: {
    marginBottom: normalize(4),
    marginTop: normalize(15),
  },
  emptyBodyText: {
    textAlign: 'center',
  },
  createPostLink: {
    fontFamily: 'Rounded Mplus 1c',
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#3781FC',
    letterSpacing: 0.25,
    marginTop: 16,
  },
})

export default Activity
