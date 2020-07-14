import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import AppText from '@/components/AppText/AppText';
import AppColor from '@/globals/Colors';

// import FB from '../assets/images/icons/facebook.svg';
// import G from '../assets/images/icons/google.svg';

import FB from '@/assets/images/icons/facebook.svg';
import G from '@/assets/images/icons/google.svg';

const width = Dimensions.get('window').width;

const AppButton = ({
  text,
  type,
  height,
  size,
  onPress,
  customStyle,
  icon,
  loading,
}) => {
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
        <View style={iconWrapper}>{!loading && <Text>{buttonIcon}</Text>}</View>
        {!loading && (
          <AppText customStyle={textSyle} textStyle="button2">
            {text}
          </AppText>
        )}
        {loading && (
          <ActivityIndicator
            animating={loading}
            size="small"
            color={AppColor.contentEbony}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
