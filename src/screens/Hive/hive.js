import React from 'react'
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, AppButton, PaddingView } from '@/components'
import { Colors, normalize } from '@/globals'

import IllustHive from '@/assets/images/hive-img1.svg'
import { ScrollView } from 'react-native-gesture-handler'

const Hive = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <IllustHive />
        <AppText
          textStyle="display5"
          customStyle={styles.textStyle}
          color={Colors.primaryMidnightBlue}>
          Create your own Hive soon!
        </AppText>
        <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
          With Hive, you can group your customers and friends to send exclusive
          updates and enjoy easier transactions.
        </AppText>
        <TouchableOpacity
          style={{
            marginTop: normalize(24),
            paddingVertical: 12,
            width: '100%',
            alignItems: 'center',
            backgroundColor: Colors.primaryYellow,
            borderRadius: 3,
            maxWidth: normalize(250),
          }}
          onPress={() => navigation.navigate('dashboard')}>
          <AppText textStyle="body1medium">Go to Dashboard</AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  textStyle: {
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(8),
    paddingHorizontal: normalize(15),
  },
})

export default Hive
