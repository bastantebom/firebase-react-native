import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { formatNumber } from 'react-native-currency-input'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import CategoryOptionsModal from './modals/category-options'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { FlatList } from 'react-native-gesture-handler'
import PostImage from '@/components/Post/post-image'

/**
 * @typedef {object} PostItem
 * @property {string} name
 * @property {string} image
 * @property {number} price
 * @property {number} description
 */

/**
 * @typedef {object} CategoryItemsScreenProps
 * @property {PostItem[]} items
 * @property {string} category
 * @property {(PostItem) => void} onEditItemPress
 * @property {function} onEditCategoryPress
 * @property {function} onRemoveCategoryPress
 * @property {function} onAddItemPress
 * @property {'sell' | 'service'} postType
 */

/**
 * @typedef {object} RootProps
 * @property {CategoryItemsScreenProps} CategoryItemsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CategoryItemsScreen'>} param0 */
const CategoryItemsScreen = ({ navigation, route }) => {
  const {
    items,
    category,
    onEditItemPress,
    onAddItemPress,
    onEditCategoryPress,
    onRemoveCategoryPress,
    postType,
  } = route.params

  const [optionsModalVisible, setOptionsModalVisible] = useState(false)

  const handleOnEditPress = item => {
    onEditItemPress(item)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={[
          styles.item,
          { paddingTop: normalize(!index ? 0 : 24) },
          index === items.length - 1 ? { borderBottomWidth: 0 } : {},
        ]}>
        {!!item.image && (
          <View style={styles.thumbnailWrapper}>
            <PostImage style={styles.thumbnail} path={item.image} />
          </View>
        )}
        <View style={[styles.itemDetails]}>
          <View style={styles.itemHeader}>
            <Text style={[typography.body1narrow, typography.medium]}>
              {item.name}
            </Text>
            <Text
              style={[
                typography.body1narrow,
                typography.medium,
                styles.itemPrice,
              ]}>
              ₱
              {formatNumber(item.price + '', {
                separator: '.',
                precision: 2,
                delimiter: ',',
              })}
            </Text>
          </View>
          {!!item.description?.length && (
            <Text
              style={[typography.body2, styles.itemDescription]}
              numberOfLines={4}>
              {item.description}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.7}
            onPress={() => handleOnEditPress(item)}>
            <Text style={[typography.caption, typography.link]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const handleOnRemoveCategoryPress = () => {
    onRemoveCategoryPress(category)
    setOptionsModalVisible(false)
  }

  const handleOnEditCategoryPress = () => {
    onEditCategoryPress(category)
    setOptionsModalVisible(false)
  }

  const renderOptionsModal = () => {
    return (
      <Modal
        isVisible={optionsModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setOptionsModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setOptionsModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <CategoryOptionsModal
          onEditCategoryPress={handleOnEditCategoryPress}
          onRemoveCategoryPress={handleOnRemoveCategoryPress}
          canRemove={category !== 'Others'}
          close={() => setOptionsModalVisible(false)}
        />
      </Modal>
    )
  }

  const showOptionsModal = () => {
    setOptionsModalVisible(true)
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
            <Text style={styles.title}>{category}</Text>
          </View>
          <TouchableOpacity
            style={styles.optionsButton}
            activeOpacity={0.7}
            onPress={showOptionsModal}>
            <Icons.VerticalEllipsis
              style={styles.optionsIcon}
              {...iconSize(24)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <FlatList
            contentContainerStyle={{ paddingVertical: normalize(24) }}
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              <TouchableOpacity
                style={[styles.addItemButton, styles.linkWrapper]}
                activeOpacity={0.7}
                onPress={onAddItemPress}>
                <Icons.CircleAdd style={styles.linkIcon} />
                <Text
                  style={[
                    typography.body2,
                    typography.link,
                    typography.medium,
                  ]}>
                  Add {postType === 'service' ? 'a Service' : 'an Item'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {renderOptionsModal()}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  optionsButton: {
    position: 'absolute',
    right: 0,
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
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemDescription: {
    color: Colors.contentPlaceholder,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
  },
  item: {
    flexDirection: 'row',
    paddingBottom: normalize(20),
    paddingTop: normalize(24),
    backgroundColor: 'white',
    borderBottomColor: Colors.Gainsboro,
    borderBottomWidth: normalize(1),
    marginHorizontal: normalize(24),
  },
  itemDetails: {
    flex: 1,
    minHeight: normalize(80),
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
    marginTop: normalize(8),
  },
  linkIcon: {
    marginRight: normalize(8),
    color: Colors.link,
  },
  optionsIcon: {
    color: Colors.primaryMidnightBlue,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  thumbnailWrapper: {
    height: normalize(80),
    width: normalize(80),
    marginRight: normalize(16),
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
  },
  addItemButton: {
    paddingHorizontal: normalize(24),
  },
})

export default CategoryItemsScreen
