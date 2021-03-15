import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

/**
 * @param {object} props
 * @param {category => void} props.onEditCategoryPress
 * @param {category => void} props.onRemoveCategoryPress
 * @param {boolean} canEdit
 * @param {boolean} canRemove
 **/
const CategoryOptionsModal = ({
  onEditCategoryPress,
  onRemoveCategoryPress,
  canEdit = true,
  canRemove = true,
}) => {
  const options = [
    {
      label: 'Edit Category Name',
      color: Colors.contentPlaceholder,
      onPress: onEditCategoryPress,
      disabled: !canEdit,
      icon: (
        <Icons.Pencil
          style={{ color: Colors.contentPlaceholder }}
          {...iconSize(24)}
        />
      ),
    },
    {
      label: 'Remove Category',
      color: Colors.secondaryBrinkPink,
      onPress: onRemoveCategoryPress,
      disabled: !canRemove,
      icon: (
        <Icons.CircleBlock
          style={{ color: Colors.secondaryBrinkPink }}
          {...iconSize(24)}
        />
      ),
    },
  ]

  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Edit Category</Text>
      </View>
      <View style={styles.options}>
        {options.map(option => {
          return option.disabled ? null : (
            <TouchableOpacity
              activeOpacity={0.7}
              key={option.label}
              style={styles.option}
              onPress={option.onPress}>
              {option.icon}
              <Text
                style={[
                  styles.optionLabel,
                  typography.body2,
                  typography.medium,
                  typography.link,
                  { color: option.color },
                ]}>
                {option.label}
              </Text>
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
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.secondarySolitude,
    paddingBottom: normalize(24),
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  options: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(24),
  },
  option: {
    flexDirection: 'row',
    marginBottom: normalize(4),
    paddingVertical: normalize(8),
  },
  optionLabel: {
    marginLeft: normalize(8),
  },
})

export default CategoryOptionsModal
