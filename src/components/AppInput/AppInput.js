//import liraries
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import AppColor from '@/globals/Colors';

// create a component
const AppInput = (props, {children}) => {
  const [isActive, setIsActive] = useState(false);

  const onFocus = () => {
    //alert('Focus');
    setIsActive(true);
  };

  const onBlur = () => {
    //alert('Blur');
    setIsActive(false);
  };

  const borderColor = isActive ? AppColor.contentOcean : AppColor.neutralGray;

  const inputContainer = {
    borderRadius: 4,
    height: 53,
    overflow: 'hidden',
    borderColor: borderColor,
    borderWidth: 1,
  };

  return (
    <View style={{...inputContainer, ...props.customStyle}}>
      <TextInput
        onBlur={onBlur}
        onFocus={onFocus}
        underlineColorAndroid="transparent"
        {...props}
        style={[styles.appInput, {...props.style}]}
        theme={{
          colors: {
            primary: AppColor.contentOcean,
          },
          fonts: {
            medium: 'RoundedMplus1c-Medium',
          },
        }}>
        {children}
      </TextInput>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  appInput: {
    height: 55,
    overflow: 'hidden',
    backgroundColor: AppColor.neutralWhite,
    fontSize: 16,
  },
});

//make this component available to the app
export default AppInput;
