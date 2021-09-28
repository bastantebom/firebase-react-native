import RadioButton from '@/components/radio-button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import pluralize from 'pluralize'
import { BottomSheetHeader } from '@/components'

/**
 * @typedef {object} Category
 * @property {string} name
 * @property {number} count
 */

/**
 *
 * @param {object} props
 * @property {Category[]} categories
 * @property {string} selectedCategory
 * @property {function} onSelect
 * @property {function} onCreatePress
 * @property {string} postType
 *
 */
const CategoriesModal = ({
  categories,
  selectedCategory,
  onSelect,
  onCreatePress,
  postType,
}) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <ScrollView style={styles.categories}>
        {!!categories?.length && (
          <View>
            <Text style={[typography.body2narrow, typography.medium]}>
              Your {pluralize('Category', categories?.length || 0)}
            </Text>
            {categories.map(category => {
              return (
                <RadioButton
                  key={category.name}
                  containerStyle={styles.category}
                  value={selectedCategory === category.name}
                  onPress={() => onSelect?.(category.name)}>
                  <View style={styles.categoryContent}>
                    <Text
                      style={[
                        typography.body2narrow,
                        typography.medium,
                        styles.categoryName,
                      ]}>
                      {category.name}
                    </Text>
                    <Text
                      style={[
                        typography.body2,
                        { color: Colors.contentPlaceholder },
                      ]}>
                      {!!category.count
                        ? `${pluralize('item', category.count, true)}`
                        : 'No items yet'}
                    </Text>
                  </View>
                </RadioButton>
              )
            })}
          </View>
        )}

        <RadioButton
          containerStyle={styles.category}
          value={selectedCategory === 'Others'}
          onPress={() => onSelect?.('Others')}>
          <View style={styles.categoryContent}>
            <Text
              style={[
                typography.body2narrow,
                typography.medium,
                styles.categoryName,
              ]}>
              Others
            </Text>
            <Text
              style={[
                typography.body2,
                { color: Colors.contentPlaceholder, fontSize: 14 },
              ]}>
              No specific category for this service? It’ll automatically be
              under ‘Others’.
            </Text>
          </View>
        </RadioButton>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.createCategory}
          onPress={() => onCreatePress?.()}>
          <Text
            style={[
              typography.body2narrow,
              typography.medium,
              typography.link,
              styles.categoryName,
            ]}>
            Create a New Category
          </Text>
          <Text
            style={[typography.body2, { color: Colors.contentPlaceholder }]}>
            {postType === 'service'
              ? 'e.g. Cleaning, Polishing, Restoration'
              : 'e.g. Burgers, Drinks, Desserts, Snacks'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  categories: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
  },
  category: {
    paddingVertical: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondarySolitude,
  },
  categoryContent: {
    justifyContent: 'center',
    flex: 1,
  },
  categoryName: {
    marginBottom: normalize(4),
  },
  createCategory: {
    paddingVertical: normalize(16),
  },
})

export default CategoriesModal
