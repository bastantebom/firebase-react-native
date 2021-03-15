import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

/**
 * @param {object} MenuItem
 * @property {string} key
 * @property {React.Component} label
 * @property {React.Component} renderIcon
 * @property {() => void} onPress
 */

/**
 * @param {object} props
 * @param {function} props.close
 * @param {MenuItem[]} props.menuItems
 **/
const MenuDrawer = ({ menuItems, close }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />

      <View style={styles.menuItems}>
        {menuItems.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item.key}
              style={styles.menuItem}
              onPress={item.onPress}>
              {item.icon}
              {item.label}
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.buttonWrapper}>
        <Button label="Cancel" type="disabled" onPress={close} />
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
  menuItems: {
    paddingHorizontal: normalize(24),
    marginVertical: normalize(12),
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: normalize(4),
    paddingVertical: normalize(8),
  },
  buttonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
})

export default MenuDrawer
