import React from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, ScreenHeaderTitle } from '@/components'
import IllustHive from '@/assets/images/hive-img1.svg'
import { normalize } from '@/globals'

const Welcome = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
      <View style={styles.contentWrapper}>
        <IllustHive />
        <AppText textStyle="display5">Welcome to Servbees</AppText>
        <AppText textStyle="body2">
          Get busy connecting with Buzzybees in your community, selling
          products, offering your services, and scoring sweet deals. Start with
          your first post today!
        </AppText>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', padding: 24 }}>
        <TouchableOpacity
          style={{
            marginTop: normalize(20),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(60),
            alignItems: 'center',
            backgroundColor: '#FFD400',
            borderRadius: 3,
          }}
          onPress={() => {
            navigation.navigate('dashboard')
          }}>
          <AppText textStyle="button2">Explore Postings Near You</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Welcome
