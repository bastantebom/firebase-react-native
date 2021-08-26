import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { WelcomeNotif, PostClock } from '@/assets/images/icons'
import { normalize, timePassedShort } from '@/globals'

import { AppText } from '@/components'

const Welcome = ({ item, unreadNotification }) => {
  const navigation = useNavigation()

  const timeAgo = time => timePassedShort(time)

  const handlePress = () => {
    if (!item.read) unreadNotification(item.id)

    navigation.navigate('NBTScreen', {
      screen: 'Welcome',
      params: {
        screen: 'WelcomeScreen',
        params: { item },
      },
    })
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        ...styles.notification,
        backgroundColor: !item.read ? '#F2F7FF' : '#FBFBFB',
      }}
      onPress={handlePress}>
      <View style={styles.holder}>
        <View style={styles.avatarHolder}>
          <WelcomeNotif width={40} height={40} />
        </View>
        <View style={styles.captionWrapper}>
          <AppText textStyle="caption">
            Welcome to Servbees, Busybee! Create your first post today to get
            buzy hustling. Sell a product, offer a service, look for sweet
            deals, or even just connect with other buzybees. Have fun!
          </AppText>
        </View>
      </View>
      <View style={styles.timeAgo}>
        <PostClock style={styles.postClock} />
        <AppText textStyle="caption">
          {timeAgo(Date.now() / 1000 - item.date._seconds)}
        </AppText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: 4,
  },
  holder: {
    flexDirection: 'row',
    marginBottom: normalize(20),
  },
  avatarHolder: {
    marginRight: normalize(15),
  },
  captionWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  timeAgo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postClock: {
    marginRight: normalize(5),
  },
})

export default Welcome
