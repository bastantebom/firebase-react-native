import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { FriendlyBadge, HelpfulBadge, PlusCircle } from '@/assets/images/icons'

const Badge = () => {
  const navigation = useNavigation()
  const [friendly, setFriendly] = useState(false)
  const [helpful, setHelpful] = useState(true)

  const badgeInfo = {
    name: 'Wayne',
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={2} />
      <View style={styles.contentWrapper}>
        <View style={{ paddingBottom: 15 }}>
          {friendly && <FriendlyBadge />}
          {helpful && <HelpfulBadge />}
        </View>
        <AppText
          textStyle="body3"
          customStyle={{ marginBottom: normalize(10) }}>
          Yay, {badgeInfo.name}! How Popular!
        </AppText>
        <AppText textStyle="caption">
          You've been awarded the
          {friendly && (
            <>
              {' '}
              <AppText textStyle="caption2">Friendly Badge!</AppText>
            </>
          )}
          {helpful && (
            <>
              {' '}
              <AppText textStyle="caption2">Helpful Badge!</AppText>{' '}
            </>
          )}
        </AppText>
        <AppText textStyle="caption">
          Some text here saying more about the badge.
        </AppText>
        <TouchableOpacity style={styles.addToProfileButton}>
          <AppText customStyle={{ marginRight: normalize(10) }}>
            <PlusCircle />
          </AppText>
          <AppText textStyle="button2">Add to Profile</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: normalize(100),
    alignItems: 'center',
    height: '100%',
  },
  addToProfileButton: {
    marginTop: normalize(30),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(30),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFD400',
    borderRadius: 3,
  },
})

export default Badge
