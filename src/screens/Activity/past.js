import React from 'react'
import { SafeAreaView, View, StyleSheet, ScrollView } from 'react-native'

import ItemCard from '@/screens/Activity/components/item-card'

import { ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'

const Past = ({ route, navigation }) => {
  const { item } = route.params

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerWrapper}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          title={'Past Orders'}
          customTitleStyle={styles.headerText}
          paddingSize={2}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <ItemCard
          items={item.filter(
            order =>
              order.status === 'completed' ||
              order.status === 'declined' ||
              order.status === 'cancelled'
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: normalize(20),
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: normalize(15),
  },
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: normalize(15),
    borderBottomRightRadius: normalize(15),
    paddingBottom: normalize(15),
  },
  headerText: {
    textTransform: 'none',
    maxWidth: '75%',
  },
})

export default Past
