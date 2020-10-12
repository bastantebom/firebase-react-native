import React, {useEffect} from 'react';
import {View} from 'react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ItemCategory = ({items}) => {
  console.log(items);

  const result = [
    ...items
      .reduce((r, {categoryName, description, itemImage, price, title}) => {
        r.has(categoryName) ||
          r.set(categoryName, {
            categoryName,
            items: [],
          });

        r.get(categoryName).items.push({description, itemImage, price, title});

        return r;
      }, new Map())
      .values(),
  ];

  console.log('RESULT:');
  console.log(result);

  const CategoryList = () => {
    return result.map((category) => {
      return (
        <TouchableOpacity>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              paddingVertical: 16,
              paddingHorizontal: 12,
              marginTop: 24,
              borderColor: Colors.neutralGray,
            }}>
            <AppText textStyle="body2">{category.categoryName} </AppText>
            <AppText textStyle="caption">
              {category.items?.length}{' '}
              {category.items?.length > 1 ? 'Items' : 'Item'}
            </AppText>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View>
      <CategoryList />
    </View>
  );
};

export default ItemCategory;
