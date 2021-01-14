import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { AppText, CacheableImage, TransitionIndicator } from '@/components'
import Api from '@/services/Api'
import {
  GlobalStyle,
  normalize,
  Colors,
  fullDateFormat,
  timeOnly,
  timePassedShort,
} from '@/globals'

import { ChatBlue, ProfileImageDefault, Verified } from '@/assets/images/icons'
import { useNavigation } from '@react-navigation/native'
import { commaSeparate } from '@/globals/Utils'

const ItemCard = ({ item }) => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const AvatarPhoto = ({ size }) => {
    return item.profilePhoto ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: item.profilePhoto,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const getPostDetails = async () => {
    if (!item.postId) return
    setIsLoading(true)

    try {
      const response = await Api.getPost({ pid: item.postId })
      if (!response.success) throw new Error(response.message)

      navigation.navigate('orders', {
        screen: 'order-tracker',
        params: {
          post: response.data,
          orderID: item.orderID,
        },
      })
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong')
    }
    setIsLoading(false)
  }
  return (
    <>
      <TransitionIndicator loading={isLoading} />
      <TouchableOpacity activeOpacity={0.7} onPress={() => getPostDetails()}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.userInfoImageContainer}>
                <AvatarPhoto size={35} />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppText
                    textStyle="caption2"
                    customStyle={{ marginRight: normalize(5) }}>
                    {item.customer}
                  </AppText>
                  {item.verified && (
                    <Verified width={normalize(12)} height={normalize(12)} />
                  )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <AppText textStyle="metadata">
                    {fullDateFormat(item.timeStamp * 1000)}
                  </AppText>
                  <AppText customStyle={{ marginHorizontal: normalize(5) }}>
                    •
                  </AppText>
                  <AppText textStyle="metadata">
                    {timeOnly(item.timeStamp * 1000)}
                  </AppText>
                </View>
              </View>
            </View>
            {item.new ? (
              <View style={styles.badge}>
                <AppText
                  textStyle="metadata"
                  color={Colors.secondaryMountainMeadow}>
                  New
                </AppText>
              </View>
            ) : (
              <AppText textStyle="metadata">
                {timeAgo(Date.now() / 1000 - item.timeStamp)}
              </AppText>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: normalize(10),
            }}>
            <AppText textStyle="body2medium">
              ₱{commaSeparate(item.amount)}
            </AppText>
            {item.type !== 'need' && (
              <>
                <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                  {' '}
                  — via{' '}
                </AppText>
                <AppText
                  textStyle="caption2"
                  customStyle={{ textTransform: 'capitalize' }}>
                  {item.paymentMode}
                </AppText>
              </>
            )}
          </View>
          {item.type === 'sell' && (
            <AppText textStyle="caption">
              No. of items: {item.numOfItems}
            </AppText>
          )}
          {item.type === 'service' && (
            <AppText textStyle="caption">
              No. of services: {item.numOfItems}
            </AppText>
          )}
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: Colors.secondarySolitude,
                borderRadius: 4,
                padding: normalize(8),
                marginTop: normalize(8),
              }}>
              <View style={{ flexDirection: 'row' }}>
                <ChatBlue />
                <AppText
                  textStyle="caption"
                  color={Colors.contentOcean}
                  customStyle={{ marginLeft: normalize(6) }}>
                  sent you a message
                </AppText>
              </View>
              <View
                style={{
                  marginTop: normalize(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText
                  textStyle="caption2"
                  customStyle={{ width: '90%' }}
                  numberOfLines={1}>
                  Message here
                </AppText>
                <AppText textStyle="metadata" color={Colors.contentPlaceholder}>
                  1s
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: normalize(10),
    marginVertical: normalize(10),
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
  },
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
    marginRight: normalize(10),
  },
  badge: {
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(12),
    borderRadius: 22,
    backgroundColor: '#DCF7F1',
  },
})

export default ItemCard
