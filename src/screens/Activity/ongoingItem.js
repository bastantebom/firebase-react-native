import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { normalize, Colors } from '@/globals'
import { ScreenHeaderTitle } from '@/components'
import { Icons, ChevronDown, ChevronUp, PostClock } from '@/assets/images/icons'

import ActivitiesCard from './components/card'
import ItemCard from '@/screens/Activity/components/item-card'
import Api from '@/services/Api'
import typography from '@/globals/typography'
import StatusBar from '@/components/StatusBar'

const OngoingItem = ({ route, navigation }) => {
  const { activity } = route.params
  const [item, setItem] = useState()
  const [chats, setChats] = useState({})

  const [accordion, setAccordion] = useState({
    awatingPayments: false,
    requests: false,
    ongoing: false,
  })

  const loadOrders = async () => {
    try {
      const result = await Api.getOrders({
        uid: activity.post.uid,
        pid: activity.post.id,
      })

      if (!result.success) throw new Error(result.message)

      setItem(result.data)
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  const handleAccordionOnLoad = () => {
    if (
      item?.some(
        order => order.status === 'confirmed' && order.payment_method !== 'cash'
      )
    )
      setAccordion({ ...accordion, awatingPayments: true })
    else if (
      item?.some(
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
      item?.forEach(async order => {
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
      console.log(error)
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
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView>
        <View style={styles.headerWrapper}>
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title={activity.post.title}
            customTitleStyle={styles.headerText}
            paddingSize={2}
            rightIcon={
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NBTScreen', {
                    screen: 'PostChat',
                    params: { post: activity.post },
                  })
                }>
                <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              </TouchableOpacity>
            }
          />
          <ActivitiesCard item={activity} />
        </View>

        {item?.some(
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
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { marginLeft: normalize(10) },
                  ]}>
                  Awaiting Payment
                </Text>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryBrinkPink,
                  }}>
                  <Text
                    style={[
                      typography.metadata,
                      { color: Colors.neutralsWhite },
                    ]}>
                    {
                      item?.filter(
                        order =>
                          order.status === 'confirmed' &&
                          order.payment_method !== 'cash'
                      ).length
                    }
                  </Text>
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
                items={item?.filter(
                  order =>
                    order.status === 'confirmed' &&
                    order.payment_method !== 'cash'
                )}
              />
            )}
          </View>
        )}

        {item?.some(
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
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { marginLeft: normalize(10) },
                  ]}>
                  Requests
                </Text>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryDarkTangerine,
                  }}>
                  <Text
                    style={[
                      typography.metadata,
                      { color: Colors.neutralsWhite },
                    ]}>
                    {
                      item?.filter(
                        order =>
                          order.status === 'pending' ||
                          (order.status === 'confirmed' &&
                            order.payment_method === 'cash')
                      ).length
                    }
                  </Text>
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
                items={item?.filter(
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

        {item?.some(
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
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { marginLeft: normalize(10) },
                  ]}
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Ongoing
                </Text>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryShamrock,
                  }}>
                  <Text
                    style={[
                      typography.metadata,
                      { color: Colors.neutralsWhite },
                    ]}>
                    {
                      item?.filter(
                        order =>
                          order.status === 'paid' ||
                          order.status === 'delivering' ||
                          order.status === 'pickup' ||
                          order.status === 'payment processing'
                      ).length
                    }
                  </Text>
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
                items={item?.filter(
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

      {item?.some(
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
          <Text style={[typography.body2, styles.pastText]}>Past Orders</Text>
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
