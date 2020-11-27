import React from 'react'
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { normalize } from '@/globals'

import IllustHive from '@/assets/images/hive-img1.svg'

const Hive = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <IllustHive />
      <AppText
        textStyle="body1"
        customStyle={{ textAlign: 'center', marginTop: normalize(10) }}>
        Under Construction
      </AppText>
      <TouchableOpacity
        style={{
          marginTop: 40,
          paddingVertical: 12,
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#FFD400',
          borderRadius: 3,
        }}
        onPress={() => navigation.navigate('dashboard')}>
        <AppText textStyle="button2">Go to Dashboard</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
})

export default Hive
