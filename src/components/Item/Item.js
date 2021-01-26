import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import { AppText, PriceDisplay } from '@/components'
import { Colors, normalize } from '@/globals'
import { commaSeparate } from '@/globals/Utils'

const Item = ({ item, children, style }) => {
  const { title, description, itemImage, price } = item

  return (
    <View style={{ paddingVertical: 8 }}>
      <View style={styles.itemContainer}>
        {itemImage !== '' ? (
          <View style={styles.image}>
            <Image source={itemImage} style={styles.image} />
          </View>
        ) : (
          <></>
        )}

        <View style={styles.itemDetailsContainer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText
              textStyle="subtitle2"
              customStyle={{ paddingRight: 16, flex: 1 }}>
              {title}
            </AppText>
            <AppText textStyle="subtitle2">₱{price}</AppText>
          </View>
          <AppText textStyle="caption">{description}</AppText>
          {children}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: normalize(84),
    height: normalize(84),
    backgroundColor: Colors.primaryYellow,
    borderRadius: 8,
    marginRight: 16,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemDetailsContainer: {
    flex: 1,
  },
})

export default Item
