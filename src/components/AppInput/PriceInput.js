import React, {createRef, useState} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import {AppText} from '@/components';
import {normalize} from '@/globals';

const PriceInput = ({styles, ...props}) => {
  const inputRef = createRef();
  const [value, setValue] = useState();

  const handleClick = () => {
    console.log('focus');
    // inputRef.focus();
    inputRef.current.focus();
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={[
        {
          // height: normalize(54),
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 4,
          paddingVertical: 4,
          paddingHorizontal: 16,
        },
        styles,
      ]}>
      <View>
        <AppText textStyle="body2">Price</AppText>
        <AppText textStyle="body2">PHP</AppText>
      </View>
      <TextInput
        style={constantStyles.floatingInput}
        value={value}
        ref={inputRef}
      />
    </TouchableOpacity>
  );
};

const constantStyles = {
  floatingInput: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(19),
    letterSpacing: 0.5,
    textAlign: 'right',
  },
};

export default PriceInput;
