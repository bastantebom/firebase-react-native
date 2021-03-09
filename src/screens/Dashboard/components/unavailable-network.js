import React from 'react'
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import { Images } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { AppButton, AppText } from '@/components'

const UnavailableNetwork = ({ navigation }) => {
  const handleReload = () => {
    NetInfo.fetch().then(state => {
      if (state.isInternetReachable === true) navigation.goBack()
    })
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Images.NoInternet style={styles.image} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.description}>
          Please connect to WiFi or turn on your Cellular Data.
        </Text>
      </View>
      <View style={styles.buttonParentWrapper}>
        <View style={styles.buttonWrapper}>
          <AppButton
            customStyle={styles.createButton}
            text={'Reload'}
            type="primary"
            height="lg"
            onPress={handleReload}
          />
        </View>
      </View>
      <View style={styles.footerCopy}>
        <AppText textStyle="body2" customStyle={styles.footerText}>
          Need help? Contact{' '}
        </AppText>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'mailto:support@servbees.com?subject=Support Needed'
            )
          }>
          <AppText textStyle="body2" color={Colors.contentOcean}>
            support@servbees.com
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(40),
    marginBottom: normalize(20),
  },
  textWrapper: {
    paddingLeft: normalize(27.7),
    paddingRight: normalize(27.7),
    marginBottom: normalize(25),
  },
  title: {
    textAlign: 'center',
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(24),
    color: '#2E3034',
    lineHeight: normalize(35),
  },
  description: {
    textAlign: 'center',
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    color: '#2E3034',
    lineHeight: normalize(20.79),
    letterSpacing: normalize(0.25),
  },
  buttonParentWrapper: {
    alignItems: 'center',
  },
  buttonWrapper: {
    width: normalize(200),
  },
  createButton: {
    marginBottom: normalize(27),
  },
  footerCopy: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: normalize(27),
    paddingVertical: normalize(56),
    flexDirection: 'row',
  },
  footerText: {
    flexWrap: 'wrap',
  },
})

export default UnavailableNetwork
