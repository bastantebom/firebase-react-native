import React, { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'

import { AppText } from '@/components'
import { Colors } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import AddedItemPreview from '@/screens/Post/components/forms/modals/AddedItemPreview'

const ItemCategory = ({ items }) => {
  const [previewItemModal, setPreviewItemModal] = useState(false)

  const navigation = useNavigation()

  const result = [
    ...items
      .reduce((r, { categoryName, description, itemImage, price, title }) => {
        r.has(categoryName) ||
          r.set(categoryName, {
            categoryName,
            items: [],
          })

        r.get(categoryName).items.push({ description, itemImage, price, title })

        return r
      }, new Map())
      .values(),
  ]

  const categoryHandler = category => {
    setPreviewItemModal(true)
    navigation.navigate('AddedItemPreviewScreen', {
      categoryName: category,
    })
  }

  const CategoryList = () => {
    return result.map(category => {
      return (
        <TouchableOpacity
          onPress={() =>
            categoryHandler(category.categoryName, category.items)
          }>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginTop: 24,
              borderColor: Colors.neutralGray,
            }}>
            <AppText
              textStyle="body2"
              customStyle={{ textTransform: 'capitalize' }}>
              {category.categoryName}{' '}
            </AppText>
            <AppText textStyle="caption">
              {category.items?.length}{' '}
              {category.items?.length > 1 ? 'Items' : 'Item'}
            </AppText>
          </View>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View>
      <CategoryList />
    </View>
  )
}

export default ItemCategory
