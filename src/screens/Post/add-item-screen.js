import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import TextInput from '@/components/textinput'
import ImageUpload from './components/image-upload'
import PriceInput from '@/components/textinput/price-input'
import ToggleSwitch from '@/components/toggle'
import typography from '@/globals/typography'
import Button from '@/components/Button'
import Modal from 'react-native-modal'
import CategoriesModal from './modals/categories'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} Category
 * @property {string} name
 * @property {number} count
 */

/**
 * @typedef {object} PostItem
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {number} price
 * @property {boolean} available
 * @property {boolean} customRequests
 */

/**
 * @typedef {object} AddItemScreenProps
 * @property {Category[]} categories
 * @property {PostItem} item
 * @property {string} selectedCategory
 * @property {function} onCategoriesChange
 * @property {function} onCategorySelect
 * @property {function} onSubmit
 * @property {'service' | 'sell'} postType
 */

/**
 * @typedef {object} RootProps
 * @property {AddItemScreenProps} AddItemScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AddItemScreen'>} param0 */
const AddItemScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState(
    route.params.item || {
      id: Math.random().toString(36).substring(2),
      name: '',
      description: '',
      image: null,
      price: '0',
      available: true,
      customRequests: false,
    }
  )
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false)
  const {
    onCategoriesChange,
    categories,
    selectedCategory,
    onCategorySelect,
    onSubmit,
    postType,
  } = route.params

  const handleCategoriesInputPress = () => {
    if (categories.length < 5) setCategoriesModalVisible(true)
    else
      navigation.navigate('categories', {
        categories,
        postType,
        onCreatePress: handleOnCreateCategoryPress,
        selectedCategory,
        onSelect: category => {
          handleOnCategorySelect(category)
          navigation.goBack()
        },
      })
  }

  const handleOnCategorySelect = category => {
    navigation.setParams({
      selectedCategory: category,
    })
    onCategorySelect(category)
    setCategoriesModalVisible(false)
  }

  const handleSubmit = () => {
    const category = selectedCategory

    onSubmit({
      ...formData,
      category,
    })
  }

  const canSubmit = () => {
    const { name, price } = formData
    return !!name.length && price
  }

  const renderCategoriesSection = () => {
    return (
      <View
        style={[
          styles.section,
          styles.topSection,
          { paddingTop: normalize(8) },
        ]}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <Text style={styles.categoriesSub}>
          Pzzt… Select or create a new category for this service.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCategoriesInputPress}>
          <View pointerEvents="none">
            <TextInput
              inputStyle={{ color: Colors.contentEbony }}
              label="Select Category"
              filled
              editable={false}
              value={selectedCategory}
              placeholderTextColor="#A8AAB7"
              rightIcon={() => (
                <Icons.ChevronDown style={{ color: Colors.icon }} />
              )}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderItemFormSection = () => {
    return (
      <View style={styles.section}>
        <ImageUpload
          label="Add a photo"
          images={formData.image ? [formData.image] : []}
          onChange={images =>
            setFormData(data => ({ ...data, image: images[0] }))
          }
        />
        <View style={[styles.formGroup, { marginBottom: normalize(24) }]}>
          <TextInput
            label={postType === 'service' ? 'Service Name' : 'Item Name'}
            placeholder={
              postType === 'service'
                ? 'e.g. Online Tutor, Maintenance'
                : 'e.g. Laptop, Tea, Coffee'
            }
            value={formData.name}
            onChangeText={name => setFormData(data => ({ ...data, name }))}
            maxLength={100}
            displayLength={true}
            placeholderTextColor="#A8AAB7"
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.description}
            label="Description"
            onChangeText={description =>
              setFormData(data => ({ ...data, description }))
            }
            placeholder="Get the most out of your post by adding the product features, and buzz-worthy offers that your buyers might be interested in."
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#A8AAB7"
          />
        </View>
        <View style={styles.formGroup}>
          <PriceInput
            value={formData.price}
            onChangeText={price => setFormData(data => ({ ...data, price }))}
            placeholder="0.00"
          />
        </View>

        <View style={[styles.divider, { marginBottom: normalize(24) }]} />
        <View style={styles.formGroup}>
          <ToggleSwitch
            onPress={() =>
              setFormData(data => ({ ...data, available: !formData.available }))
            }
            value={formData.available}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body2narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Availability
              </Text>
              <Text
                style={[
                  typography.body2,
                  { color: Colors.contentPlaceholder, marginTop: normalize(4) },
                ]}>
                Disable toggle if service is unavailable.
              </Text>
            </View>
          </ToggleSwitch>
        </View>
        {postType === 'sell' && (
          <View style={styles.formGroup}>
            <ToggleSwitch
              onPress={() =>
                setFormData(data => ({
                  ...data,
                  customRequests: !formData.customRequests,
                }))
              }
              value={formData.customRequests}>
              <Text
                style={[
                  typography.body2narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Custom Requests
              </Text>
            </ToggleSwitch>
            <Text
              style={[
                typography.body2,
                { color: Colors.contentPlaceholder, marginTop: normalize(4) },
              ]}>
              Disable the toggle if you don’t want customers to make changes to
              your product.
            </Text>
          </View>
        )}

        <Button
          style={styles.submitButton}
          label={
            route.params.item
              ? 'Save'
              : postType === 'service'
              ? 'Add Service'
              : 'Add Item'
          }
          type={!canSubmit() ? 'disabled' : 'primary'}
          disabled={!canSubmit()}
          onPress={handleSubmit}
        />
      </View>
    )
  }

  const handleOnCreateCategoryPress = () => {
    setCategoriesModalVisible(false)
    navigation.navigate('create-category', {
      onSubmit: category => {
        onCategoriesChange([...categories.map(({ name }) => name), category])
        onCategorySelect(category)
        navigation.setParams({
          categories: [
            ...categories,
            {
              name: category,
              count: 0,
            },
          ],
          selectedCategory: category,
        })
        navigation.goBack()
        if (categories.length >= 5) {
          navigation.goBack()
        }
      },
      categories,
    })
  }

  const renderCategoriesModal = () => {
    return (
      <Modal
        isVisible={categoriesModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setCategoriesModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setCategoriesModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <CategoriesModal
          categories={categories}
          onCreatePress={handleOnCreateCategoryPress}
          onSelect={handleOnCategorySelect}
          selectedCategory={selectedCategory}
          postType={postType}
        />
      </Modal>
    )
  }

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
              {route.params.item
                ? `Edit ${postType === 'service' ? 'Item' : 'Service'}`
                : `Add ${postType === 'service' ? 'a Service' : 'an Item'}`}
            </Text>
          </View>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: null })}>
          <ScrollView>
            {renderCategoriesSection()}
            {renderItemFormSection()}
          </ScrollView>
        </KeyboardAvoidingView>
        {renderCategoriesModal()}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  categoriesSub: {
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    letterSpacing: normalize(0.4),
    lineHeight: normalize(18),
    marginBottom: normalize(16),
    marginTop: normalize(4),
  },
  categoriesTitle: {
    color: Colors.primaryMidnightBlue,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: normalize(0.5),
    lineHeight: normalize(24),
  },
  divider: {
    borderBottomWidth: normalize(1),
    borderColor: Colors.Gainsboro,
    marginVertical: normalize(8),
  },
  formGroup: {
    marginBottom: normalize(16),
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
    padding: normalize(24),
  },
  submitButton: {
    marginTop: normalize(24),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  titleWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: normalize(16),
    position: 'absolute',
    width: '100%',
  },
  topSection: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  wrapper: {
    backgroundColor: Colors.neutralsZirconLight,
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
})

export default AddItemScreen
