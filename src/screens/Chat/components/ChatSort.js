import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { AppText } from '@/components'

import { normalize, Colors } from '@/globals'

const ChatSort = ({ choice, close }) => {
  const choices = [
    {
      label: 'All Messages',
      value: 'all',
      description: 'These are all your messages',
    },
    {
      label: 'Own Posts',
      value: 'seller',
      description: 'Messages on your own posts',
    },
    {
      label: 'My orders',
      value: 'own',
      description: 'Messages on you orders',
    },
    {
      label: 'Past',
      value: 'past',
      description: 'Messages from past orders',
    },
  ]

  const onSortSelect = item => {
    choice(item)
    close()
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', paddingBottom: normalize(35) }}>
        <View style={styles.bottomSheetHeader} />
      </View>
      <AppText textStyle="body2" color={Colors.contentPlaceholder}>
        View by
      </AppText>

      {choices.map((option, i) => {
        return (
          <View key={i}>
            <TouchableOpacity
              style={{ paddingVertical: normalize(16) }}
              onPress={() => onSortSelect(option)}>
              <AppText
                textStyle="body1medium"
                customStyle={{ paddingBottom: normalize(4.5) }}>
                {option.label}
              </AppText>
              <AppText textStyle="body2">{option.description}</AppText>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

export default ChatSort

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: normalize(20),
  },
  bottomSheetHeader: {
    backgroundColor: '#EAEAEA',
    height: normalize(5),
    width: normalize(40),
  },
})
