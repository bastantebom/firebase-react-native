import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AppText from './AppText/AppText';
import AppColor from '../globals/Colors';

const width = Dimensions.get('window').width;

const AppButton = ({ text, onPress, type, size, height }) => {
  const large = width / 1.3;
  const small = width / 2.5;
  const btnSize = size === 'sm' ? small : large;
  const btnBgColor =
    type === 'primary' ? AppColor.primaryYellow : 'transparent';
  const btnBorderColor =
    type === 'primary' ? AppColor.primaryYellow : AppColor.contentEbony;
  const btnBorderRadius = 3;
  const btnHeight =
    height === 'xs'
      ? 2
      : height === 'sm'
        ? 4
        : height === 'md'
          ? 8
          : height === 'lg'
            ? 10
            : 14;

  const containerCommonStyle = {
    backgroundColor: btnBgColor,
    paddingVertical: btnHeight,
    width: btnSize,
    borderWidth: 1.5,
    borderColor: btnBorderColor,
    borderRadius: btnBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[containerCommonStyle]}>
        <AppText textStyle="button2">{text}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
