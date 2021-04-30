import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Colors, normalize } from '@/globals'

import { NoPost } from '@/assets/images'
import typography from '@/globals/typography'

const EmptyBlockList = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <NoPost width={normalize(140)} height={normalize(140)} />
      </View>
      <View style={styles.copyWrapper}>
        <Text style={[styles.centerCopy, typography.display6]}>
          No Blocked Users
        </Text>
        <Text style={[styles.centerCopy, typography.body2]}>
          When you block someone, that person won't be able to find your profile
          and posts or transact with you on Servbees.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(30),
    backgroundColor: Colors.neutralsWhite,
  },
  imageWrapper: {
    marginBottom: normalize(16),
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerCopy: {
    textAlign: 'center',
    marginBottom: normalize(8),
    color: Colors.profileLink,
  },

  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(16),
  },

  copySpacing: {
    marginLeft: normalize(8),
    marginRight: normalize(8),
  },
})

export default EmptyBlockList
