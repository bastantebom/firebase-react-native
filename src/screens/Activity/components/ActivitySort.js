import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
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
      <View style={{ alignItems: 'center', paddingBottom: normalize(35) }}>
        <View style={styles.bottomSheetHeader} />
      </View>
      <AppText textStyle="body2" color={Colors.contentPlaceholder}>
        View by
      </AppText>

      {choices.map((option, i) => {
        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignContent: 'flex-start',
              paddingVertical: normalize(16),
            }}>
            <View>{option.icon}</View>
            <TouchableOpacity
              style={{ marginLeft: normalize(12) }}
              onPress={() => onSortSelect(option)}>
              <AppText
                textStyle="body1medium"
                customStyle={{ paddingBottom: normalize(4.5) }}>
                {option.label}
              </AppText>
              <AppText textStyle="body2">{option.description}</AppText>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: normalize(20),
  },
  bottomSheetHeader: {
    backgroundColor: '#EAEAEA',
    height: normalize(5),
    width: normalize(40),
  },
})

export default ActivitySort
