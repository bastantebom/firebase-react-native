import { BottomSheetHeader } from '@/components'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

/**
 * @param {object} MenuItem
 * @property {string} key
 * @property {string} label
 * @property {() => React.Component} renderIcon
 */

/**
 * @param {object} props
 * @param {function} props.onPress
 * @param {MenuItem[]} props.menuItems
 **/
const MoreOptionsModal = ({ onPress, menuItems }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>More Options</Text>
      </View>
      <View style={styles.menuItems}>
        {menuItems.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item.key}
              style={styles.menuItem}
              onPress={() => onPress(item.key)}>
              {item.renderIcon()}
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  titleWrapper: {
    margin: normalize(16),
    alignItems: 'center',
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  menuItems: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(24),
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: normalize(4),
    paddingVertical: normalize(8),
  },
  menuItemLabel: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    letterSpacing: normalize(0.5),
    color: Colors.contentPlaceholder,
  },
})

export default MoreOptionsModal
