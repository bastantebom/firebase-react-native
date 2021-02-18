import React from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Colors, normalize, timePassedShort } from '@/globals'
import { AppText, MarginView } from '@/components'
import { Icons } from '@/assets/images/icons'
import { commaSeparate } from '@/globals/Utils'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'

const ActivitiesCard = ({ info }) => {
  const navigation = useNavigation()
  const {
    status,
    profilePhoto,
    orders,
    cardType,
    postData,
    orderID,
    payment,
  } = info

  const statusBackground = () => {
    if (cardType === 'own' && status === 'pending')
      return Colors.neutralsMischka
    if (cardType === 'own' && payment !== 'cash') return Colors.neutralsMischka
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'sell'
    )
      return Colors.secondaryDarkTangerine
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      ['service', 'need'].includes(postData.type)
    )
      return Colors.secondaryLavenderBlue
    if (cardType === 'own' && ['delivering', 'pickup'].includes(status))
      return Colors.secondaryDarkTangerine
    if (
      cardType === 'seller' &&
      (orders?.confirmed?.length ||
        orders?.pending?.length ||
        orders?.paid?.length ||
        orders?.delivering?.length ||
        orders?.pickup?.length ||
        !orders?.completed?.length)
    )
      return Colors.secondaryDarkTangerine
    if (['own', 'past'].includes(cardType) && status === 'completed')
      return Colors.secondaryRoyalBlue
    if (
      cardType === 'seller' &&
      !orders?.confirmed?.length &&
      !orders?.pending?.length &&
      !orders?.paid?.length &&
      !orders?.delivering?.length &&
      !orders?.pickup?.length &&
      orders?.completed?.length
    )
      return Colors.secondaryRoyalBlue
    if (['own', 'past'].includes(cardType) && status === 'declined')
      return Colors.red
    if (['own', 'past'].includes(cardType) && status === 'cancelled')
      return Colors.red
    return 'red'
  }

  const getStatusLabel = () => {
    if (cardType === 'own' && status === 'pending')
      return 'Awaiting confirmation'
    if (['own', 'past'].includes(cardType) && status === 'declined')
      return 'Declined'
    if (['own', 'past'].includes(cardType) && status === 'cancelled')
      return 'Cancelled'
    if (cardType === 'own' && status === 'confirmed' && payment !== 'cash')
      return 'Awaiting Payment'
    if (cardType === 'own' && status === 'paid' && payment !== 'cash')
      return 'Payment Processing'
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'sell'
    )
      return 'Ongoing'
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'service'
    )
      return 'Scheduled'
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'need'
    )
      return 'Confirmed'
    if (cardType === 'own' && ['delivering', 'pickup'].includes(status))
      return `Ready for ${status === `pickup` ? `Pickup` : `Delivery`}`
    if (
      cardType === 'seller' &&
      (orders?.confirmed?.length ||
        orders?.pending?.length ||
        orders?.paid?.length ||
        orders?.delivering?.length ||
        orders?.pickup?.length ||
        !orders?.completed?.length)
    )
      return 'Ongoing'

    if (
      cardType === 'seller' &&
      !orders?.confirmed?.length &&
      !orders?.pending?.length &&
      !orders?.paid?.length &&
      !orders?.delivering?.length &&
      !orders?.pickup?.length &&
      orders?.completed?.length
    )
      return 'Completed'
    if (['own', 'past'].includes(cardType) && status === 'completed')
      return 'Completed'
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const getTotalAvailed = () => {
    const confirmed = orders?.confirmed ? orders?.confirmed?.length : 0
    const delivering = orders?.delivering ? orders?.delivering?.length : 0
    const pickup = orders?.pickup ? orders?.pickup?.length : 0
    const completed = orders?.completed ? orders?.completed?.length : 0
    const paid = orders?.paid ? orders?.paid?.length : 0

    return confirmed + delivering + pickup + completed + paid
  }

  const PostIcon = () => {
    return postData?.type === 'sell' ? (
      <Icons.SellPost />
    ) : postData?.type === 'service' ? (
      <Icons.ServicePost />
    ) : (
      <Icons.NeedPost />
    )
  }

  return (
    <>
      <ScrollView>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            cardType === 'seller'
              ? navigation.navigate('NBTScreen', {
                  screen: 'OngoingItem',
                  params: { info },
                })
              : navigation.navigate('orders', {
                  screen: 'order-tracker',
                  params: {
                    post: postData,
                    orderID,
                  },
                })
          }>
          <MarginView
            marginSize={2}
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: info.unread ? '#F2F7FF' : 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.postImageContainer}>
                <PostImage
                  path={postData?.cover_photos?.[0]}
                  size="64x64"
                  postType={postData?.type}
                />
              </View>

              <View style={{ paddingLeft: 12, flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.userInfoImageContainer}>
                    <View style={styles.avatar}>
                      <Avatar
                        style={{ height: '100%', width: '100%' }}
                        path={profilePhoto}
                        size="64x64"
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <AppText
                      textStyle="body3"
                      customStyle={{
                        flex: 1,
                        paddingLeft: 8,
                        paddingRight: 4,
                        fontSize: 12,
                      }}>
                      {info.name}
                    </AppText>
                    <AppText
                      textStyle="captionConstant"
                      color={Colors.contentPlaceholder}>
                      {timeAgo(Date.now() / 1000 - info.time)}
                    </AppText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: statusBackground(),
                      borderRadius: 20,
                      paddingHorizontal: 8,
                      alignSelf: 'flex-start',
                      marginVertical: 8,
                      marginRight: 3,
                    }}>
                    <AppText textStyle="metadata" color={'white'}>
                      {getStatusLabel()}
                    </AppText>
                  </View>
                  {info.date && (
                    <AppText
                      textStyle="metadata"
                      customStyle={{ marginHorizontal: 2 }}>
                      {info.date}
                    </AppText>
                  )}
                  {info.price &&
                    (postData?.type === 'service' ||
                      postData?.type === 'sell') && (
                      <AppText textStyle="metadata">
                        • ₱{commaSeparate(info.price)}
                      </AppText>
                    )}
                  {cardType === 'seller' &&
                    postData?.type !== 'need' &&
                    (orders?.confirmed ||
                      orders?.delivering ||
                      orders?.pickup ||
                      orders?.completed) && (
                      <AppText
                        textStyle="metadata"
                        customStyle={{ marginHorizontal: 2 }}>
                        {getTotalAvailed()} availed
                      </AppText>
                    )}

                  {postData?.type === 'need' && cardType === 'seller' && (
                    <AppText
                      textStyle="metadata"
                      customStyle={{ marginHorizontal: 2 }}>
                      {getTotalAvailed()} offers
                    </AppText>
                  )}
                  {cardType === 'seller' && orders?.pending && (
                    <AppText
                      textStyle="metadata"
                      customStyle={{ marginHorizontal: 2 }}>
                      {orders?.pending?.length} pending request
                    </AppText>
                  )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <PostIcon />
                  <AppText
                    textStyle="caption2"
                    numberOfLines={1}
                    customStyle={{ marginLeft: normalize(4) }}>
                    {postData?.title}
                  </AppText>
                </View>
                {info.reply && (
                  <AppText textStyle="caption" numberOfLines={1}>
                    {info.reply}
                  </AppText>
                )}
              </View>
            </View>
          </MarginView>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  avatar: {
    height: normalize(20),
    width: normalize(20),
  },
  postImageContainer: {
    width: normalize(64),
    height: normalize(72),
    borderRadius: 8,
    overflow: 'hidden',
  },
  userInfoImageContainer: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(20 / 2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutralsZirconLight,
  },
})

export default ActivitiesCard
