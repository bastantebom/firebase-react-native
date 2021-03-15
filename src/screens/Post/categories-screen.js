import { Icons } from '@/assets/images/icons'
import RadioButton from '@/components/radio-button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

/**
 * @typedef {object} Category
 * @property {string} name
 * @property {number} count
 */
/**
 * @typedef {object} CategoriesScreenProps
 * @property {Category[]} categories
 * @property {Category} selectedCategory
 * @property {function} onSelect
 * @property {function} onCreatePress
 */

/**
 * @typedef {object} RootProps
 * @property {CategoriesScreenProps} CategoriesScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CategoriesScreen'>} param0 */
const CategoriesScreen = ({ navigation, route }) => {
  const { categories, selectedCategory, onSelect, onCreatePress } = route.params

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Your Categories</Text>
          </View>
        </View>
        <ScrollView style={styles.categories}>
          {categories.map((category, index, arr) => {
            return (
              <RadioButton
                key={category.name}
                containerStyle={[
                  styles.category,
                  index === arr.length - 1
                    ? { paddingBottom: normalize(16) }
                    : {},
                ]}
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

          <RadioButton
            containerStyle={[styles.category, styles.othersCategory]}
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
                  { color: Colors.contentPlaceholder },
                ]}>
                No specific category? The item will be automatically categorized
                under "Others”.
              </Text>
            </View>
          </RadioButton>
        </ScrollView>
        <View>
          <LinearGradient
            style={{
              height: normalize(20),
              width: '100%',
              position: 'absolute',
              top: normalize(-20),
              zIndex: 1,
            }}
            colors={['transparent', 'rgba(65,65,65,0.05)']}
            locations={[0, 1]}
            pointerEvents="none"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.createCategory}
            onPress={onCreatePress}>
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
              e.g. Burgers, Drinks, Desserts, Snacks
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: Platform.select({
      ios: 0,
      android: StatusBar.currentHeight - 2,
    }),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  categories: {
    flex: 1,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
  },
  category: {
    paddingVertical: normalize(8),
  },
  othersCategory: {
    borderTopWidth: 1,
    borderTopColor: Colors.secondarySolitude,
    paddingTop: normalize(16),
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
    paddingHorizontal: normalize(24),
  },
})

export default CategoriesScreen
