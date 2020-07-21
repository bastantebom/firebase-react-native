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

import { Facebook, Google } from '@/assets/images/icons';

const width = Dimensions.get('window').width;

const AppButton = ({
  text,
  type,
  height,
  size,
  onPress,
  customStyle,
  icon,
  iconPosition,
  loading,
  disabled
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
    flex: 1,
    textAlign: 'center',
  };

  const iconWrapper = {
    // position: 'absolute',
    // alignItems: 'flex-start',
    // justifyContent: 'center',
    // left: 16,
    // top: 10
  };

  const buttonIcon = () => {
    if (icon === "Facebook") {
      return (
        <View>
          <Facebook />
        </View>
      );
    }

    if (icon === "Google") {
      return (
        <View>
          <Google />
        </View>
      );
    }

    return <View style={{ width: 24, height: 24 }} />;
  }

  const iconSpacer = () => {
    return <View style={{ width: 24, height: 24 }} />;
  }


  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={disabled}>
      <View style={{ ...containerCommonStyle, ...customStyle, paddingHorizontal: 16 }}>
        {/* <View style={iconWrapper}>{!loading && <Text> {buttonIcon}</Text>}</View> */}

        {iconPosition === 'left' ? buttonIcon() : iconSpacer()}

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

        {iconPosition === 'right' ? buttonIcon() : iconSpacer()}

      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
