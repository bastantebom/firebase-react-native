import React, { useState, useEffect, useContext } from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { normalize, Colors } from '@/globals'
import { AppText, ScreenHeaderTitle } from '@/components'
import { Icons, ChevronDown, ChevronUp, PostClock } from '@/assets/images/icons'

import { UserContext } from '@/context/UserContext'
import ActivitiesCard from './components/card'
import ItemCard from '@/screens/Activity/components/item-card'
import Api from '@/services/Api'

const OngoingItem = ({ route, navigation }) => {
  const { item: currentItem } = route.params
  const { user } = useContext(UserContext)

  const [accordion, setAccordion] = useState({
    awatingPayments: false,
    requests: false,
    ongoing: false,
  })
  const [chats, setChats] = useState({})
  const [item, setItem] = useState(currentItem)

  const handleAccordionOnLoad = () => {
    if (
      item.orders.some(
        order => order.status === 'confirmed' && order.payment_method !== 'cash'
      )
    )
      setAccordion({ ...accordion, awatingPayments: true })
    else if (
      item.orders.some(
        order =>
          order.status === 'pending' ||
          (order.status === 'confirmed' && order.payment_method === 'cash')
      )
    )
      setAccordion({ ...accordion, requests: true })
    else setAccordion({ ...accordion, ongoing: true })
  }

  const getChatData = async () => {
    try {
      item.orders.forEach(async order => {
        const response = await Api.getLatestOrderChat({
          uid: order.buyer_id || order.user.uid,
        })

        if (!response.success) throw new Error(response.message)

        setChats(chats => ({
          ...chats,
          [order.id]: {
            chatRoom: response.chat_room,
            data: response.data,
          },
        }))
      })
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const loadOrders = async () => {
    try {
      const response = await Api.getOrders({
        uid: user.uid,
        pid: item.post.id,
      })

      if (!response.success) throw new Error(response.message)

      setItem({
        ...currentItem,
        orders: response.data,
      })
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  useEffect(() => {
    loadOrders()
    getChatData()
  }, [])

  useEffect(() => {
    handleAccordionOnLoad()
  }, [item])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <ScrollView>
        <View style={styles.headerWrapper}>
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title={item?.post?.title}
            customTitleStyle={styles.headerText}
            paddingSize={2}
            rightIcon={
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NBTScreen', {
                    screen: 'PostChat',
                    params: { post: item.post },
                  })
                }>
                <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              </TouchableOpacity>
            }
          />
          <ActivitiesCard item={item} />
        </View>

        {item?.orders?.some(
          order =>
            order.status === 'confirmed' && order.payment_method !== 'cash'
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  awatingPayments: !accordion.awatingPayments,
                })
              }>
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
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryBrinkPink,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item?.orders?.filter(
                        order =>
                          order.status === 'confirmed' &&
                          order.payment_method !== 'cash'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.awatingPayments ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.awatingPayments && (
              <ItemCard
                items={item?.orders?.filter(
                  order =>
                    order.status === 'confirmed' &&
                    order.payment_method !== 'cash'
                )}
              />
            )}
          </View>
        )}

        {item?.orders?.some(
          order =>
            order.status === 'pending' ||
            (order.status === 'confirmed' && order.payment_method === 'cash')
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  requests: !accordion.requests,
                })
              }>
              <View style={styles.iconText}>
                <Icons.ChatGray />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Requests
                </AppText>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryDarkTangerine,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item?.orders?.filter(
                        order =>
                          order.status === 'pending' ||
                          (order.status === 'confirmed' &&
                            order.payment_method === 'cash')
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.requests ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.requests && (
              <ItemCard
                items={item?.orders?.filter(
                  order =>
                    order.status === 'pending' ||
                    (order.status === 'confirmed' &&
                      order.payment_method === 'cash')
                )}
                chats={chats}
              />
            )}
          </View>
        )}

        {item?.orders?.some(
          order =>
            order.status === 'paid' ||
            order.status === 'delivering' ||
            order.status === 'pickup' ||
            order.status === 'payment processing'
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  ongoing: !accordion.ongoing,
                })
              }>
              <View style={styles.iconText}>
                <PostClock />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Ongoing
                </AppText>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryShamrock,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item?.orders?.filter(
                        order =>
                          order.status === 'paid' ||
                          order.status === 'delivering' ||
                          order.status === 'pickup' ||
                          order.status === 'payment processing'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.ongoing ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.ongoing && (
              <ItemCard
                items={item?.orders?.filter(
                  order =>
                    order.status === 'paid' ||
                    order.status === 'delivering' ||
                    order.status === 'pickup' ||
                    order.status === 'payment processing'
                )}
              />
            )}
          </View>
        )}
      </ScrollView>

      {item?.orders?.some(
        order =>
          order.status === 'completed' ||
          order.status === 'cancelled' ||
          order.status === 'declined'
      ) && (
        <TouchableOpacity
          style={styles.pastWrapper}
          onPress={() => {
            navigation.navigate('NBTScreen', {
              screen: 'Past',
              params: {
                item: item,
              },
            })
          }}>
          <AppText customStyle={styles.pastText}>Past Orders</AppText>
        </TouchableOpacity>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: normalize(15),
    borderBottomRightRadius: normalize(15),
    paddingBottom: normalize(15),
    marginTop: getStatusBarHeight(),
  },
  headerText: {
    textTransform: 'none',
    maxWidth: '75%',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: normalize(15),
    marginTop: normalize(10),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(15),
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    borderRadius: normalize(100),
    marginLeft: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(18),
    height: normalize(18),
  },
  pastWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: normalize(25),
    paddingVertical: normalize(15),
  },
  pastText: {
    color: Colors.contentOcean,
  },
})

export default OngoingItem
