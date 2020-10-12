import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {AppText} from '@/components';
import {Colors, normalize} from '@/globals';

const Item = ({item, children, style}) => {
  // console.log('ITEM RECEIVED');
  // console.log(item);

  const {title, description, itemImage, price} = item;

  return (
    <View style={{paddingVertical: 8}}>
      <View style={styles.itemContainer}>
        <View style={styles.image}>
          <Image source={itemImage} style={styles.image} />
        </View>

        <View style={styles.itemDetailsContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText
              textStyle="subtitle2"
              customStyle={{paddingRight: 16, flex: 1}}>
              {title}
            </AppText>
            <AppText textStyle="subtitle2">
              {price === 'Free' ? '' : '₱'} {price}
            </AppText>
          </View>
          <AppText textStyle="caption">{description}</AppText>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: normalize(84),
    height: normalize(84),
    backgroundColor: Colors.primaryYellow,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemDetailsContainer: {
    paddingLeft: 16,
    flex: 1,
  },
});

export default Item;
