import React, { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'

import { AppText } from '@/components'
import { Colors } from '@/globals'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import AddedItemPreview from '@/screens/Post/components/forms/modals/AddedItemPreview'

const ItemCategory = ({ items, editing }) => {
  const [previewItemModal, setPreviewItemModal] = useState(false)

  const navigation = useNavigation()

  const result = [
    ...items
      .reduce(
        (
          r,
          {
            category,
            description,
            itemImage,
            price,
            title,
            id,
            name,
            itemID,
            categoryName,
          }
        ) => {
          r.has(category ?? categoryName) ||
            r.set(category ?? categoryName, {
              category: category ?? categoryName,
              items: [],
            })

          r.get(category ?? categoryName).items.push({
            description,
            itemImage,
            price,
            title,
            id,
            name,
            itemID,
            categoryName,
          })

          return r
        },
        new Map()
      )
      .values(),
  ]

  const categoryHandler = category => {
    setPreviewItemModal(true)
    navigation.navigate('AddedItemPreviewScreen', {
      category: category,
      itemsInCategory: result,
    })
  }

  const CategoryList = () => {
    return result.map(category => {
      return (
        <TouchableOpacity
          onPress={() => categoryHandler(category.category, category.items)}>
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
              {category.category ?? category.categoryName}
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
