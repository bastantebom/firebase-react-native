import React from 'react'
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native'

import { AppText } from '@/components'

import { normalize, Colors } from '@/globals'

const ActivitySort = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: normalize(20),
      }}>
      <View style={{ alignItems: 'center', paddingBottom: normalize(35) }}>
        <View
          style={{
            backgroundColor: '#EAEAEA',
            height: normalize(5),
            width: normalize(40),
          }}
        />
      </View>
      <AppText textStyle="body2" color={Colors.contentPlaceholder}>
        View by
      </AppText>

      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.neutralsGainsboro,
        }}>
        <TouchableOpacity style={{ paddingVertical: normalize(16) }}>
          <AppText
            textStyle="body1medium"
            customStyle={{ paddingBottom: normalize(4.5) }}>
            All Activities
          </AppText>
          <AppText textStyle="body2">These are all your activities</AppText>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.neutralsGainsboro,
        }}>
        <TouchableOpacity style={{ paddingVertical: normalize(16) }}>
          <AppText
            textStyle="body1medium"
            customStyle={{ paddingBottom: normalize(4.5) }}>
            My Offers
          </AppText>
          <AppText textStyle="body2">See your offers</AppText>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.neutralsGainsboro,
        }}>
        <TouchableOpacity style={{ paddingVertical: normalize(16) }}>
          <AppText
            textStyle="body1medium"
            customStyle={{ paddingBottom: normalize(4.5) }}>
            My orders
          </AppText>
          <AppText textStyle="body2">Your orders</AppText>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={{ paddingVertical: normalize(16) }}>
          <AppText
            textStyle="body1medium"
            customStyle={{ paddingBottom: normalize(4.5) }}>
            Past
          </AppText>
          <AppText textStyle="body2">Something, something</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ActivitySort
