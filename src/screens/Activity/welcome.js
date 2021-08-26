import React from 'react'
import {
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { ScreenHeaderTitle } from '@/components'
import IllustHive from '@/assets/images/hive-img1.svg'
import { normalize } from '@/globals'
import typography from '@/globals/typography'

const Welcome = () => {
  const navigation = useNavigation()

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
        <View style={styles.contentWrapper}>
          <IllustHive />
          <Text style={typography.display5}>Welcome to Servbees, Busybee</Text>
          <Text style={typography.body2}>
            Create your first post today to get buzy hustling. Sell a product,
            offer a service, look for sweet deals, or even just connect with
            other buzybees. Have fun!
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('dashboard')
            }}>
            <Text style={typography.button2}>Explore Postings Near You</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: 'white',
  },
  contentWrapper: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  button: {
    alignItems: 'center',
    marginTop: normalize(20),
    paddingVertical: normalize(10),
    backgroundColor: '#FFD400',
    borderRadius: 3,
  },
})

export default Welcome
