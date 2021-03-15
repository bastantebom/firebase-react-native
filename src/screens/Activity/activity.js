import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import Modal from 'react-native-modal'

import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'

import { Colors, normalize } from '@/globals'
import { AppText, TransitionIndicator } from '@/components'
import ActivitySort from './components/ActivitySort'
import Ongoing from './components/Ongoing'
import { Icons } from '@/assets/images/icons'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Activity'>} param0 */
const activity = ({ navigation }) => {
  const { user, userInfo } = useContext(UserContext)

  const [activitySort, setActivitySort] = useState(false)
  const [sort, setSort] = useState({
    label: 'All Activities',
    value: 'all',
    description: 'These are all your activities',
  })
  const [activities, setActivities] = useState([])
  const [lastItemId, setLastItemId] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isRereshing, setIsRereshing] = useState(false)
  const [noMoreActivities, setNoMoreActivities] = useState(false)

  const loadActivities = async ({ isMoreActivities, lastItemId }) => {
    try {
      if (sort.value === 'all') {
        const { data } = await Api.getActivities({ lastItemId })

        if (!data.length) setNoMoreActivities(true)
        else setLastItemId(data[data.length - 1].id)

        groupActivities(isMoreActivities, data)
      } else if (sort.value === 'my offers') {
        const { data } = await Api.getOwnPosts({ lastItemId })

        if (!data.length) setNoMoreActivities(true)

        const groupedData = data
          .map(post => {
            return {
              post: { ...post },
              sellerInfo: {
                profile_photo: userInfo.profile_photo,
                name: userInfo.display_name || userInfo.full_name,
              },
            }
          })
          .sort(
            (a, b) => b.post.date_posted._seconds - a.post.date_posted._seconds
          )

        if (!!data.length) setLastItemId(data[data.length - 1].id)

        setActivities(
          isMoreActivities ? [...activities, ...groupedData] : groupedData
        )
      } else if (sort.value === 'my orders') {
        const { data } = await Api.getOwnOrders({
          lastItemId,
          uid: user.uid,
        })

        if (!data.length) setNoMoreActivities(true)
        else setLastItemId(data[data.length - 1].id)

        groupActivities(isMoreActivities, data)
      } else if (sort.value === 'past') {
        const { data } = await Api.getPastActivities({ lastItemId })

        if (!data.length) setNoMoreActivities(true)
        else setLastItemId(data[data.length - 1].id)

        groupActivities(isMoreActivities, data)
      }
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }

    setIsLoading(false)
    setIsRereshing(false)
  }

  useEffect(() => {
    setNoMoreActivities(false)
    setIsLoading(true)
    loadActivities({ isMoreActivities: false })
  }, [sort])

  useEffect(() => {
    setNoMoreActivities(false)
    if (isRereshing) loadActivities({ isMoreActivities: false })
  }, [isRereshing])

  const loadMoreActivities = () => {
    if (noMoreActivities) return

    loadActivities({ isMoreActivities: true, lastItemId })
  }

  const groupActivities = (isMoreActivities, data) => {
    const groupedData = []
    data.forEach(order => {
      if (!groupedData.some(data => data.post.post_id === order.post_id)) {
        const currentActivity = {
          post: order.post,
          sellerInfo: {
            profile_photo: userInfo.profile_photo,
            name: userInfo.display_name || userInfo.full_name,
          },
        }

        delete order.post

        currentActivity.orders = [order]
        groupedData.push(currentActivity)
      } else {
        delete order.post

        groupedData.forEach(data => {
          if (data.post.post_id === order.post_id) {
            data.orders.push(order)

            return
          }
        })
      }
    })

    setActivities(
      isMoreActivities
        ? [
            ...activities,
            ...groupedData.sort(
              (a, b) =>
                b.post.date_posted._seconds - a.post.date_posted._seconds
            ),
          ]
        : groupedData.sort(
            (a, b) => b.post.date_posted._seconds - a.post.date_posted._seconds
          )
    )
  }

  return (
    <>
      <TransitionIndicator loading={isLoading} />
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.sortWrapper}
            onPress={() => setActivitySort(true)}>
            <AppText textStyle="body3" customStyle={styles.sortText}>
              {sort.label}
            </AppText>
            <Icons.ChevronDown
              style={{ color: 'black' }}
              width={normalize(24)}
              height={normalize(24)}
            />
          </TouchableOpacity>

          <View style={styles.iconsWrapper}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'ChatHouse',
                })
              }>
              <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              {/* {chatList.some(chat => !chat.read) && (
            <View
              style={{
                ...styles.notifDot,
                paddingHorizontal: normalize([
                  chatList.filter(chat => !chat.read).length > 9 ? 2 : 6,
                ]),
              }}>
              <AppText textStyle="eyebrow1" color={Colors.neutralsWhite}>
                {chatList.filter(chat => !chat.read).length}
              </AppText>
            </View>
          )} */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chatWrapper}
              onPress={() =>
                navigation.navigate('NBTScreen', {
                  screen: 'Notifications',
                })
              }>
              <Icons.MegaPhone width={normalize(20)} height={normalize(20)} />
              {!!userInfo.notification_count && (
                <View
                  style={{
                    ...styles.notifDot,
                    paddingHorizontal: normalize([
                      userInfo.notification_count > 9 ? 2 : 6,
                    ]),
                  }}>
                  <AppText textStyle="eyebrow1" color={Colors.neutralsWhite}>
                    {userInfo.notification_count}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Ongoing
            activities={activities}
            sort={sort}
            isLoading={isLoading}
            isRereshing={isRereshing}
            setIsRereshing={setIsRereshing}
            loadMoreActivities={loadMoreActivities}
            noMoreActivities={noMoreActivities}
          />
        </View>
      </SafeAreaView>

      <Modal
        isVisible={activitySort}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        onSwipeComplete={() => setActivitySort(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setActivitySort(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setActivitySort(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ActivitySort close={() => setActivitySort(false)} setSort={setSort} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(50),
    backgroundColor: 'white',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    width: '100%',
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    marginRight: normalize(8),
  },
  iconsWrapper: {
    flexDirection: 'row',
  },
  chatWrapper: {
    marginLeft: normalize(25),
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
})

export default activity
