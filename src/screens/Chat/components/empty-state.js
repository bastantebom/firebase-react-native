import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Images } from '@/assets/images'
import { normalize } from '@/globals'
import utilStyles from '@/globals/util-styles'
import typography from '@/globals/typography'

const EmptyState = () => {
  return (
    <View style={[utilStyles.alignCenter, styles.wrapper]}>
      <View style={styles.imageWrapper}>
        <Images.ChatEmptyState />
      </View>

      <View style={[utilStyles.alignCenter]}>
        <Text style={typography.subtitle1}>No messages yet</Text>
        <Text style={typography.body2}>Start a conversation today.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: normalize(50),
  },
  imageWrapper: {
    marginBottom: normalize(25),
  },
})

export default EmptyState
