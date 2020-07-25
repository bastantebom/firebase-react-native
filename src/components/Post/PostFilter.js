import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import Fluid from "react-native-fluid-transitions";

import AppColor from '@/globals/Colors';
import AppInput from '@/components/AppInput/AppInput';
import AppText from '@/components/AppText/AppText'
import Search from '@/assets/images/icons/search.svg';

const PostFilter = () => {

  const deviceWidth = Dimensions.get('window').width;

  const [selected, setSelected] = useState(true);

  const [active, setActive] = useState(false);
  const toggle = () => setActive(a => !a);

  const filterTabs = [
    { name: 'All',  },
    { name: 'Services' },
    { name: 'Sell' },
    { name: 'Need' },
  ] 

  const handleFilter = (item, i) => {
    i => setSelected(!selected)
    console.log(item.name, JSON.stringify(i))
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