import React, { useState } from 'react'
import AppText from '@/components/AppText/AppText'
import ImagePicker from 'react-native-image-crop-picker';
import AppButton from '@/components/AppButton';
import { View, Text, Alert } from 'react-native';
import { Chip } from 'react-native-paper';

const PostFilter = () => {

  const [selected, setSelected] = useState(false);

  const filterTabs = [
    { name: 'All' },
    { name: 'Services' },
    { name: 'Sell' },
    { name: 'Need' },
  ]

  return (
    <View style={{ flexDirection: 'row' }}>
      { filterTabs.map((item, i) => {
        return (
          <Chip 
            key={i} 
            onPress={() => setSelected(!selected)} 
            // onPress={() => console.log(selected, item.name)} 
            style={{ paddingHorizontal: 16 }} 
            selected={selected}
          >
            <AppText textStyle="eyebrow2">{item.name}</AppText>
          </Chip>
        )
      })}
    </View>
  )
}

export default PostFilter;