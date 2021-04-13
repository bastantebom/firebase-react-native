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
  StatusBar,
} from 'react-native'
import Modal from 'react-native-modal'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { UserContext } from '@/context/UserContext'
import { Icons } from '@/assets/images/icons'
import { NoInfo, NoPost, NoReview } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { TransitionIndicator } from '@/components'
import ActivitiesCard from '@/screens/Activity/components/card'
import ActivitySort from './components/sort-modal'
import Api from '@/services/Api'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Activity'>} param0 */
const Activity = ({ navigation }) => {
  const { userInfo, counts } = useContext(UserContext)

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
        return <NoPost />
      case 'my offers':
      case 'my orders':
      case 'past':
        return <NoReview />
      default:
        return <NoInfo />
    }
  }

  const renderEmptyHeadingText = () => {
    switch (sort.value) {
      case 'all':
        return 'No activities yet'
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
        return 'Start checking what you can offer and discover the best deals in your area.'
      case 'my offers':
      case 'my orders':
        return 'Keep on posting about your products to attract orders, Buzzybee!'
      default:
        return 'Getting projects starts by making offers, Buzzybee!'
    }
  }

  const loadData = async () => {
    if (sort.value === 'all') {
      await loadAllActivities()
    } else if (sort.value === 'my offers') {
      await loadMyOffers()
    } else if (sort.value === 'my orders') {
      await loadMyOrders()
    } else if (sort.value === 'past') {
      await loadPast()
    }

    setIsLoading(false)
    setIsRefreshing(false)
  }

  const handleLoadMore = () => {
    if (resDataLength >= 10) loadData()
  }

  const loadAllActivities = async () => {
    try {
      const params = {}
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getActivities(params)

      if (!response.success) throw new Error(response.message)

      const newItem = response.data
        .filter(item => !!item)
        .map(item => ({
          post_id: item.post_id,
          orders: [item],
          post: item.post,
        }))

      await Promise.all(
        newItem.map(async item => {
          if (item.post.uid !== userInfo.uid) {
            const response = await Api.getUser({ uid: item.post.uid })

            item.sellerInfo = {
              profile_photo: response.data.profile_photo,
              name: response.data.display_name || response.data.full_name,
            }

            return item
          }
        })
      )

      const currentActivities = []
      newItem.forEach(item => {
        if (
          currentActivities.some(activity => activity.post_id === item.post_id)
        ) {
          currentActivities.forEach(_item => {
            if (_item.post_id === item.post_id) {
              _item.orders.push(item.orders[0])
            }
          })
        } else {
          currentActivities.push(item)
        }
      })

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)
      setActivities(activities => ({
        ...activities,
        ...currentActivities.reduce(
          (items, item) => ({
            ...items,
            [item.post_id]: item,
          }),
          {}
        ),
      }))
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadMyOffers = async () => {
    try {
      const params = {}
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getOwnPosts(params)
      if (!response.success) throw new Error(response.message)

      const newItems = response.data
        .filter(item => !!item)
        .map(item => ({
          post_id: item.id,
          post: item,
          sellerInfo: {
            profile_photo: userInfo.profile_photo,
            name: userInfo.display_name || userInfo.full_name,
          },
        }))

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)
      setActivities(activities => ({
        ...activities,
        ...newItems.reduce(
          (items, item) => ({
            ...items,
            [item.post_id]: item,
          }),
          {}
        ),
      }))
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadMyOrders = async () => {
    try {
      const params = {
        uid: userInfo.uid,
      }
      if (lastId.current) params.lastItemId = lastId.current

      const response = await Api.getOwnOrders(params)
      if (!response.success) throw new Error(response.message)

      const newItem = response.data
        .filter(item => !!item)
        .map(item => ({
          id: item.id,
          post_id: item.post_id,
          orders: [item],
          post: item.post,
        }))

      await Promise.all(
        newItem.map(async item => {
          if (item.post.uid !== userInfo.uid) {
            const response = await Api.getUser({ uid: item.post.uid })

            item.sellerInfo = {
              profile_photo: response.data.profile_photo,
              name: response.data.display_name || response.data.full_name,
            }

            return item
          }
        })
      )

      const currentActivities = []
      newItem.forEach(item => {
        if (
          currentActivities.some(activity => activity.post_id === item.post_id)
        ) {
          currentActivities.forEach(_item => {
            if (_item.post_id === item.post_id) {
              _item.orders.push(item.orders[0])
            }
          })
        } else {
          currentActivities.push(item)
        }
      })

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)
      setActivities(
        currentActivities.reduce(
          (items, item) => ({
            ...items,
            [item.post_id]: item,
          }),
          {}
        )
      )
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

      const newItem = response.data
        .filter(item => !!item)
        .map(item => ({
          id: item.id,
          post_id: item.post_id,
          orders: [item],
          post: item.post,
          sellerInfo: {
            profile_photo: userInfo.profile_photo,
            name: userInfo.display_name || userInfo.full_name,
          },
        }))

      const currentActivities = []
      newItem.forEach(item => {
        if (
          currentActivities.some(activity => activity.post_id === item.post_id)
        ) {
          currentActivities.forEach(_item => {
            if (_item.post_id === item.post_id) {
              _item.orders.push(item.orders[0])
            }
          })
        } else {
          currentActivities.push(item)
        }
      })

      lastId.current = response.data.slice(-1)[0]?.id
      setResDataLength(response.data.length)
      setActivities(
        currentActivities.reduce(
          (items, item) => ({
            ...items,
            [item.post_id]: item,
          }),
          {}
        )
      )
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
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
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
              style={styles.chat}
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'ChatHouse',
                })
              }>
              <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              {!!counts.chat && (
                <View
                  style={{
                    ...styles.notifDot,
                    paddingHorizontal: normalize([counts.chat > 9 ? 2 : 6]),
                  }}>
                  <Text style={styles.countText}>{counts.chat}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chatWrapper}
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'Notifications',
                })
              }>
              <Icons.MegaPhone width={normalize(20)} height={normalize(20)} />
              {!!counts.notification && (
                <View
                  style={{
                    ...styles.notifDot,
                    paddingHorizontal: normalize([
                      counts.notification > 9 ? 2 : 6,
                    ]),
                  }}>
                  <Text style={styles.countText}>{counts.notification}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {!!Object.values(activities).length && (
          <View style={styles.activityWrapper}>
            <FlatList
              data={Object.values(activities)}
              keyExtractor={item => item.post_id}
              renderItem={({ item }) => <ActivitiesCard item={item} />}
              onEndReachedThreshold={0.5}
              onEndReached={handleLoadMore}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  titleColor="#2E3034"
                  tintColor="#2E3034"
                  title="Refreshing"
                  onRefresh={() => setIsRefreshing(true)}
                />
              }
            />
          </View>
        )}

        {!Object.values(activities).length && !isLoading && !isRefreshing && (
          <View style={styles.emptyState}>
            {renderEmptyIcon()}

            <Text style={styles.emptyHeaderText}>
              {renderEmptyHeadingText()}
            </Text>

            <Text style={styles.emptyBodyText}>{renderEmptyBodyText()}</Text>
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
        statusBarTranslucent={true}
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
  chat: {
    marginRight: normalize(25),
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
})

export default Activity
