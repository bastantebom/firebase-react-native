import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText} from '@/components';
import {normalize, Colors} from '@/globals';

import {RadioDot} from '@/assets/images/icons';

const Radio = ({Icon, label, style, value, valueChangeHandler, name}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        valueChangeHandler(name);
      }}>
      <View
        style={{
          // backgroundColor: 'blue',
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 8,
          paddingVertical: 8,

          ...style,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          {Icon ? <Icon /> : <></>}
          <AppText textStyle="body3" customStyle={{marginLeft: 8}}>
            {label}
          </AppText>
        </View>

        <View
          style={{
            width: normalize(20),
            height: normalize(20),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: normalize(18),
              height: normalize(18),
              borderRadius: normalize(20 / 2),
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1.2,
              borderColor: value
                ? Colors.checkboxBorderActive
                : Colors.checkboxBorderDefault,
              backgroundColor: value
                ? Colors.primaryCream
                : Colors.neutralsWhitesmoke,
            }}>
            {value ? (
              <RadioDot width={normalize(6)} height={normalize(6)} />
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Radio;
