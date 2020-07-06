import React from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const AppButton = ({
  text,
  onPress,
  type = 'filled',
  size = 'large',
  height = 'xs',
}) => {
  const large = width / 1.3;
  const small = width / 2;
  const btnSize = size === 'large' ? large : small;
  const btnBgColor = type === 'filled' ? '#FFD400' : 'transparent';
  const btnTextColor = '#2E3034';
  const btnBorderRadius = 3;
  const btnHeight =
    height === 'xs'
      ? 2
      : height === 's'
      ? 3
      : height === 'm'
      ? 4
      : height === 'l'
      ? 5
      : 6;

  const containerCommonStyle = {
    backgroundColor: btnBgColor,
    paddingVertical: btnHeight,
    width: btnSize,
    borderRadius: btnBorderRadius,
  };

  const textCommonStyle = {
    color: btnTextColor,
    fontSize: 14,
    textAlign: 'center',
  };

  const border = type === 'outlined' && {
    borderColor: '#2E3034',
    borderWidth: 1.5,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[containerCommonStyle, border]}>
        <Text style={[textCommonStyle]}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
