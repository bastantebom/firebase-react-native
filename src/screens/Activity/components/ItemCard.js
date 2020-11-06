import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { AppText } from '@/components'
import { GlobalStyle, normalize, Colors } from '@/globals'

import { ProfileImageDefault, Verified } from '@/assets/images/icons'

const ItemCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.userInfoImageContainer}>
            <ProfileImageDefault
              width={normalize(35)}
              height={normalize(35)}
              style={GlobalStyle.image}
            />
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
              <AppText textStyle="metadata">{item.date}</AppText>
              <AppText customStyle={{ marginHorizontal: normalize(5) }}>
                •
              </AppText>
              <AppText textStyle="metadata">{item.time}</AppText>
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
          <AppText textStyle="metadata">{item.timeStamp}</AppText>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: normalize(10),
        }}>
        <AppText textStyle="body2medium">₱{item.amount}</AppText>
        <AppText textStyle="caption" color={Colors.contentPlaceholder}>
          {' '}
          — via{' '}
        </AppText>
        <AppText textStyle="caption2">{item.paymentMode}</AppText>
      </View>
      {item.category == 'Sell' && (
        <AppText textStyle="caption">No. of items: {item.numOfItems}</AppText>
      )}
      {item.category == 'Service' && (
        <AppText textStyle="caption">
          No. of services: {item.numOfService}
        </AppText>
      )}
    </View>
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
