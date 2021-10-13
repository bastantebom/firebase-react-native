import React from 'react'
import IllustHive from '@/assets/images/hive-img1.svg'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation } from '@react-navigation/native'
import StatusBar from '@/components/StatusBar'

const Hive = () => {
  const navigation = useNavigation()

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <IllustHive />
          <View style={styles.content}>
            <Text
              style={[
                typography.display5,
                typography.textCenter,
                { marginTop: normalize(24), color: Colors.primaryMidnightBlue },
              ]}>
              Create your own Hive soon!
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              With Hive, you can group your customers and friends to send
              exclusive updates and enjoy easier transactions.
            </Text>

            <Button
              style={styles.button}
              label="Go to Dashboard"
              type="primary"
              onPress={() => navigation.navigate('dashboard')}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(32),
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: normalize(32),
  },
  button: {
    width: normalize(250),
    marginTop: normalize(24),
  },
})

export default Hive
