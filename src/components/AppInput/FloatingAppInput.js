//import liraries
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Animated} from 'react-native';
import {Colors, normalize} from '@/globals';
import AppText from '../AppText/AppText';

// create a component
const FloatingAppInput = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [labelPosition] = useState(new Animated.Value(0));
  //const [font]

  const onFocus = () => {
    setIsActive(true);
    animateFocus();
  };

  const onBlur = () => {
    setIsActive(false);
    animateBlur();
  };

  useEffect(() => {
    //console.log(props.value);
    if (props.value !== '' && props.value !== undefined) {
      animateFocus();
    }
  }, [props.value]);

  const animateFocus = () => {
    Animated.timing(labelPosition, {
      toValue: normalize(-10),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animateBlur = () => {
    if (props.value === '' || props.value === undefined)
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
  };

  let labelStyle = {
    transform: [
      {
        translateY: labelPosition,
      },
    ],
  };

  const activeBorderColor = isActive ? Colors.contentOcean : Colors.neutralGray;
  const activeTextColor = isActive
    ? Colors.contentOcean
    : Colors.contentPlaceholder;

  const fontSize =
    !isActive && (props.value === undefined || props.value === '')
      ? normalize(16)
      : normalize(12);

  /** VALIDATION HANDLER **/

  /** VALIDATION HANDLER **/

  return (
    <View
      style={{
        paddingVertical: normalize(4),
        paddingHorizontal: normalize(16),
        borderColor: activeBorderColor,
        borderWidth: 1,
        borderRadius: 4,
        height: normalize(50),
        ...props.customStyle,
      }}>
      <Animated.Text style={[styles.label, labelStyle]}>
        <AppText
          textStyle="body1"
          color={activeTextColor}
          customStyle={{fontSize: fontSize}}>
          {props.label}
        </AppText>
      </Animated.Text>
      <TextInput
        {...props}
        style={styles.floatingInput}
        onFocus={onFocus}
        onBlur={onBlur}
        blurOnSubmit
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  floatingInput: {
    backgroundColor: Colors.neutralWhite,
    height: normalize(54),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    paddingVertical: normalize(4),
  },

  label: {
    position: 'absolute',
    paddingTop: normalize(12),
    paddingLeft: normalize(16),
  },
});

//make this component available to the app
export default FloatingAppInput;
