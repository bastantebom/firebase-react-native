import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import React, { useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} Category
 * @property {string} name
 * @property {number} count
 */

/**
 * @typedef {object} CreateCategoryScreenProps
 * @property {function} onSubmit
 * @property {Category[]} categories
 * @property {Category} category
 */

/**
 * @typedef {object} RootProps
 * @property {CreateCategoryScreenProps} CreateCategoryScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CreateCategoryScreen'>} param0 */
const CreateCategoryScreen = ({ navigation, route }) => {
  const { onSubmit, categories } = route.params
  const [category, setCategory] = useState(route.params.category || '')

  const canSubmit = () =>
    category.length &&
    ![...categories, { name: 'Others' }].some(
      ({ name }) => category === name && name !== route.params.category
    )

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
            <Text style={styles.title}>
              {route.params.category?.length
                ? 'Edit Category Name'
                : 'Add a Category'}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.formGroup}>
            <TextInput
              label="Category Name"
              placeholder="e.g. Burgers"
              placeholderTextColor="#A8AAB7"
              value={category}
              onChangeText={setCategory}
              autofocus
            />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={!canSubmit()}
            label={route.params.category?.length ? 'Save' : 'Add Category'}
            type={!canSubmit() ? 'disabled' : 'primary'}
            onPress={() => {
              if (route.params.category?.length)
                onSubmit(route.params.category, category)
              else onSubmit(category)
            }}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
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
  content: {
    flex: 1,
    padding: normalize(24),
  },
  formGroup: {
    marginBottom: normalize(16),
  },
  buttonWrapper: {
    padding: normalize(24),
  },
})

export default CreateCategoryScreen
