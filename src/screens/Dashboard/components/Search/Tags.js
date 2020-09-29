import React from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { normalize, Colors } from '@/globals';
import { AppText } from '@/components';

const { width, height } = Dimensions.get('window');

const Tags = () => {

  const tags = ["Burger", "N95 Mask", "Isopropyl alcohol", "Milk Tea", "Horchata", "Arabica Coffee Beans", "Talbos ng Kamote"]

  return (
    <View>
      <AppText 
        textStyle="body3" 
        color={Colors.contentPlaceholder}
        customStyle={{ marginTop: 25, marginBottom: 20 }}
      >
        Popular Tags Near You
      </AppText>
      <View style={{ flex: 0, flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {tags.map((item, index) => {
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => null}
              style={{ backgroundColor: Colors.neutralsZircon, borderRadius: 50, paddingVertical: 8, paddingHorizontal: 10, marginHorizontal: 4, marginBottom: 10 }}
            >
              <AppText textStyle="caption">{item}</AppText>
            </TouchableOpacity> 
          )
        })}
      </View>
    </View>
  )
};

export default Tags;