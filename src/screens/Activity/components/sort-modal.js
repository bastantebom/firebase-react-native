import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'

import { AppText } from '@/components'
import { normalize, Colors } from '@/globals'
import { Icons } from '@/assets/images/icons'

const ActivitySort = ({ setSort, close }) => {
  const choices = [
    {
      label: 'All Activities',
      value: 'all',
      description: 'Offers, orders, and past transactions in one place',
      icon: <Icons.AllActivities />,
    },
    {
      label: 'My Offers',
      value: 'my offers',
      description:
        'Keep track of your posts, items for sale, and services offered',
      icon: <Icons.MyOffers />,
    },
    {
      label: 'My Orders',
      value: 'my orders',
      description: "Check for updates on items and services you've availed",
      icon: <Icons.MyOrders />,
    },
    {
      label: 'Past',
      value: 'past',
      description: 'Review all completed, cancelled, and declined transactions',
      icon: <Icons.Past />,
    },
  ]

  const onSortSelect = item => {
    setSort(item)
    close()
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          paddingTop: normalize(10),
          paddingBottom: normalize(35),
        }}>
        <View style={styles.bottomSheetHeader} />
      </View>
      <AppText
        textStyle="body2"
        customStyle={{
          paddingVertical: normalize(10),
          paddingHorizontal: normalize(25),
        }}
        color={Colors.contentPlaceholder}>
        View by
      </AppText>

      {choices.map(option => {
        return (
          <View
            key={option.value}
            style={{
              paddingHorizontal: normalize(25),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingVertical: normalize(16),
              }}
              onPress={() => onSortSelect(option)}>
              <View
                style={{ marginRight: normalize(10), marginTop: normalize(4) }}>
                {option.icon}
              </View>
              <View style={{ paddingRight: normalize(20) }}>
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginBottom: normalize(4.5) }}>
                  {option.label}
                </AppText>
                <AppText textStyle="body2" customStyle={{ color: '#515057' }}>
                  {option.description}
                </AppText>
              </View>
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: normalize(20),
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetHeader: {
    backgroundColor: '#EAEAEA',
    height: normalize(5),
    width: normalize(40),
  },
  divider: {
    width: '100%',
    backgroundColor: Colors.neutralsZircon,
  },
})

export default ActivitySort
