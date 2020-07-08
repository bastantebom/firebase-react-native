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

const AppButton = ({text, size, type, height, onPress}) => {
  const large = width / 1.3;
  const small = width / 2.5;
  const btnSize = size === 'sm' ? small : large;
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

  const textSyle = {
    color: btnTextColor,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[containerCommonStyle]}>
        <AppText customStyle={textSyle}>{text}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
