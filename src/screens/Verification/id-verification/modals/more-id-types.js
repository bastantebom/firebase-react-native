import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { AppText, BottomSheetHeader } from '@/components'
import { normalize } from '@/globals'

const MoreIdTypes = ({ onSelect, items }) => {
  const renderItem = item => {
    return (
      <TouchableOpacity
        key={item}
        style={styles.listItem}
        onPress={() => {
          onSelect(item)
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText textStyle="body1">{item}</AppText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <View style={styles.content}>
        <Text style={styles.headerTitle}>More Options</Text>
        <ScrollView style={styles.scrollContainer}>
          {items.map(renderItem)}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(20),
    lineHeight: normalize(29),
    letterSpacing: 0.15,
    color: '#353B50',
    marginBottom: normalize(8),
    padding: normalize(16),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(24),
    paddingTop: 0,
  },
  scrollContainer: {
    flex: 1,
  },
})

export default MoreIdTypes
