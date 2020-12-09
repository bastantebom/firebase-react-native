import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Colors, GlobalStyle, normalize, timePassedShort } from '@/globals'
import { AppText, MarginView, CacheableImage } from '@/components'
import { ProfileImageDefault } from '@/assets/images/icons'
import { DefaultSell, DefaultService, DefaultNeed } from '@/assets/images'
import Modal from 'react-native-modal'
import TrackerModal from '@/screens/Post/components/forms/modals/TrackerModal'

const ActivitiesCard = ({ info }) => {
  const navigation = useNavigation()
  const { status, time, profilePhoto, orders, name, cardType, postData } = info
  const [trackerModal, showTrackerModal] = useState(false)

  const statusBackground = () => {
    if (cardType === 'own' && status === 'pending')
      return Colors.neutralsMischka
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'sell'
    )
      return Colors.secondaryDarkTangerine
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'service'
    )
      return Colors.secondaryLavenderBlue
    if (cardType === 'own' && status === 'delivering')
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
    if (cardType === 'own' && status === 'completed')
      return Colors.secondaryShamrock
    if (
      cardType === 'seller' &&
      !orders?.confirmed?.length &&
      !orders?.pending?.length &&
      !orders?.paid?.length &&
      !orders?.delivering?.length &&
      !orders?.pickup?.length &&
      orders?.completed?.length
    )
      return Colors.secondaryShamrock
    if (cardType === 'own' && status === 'declined') return Colors.red
    if (cardType === 'own' && status === 'cancelled') return Colors.red
    return 'red'
  }

  const getStatusLabel = () => {
    if (cardType === 'own' && status === 'pending')
      return 'Waiting for confirmation'
    if (cardType === 'own' && status === 'declined') return 'Declined'
    if (cardType === 'own' && status === 'cancelled') return 'Cancelled'
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'sell'
    )
      return 'Processing'
    if (
      cardType === 'own' &&
      status === 'confirmed' &&
      postData.type === 'service'
    )
      return 'Confirmed'
    if (cardType === 'own' && status === 'delivering')
      return 'Ready for Delivery'
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
    if (cardType === 'own' && status === 'completed') return 'Completed'
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const AvatarPhoto = ({ size }) => {
    return profilePhoto ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: profilePhoto,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const getTotalAvailed = () => {
    const confirmed = orders?.confirmed ? orders?.confirmed?.length : 0
    const delivering = orders?.delivering ? orders?.delivering?.length : 0
    const pickup = orders?.pickup ? orders?.pickup?.length : 0
    const completed = orders?.completed ? orders?.completed?.length : 0
    const paid = orders?.paid ? orders?.paid?.length : 0

    return confirmed + delivering + pickup + completed + paid
  }

  const CoverPhoto = () => {
    return postData?.cover_photos?.length > 0 ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{ uri: postData?.cover_photos[0] }}
      />
    ) : postData?.type === 'service' ? (
      <DefaultService width={normalize(64)} height={normalize(72)} />
    ) : postData?.type === 'need' ? (
      <DefaultNeed width={normalize(64)} height={normalize(72)} />
    ) : (
      <DefaultSell width={normalize(64)} height={normalize(72)} />
    )
  }

  return (
    <>
      <ScrollView>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            cardType === 'seller'
              ? navigation.navigate('OngoingItem', { info })
              : showTrackerModal(true)
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
                <CoverPhoto />
              </View>

              <View style={{ paddingLeft: 12, flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.userInfoImageContainer}>
                    <AvatarPhoto size={20} />
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
                        • ₱{info.price.toLocaleString()}
                      </AppText>
                    )}
                  {cardType === 'seller' &&
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
                      {orders?.pending?.length} offers
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
                <AppText textStyle="caption2" numberOfLines={1}>
                  {postData?.title}
                </AppText>
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
      <Modal
        isVisible={trackerModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <TrackerModal
          closeModal={() => showTrackerModal(false)}
          postType={postData?.type}
          orderID={info.orderID}
          postData={postData}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
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
  },
})

export default ActivitiesCard
