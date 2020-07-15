//import liraries
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import AppColor from '@/globals/Colors';

// create a component
const AppInput = (props) => {
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
    height: 56,
    overflow: 'hidden',
    borderColor: borderColor,
    borderWidth: 1,
  };

  return (
    <View style={{...inputContainer, ...props.customStyle}}>
      <TextInput
        onBlur={onBlur}
        onFocus={onFocus}
        {...props}
        style={styles.appInput}
        theme={{
          colors: {
            primary: AppColor.contentOcean,
          },
          fonts: {
            medium: 'RoundedMplus1c-Medium',
          },
        }}
      />
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
