import React, { useState } from 'react'
import AppText from '@/components/AppText/AppText'
import ImagePicker from 'react-native-image-crop-picker';
import AppButton from '@/components/AppButton';
import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import { Chip } from 'react-native-paper';
import Fluid from "react-native-fluid-transitions";
import AppColor from '@/globals/Colors';

import Search from '@/assets/images/icons/search.svg';
import AppInput from '@/components/AppInput/AppInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/globals/Colors';

const PostFilter = () => {

  const [selected, setSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const [active, setActive] = useState(false);
  const toggle = () => setActive(a => !a);

  const filterTabs = [
    { name: 'All', selected: true },
    { name: 'Services', selected: false },
    { name: 'Sell', selected: false },
    { name: 'Need', selected: false },
  ] 

  const deviceWidth = Dimensions.get('window').width;

  const handleFilter = (item, i) => {
    // setSelected(!selected)
    Alert.alert(item.name, JSON.stringify(item.selected))
  }

  return (
    <View style={styles.postFilterWrapper}>
      <View style={styles.filterWrapper}>
        { filterTabs.map((item, i) => {
          return (
            <Chip 
              key={i} 
              // onPress={() => setSelected(!selected)} 
              // onPress={() => Alert.alert(selected, item.name)} 
              onPress={() => handleFilter(item, i)}
              style={{ paddingHorizontal: 8, backgroundColor: selected ? AppColor.primarySalomie : AppColor.neutralsZircon }} 
            >
              <AppText textStyle="eyebrow2">{item.name}</AppText>
            </Chip>
          )
        })}
      </View>
      <View style={styles.searchWrapper}>
        <Fluid.View
          // style={active ? styles.active : styles.inactive}
          style={{ width: active ? deviceWidth - 16 : 40 }}
        >
          <View style={styles.searchIcon}>
            <TouchableOpacity onPress={toggle}>
              <Search/> 
            </TouchableOpacity>
          </View>
          {/* <View> */}
            <AppInput 
            customStyle={styles.search}
            // customStyle={{ backgroundColor: active ? AppColor.neutralsWhite : 'transparent', position: 'relative',
            // borderRadius: 50, 
            // height: 40, 
            // paddingRight: 30 }}
            />
          {/* </View> */}
        </Fluid.View>
      </View>
    </View>
  )
}

export default PostFilter;

const styles = StyleSheet.create({
  postFilterWrapper: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterWrapper: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: -5
  },
  searchWrapper: {
    position: 'absolute',
    right: 8
  },
  searchIcon: {
    right: 11, 
    top: 12,
    position: 'absolute',
    zIndex: 5 
  },
  search: { 
    position: 'relative',
    borderRadius: 50, 
    height: 40, 
    paddingRight: 30,
    backgroundColor: AppColor.neutralsWhite
  }
});