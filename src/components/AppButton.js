import React from 'react';
import {View, TouchableOpacity, Dimensions, Text} from 'react-native';
import AppText from './AppText/AppText';
import AppColor from '../globals/Colors';

import FB from '../assets/images/icons/fb.svg';
import G from '../assets/images/icons/G.svg';

const width = Dimensions.get('window').width;

const AppButton = ({text, type, height, size, onPress, customStyle, icon}) => {
  //const large = width / 1.119;
  const small = width / 2.5;
  const btnSize = size === 'sm' ? small : '';

  const btnBgColor =
    type === 'primary'
      ? AppColor.primaryYellow
      : type === 'secondary' || type === 'tertiary'
      ? 'transparent'
      : AppColor.neutralsWhite;

  const btnBorderColor =
    type === 'primary'
      ? AppColor.primaryYellow
      : type === 'secondary'
      ? AppColor.contentEbony
      : type === 'tertiary'
      ? AppColor.neutralsWhite
      : AppColor.neutralsWhite;

  const btnTextColor =
    type === 'primary'
      ? AppColor.contentEbony
      : type === 'secondary'
      ? AppColor.contentEbony
      : type === 'tertiary'
      ? AppColor.neutralsWhite
      : AppColor.contentEbony;

  const btnBorderRadius = 3;

  const btnHeight =
    height === 'xs'
      ? 24
      : height === 'sm'
      ? 32
      : height === 'md'
      ? 40
      : height === 'lg'
      ? 48
      : 56;

  const containerCommonStyle = {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: btnBgColor,
    height: btnHeight,
    borderWidth: 1.5,
    borderColor: btnBorderColor,
    borderRadius: btnBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  };

  if (size === 'sm') {
    containerCommonStyle.width = btnSize;
  }

  const textSyle = {
    color: btnTextColor,
  };

  const iconWrapper = {
    position: 'absolute',
    alignItems: 'flex-start',
    left: 16,
  };

  const buttonIcon =
    icon && icon === 'fb' ? <FB /> : icon && icon === 'g' ? <G /> : '';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={{...containerCommonStyle, ...customStyle}}>
        <View style={iconWrapper}>
          <Text>{buttonIcon}</Text>
        </View>
        <AppText customStyle={textSyle}>{text}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
