import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { formatNumber } from 'react-native-currency-input'
import { useNavigation } from '@react-navigation/native'

import moment from 'moment'

import { UserContext } from '@/context/UserContext'
import { ChatBlue } from '@/assets/images/icons'
import { normalize, Colors, timePassedShort } from '@/globals'
import { AppText } from '@/components'

import Avatar from '@/components/Avatar/avatar'

const ItemCard = ({ items, chats }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()

  const getItemQuantity = order => {
    if (order.offer) return 1

    return order?.items?.length
  }

  const getTimeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const getPaymentMethod = paymentMethod => {
    switch (paymentMethod) {
      case 'cash':
        return 'COD'
      case 'card':
        return 'Visa / Mastercard'
      case 'gcash':
        return 'GCash'
      case 'grabpay':
        return 'GrabPay'
      case 'paypal':
        return 'Paypal'
    }
  }

  const getTotalAmount = order => {
    let totalAmount = 0

    if (order.offer) return order.offer

    order?.items?.forEach(item => (totalAmount += parseInt(item.price)))

    return totalAmount
  }

  return (
    <>
      {items.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('orders', {
                screen: 'order-tracker',
                params: {
                  orderID: item?.order_id || item?.id,
                },
              })
            }>
            <View style={styles.userDetailsWrapper}>
              <View style={styles.userDetails}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    style={styles.avatar}
                    path={item?.user?.profile_photo}
                    size="64x64"
                  />
                </View>
                <View style={styles.userTextWrapper}>
                  <AppText textStyle="caption2" customStyle={styles.userName}>
                    {item?.user?.name || 'N/A'}
                  </AppText>
                  <AppText textStyle="metadata" customStyle={styles.orderDate}>
                    {moment
                      .unix(item.date._seconds)
                      .format('MMMM D, YYYY • h:mmA')}
                  </AppText>
                </View>
              </View>
              <AppText textStyle="metadata">
                {getTimeAgo(Date.now() / 1000 - item.date._seconds)}
              </AppText>
            </View>

            <View style={styles.paymentDetails}>
              <AppText
                textStyle="body2medium"
                customStyle={styles.paymentFontSize}>
                ₱
                {formatNumber(item.total_price || getTotalAmount(item), {
                  separator: '.',
                  precision: 2,
                  delimiter: ',',
                })}
              </AppText>
              <AppText
                textStyle="caption"
                color={Colors.contentPlaceholder}
                customStyle={styles.paymentFontSize}>
                {` — via `}
              </AppText>
              <AppText
                textStyle="caption2"
                customStyle={{
                  ...styles.paymentFontSize,
                  textTransform: 'capitalize',
                }}>
                {getPaymentMethod(item.payment_method)}
              </AppText>
            </View>

            <AppText textStyle="caption">
              No. of items: {getItemQuantity(item)}
            </AppText>
          </TouchableOpacity>

          {!!chats?.[item.id]?.data?.length && (
            <TouchableOpacity
              style={styles.chatTextWrapper}
              onPress={() =>
                navigation.navigate('Chat', {
                  user,
                  channel: chats[item.id]?.chatRoom[0],
                })
              }>
              <View style={styles.chatCountWrapper}>
                <ChatBlue />
                <AppText
                  textStyle="caption"
                  color={Colors.contentOcean}
                  customStyle={{ marginLeft: normalize(6) }}>
                  {chats[item.id]?.data?.length} new messages
                </AppText>
              </View>
              <View style={styles.chatText}>
                <AppText
                  textStyle="caption2"
                  customStyle={{ width: '80%' }}
                  numberOfLines={1}>
                  {chats[item.id]?.data[0]?.text}
                </AppText>
                <AppText textStyle="metadata" color={Colors.contentPlaceholder}>
                  {getTimeAgo(
                    Date.now() / 1000 -
                      chats[item.id]?.data[0]?.created_at?._seconds
                  )}
                </AppText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: normalize(10),
    marginVertical: normalize(10),
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: normalize(8),
  },
  avatar: {
    height: normalize(35),
    width: normalize(35),
  },
  avatarWrapper: {
    height: normalize(35),
    width: normalize(35),
    marginRight: normalize(10),
    borderRadius: normalize(100),
    overflow: 'hidden',
  },
  userDetailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  userDetails: {
    flexDirection: 'row',
  },
  userTextWrapper: {
    justifyContent: 'space-evenly',
  },
  userName: {
    marginRight: normalize(5),
    fontSize: normalize(14),
  },
  orderDate: {
    fontSize: normalize(12),
  },
  badge: {
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(12),
    height: normalize(20),
    borderRadius: 22,
    backgroundColor: '#DCF7F1',
  },
  paymentDetails: {
    flexDirection: 'row',
    marginBottom: normalize(10),
  },
  paymentFontSize: {
    fontSize: normalize(14),
  },
  chatTextWrapper: {
    backgroundColor: Colors.secondarySolitude,
    borderRadius: 4,
    padding: normalize(8),
    marginTop: normalize(8),
  },
  chatCountWrapper: {
    flexDirection: 'row',
    marginBottom: normalize(7),
  },
  chatText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default ItemCard
