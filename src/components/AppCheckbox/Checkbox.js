import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText} from '@/components';
import {normalize, Colors} from '@/globals';

import {CheckboxCheck} from '@/assets/images/icons';

const Checkbox = ({Icon, label, style, value, valueChangeHandler}) => {
  return (
    <TouchableOpacity activeOpacity={.7} onPress={() => valueChangeHandler()}>
      <View
        style={{
          // backgroundColor: 'blue',
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 8,
          paddingVertical: 8,
          backgroundColor: value
            ? Colors.primaryCream
            : Colors.neutralsWhitesmoke,
          ...style,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon />
          <AppText textStyle="body3" customStyle={{marginLeft: 8}}>
            {label}
          </AppText>
        </View>

        <View
          style={{
            // backgroundColor: 'yellow',
            width: normalize(20),
            height: normalize(20),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: normalize(4),
            borderWidth: 1.2,
            borderColor: value
              ? Colors.checkboxBorderActive
              : Colors.checkboxBorderDefault,
          }}>
          {value ? (
            <CheckboxCheck width={normalize(7.83)} height={normalize(7.26)} />
          ) : (
            <></>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Checkbox;
