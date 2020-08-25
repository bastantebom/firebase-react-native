//import liraries
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Animated} from 'react-native';
import {Colors, normalize} from '@/globals';
import AppText from '../AppText/AppText';
import ValidationList from './Validation';

// create a component
const FloatingAppInput = (props) => {
  const {value, placeholder, label, validation = []} = props;

  const [validationError, setValidationError] = useState();
  const [isActive, setIsActive] = useState(false);
  const [labelPosition] = useState(new Animated.Value(0));
  //const [font]

  // console.log(validation);
  // console.log(ValidationList[validation])

  const onFocusInput = () => {
    setIsActive(true);
    animateFocus();
  };

  const onBlurInput = () => {
    setIsActive(false);
    animateBlur();
  };

  useEffect(() => {
    if (value !== undefined || placeholder !== undefined) {
      animateFocus();
    }
  }, [value, placeholder]);

  const animateFocus = () => {
    Animated.timing(labelPosition, {
      toValue: normalize(-10),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animateBlur = () => {
    if (placeholder === undefined && value === undefined)
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
    !isActive && value === undefined && placeholder === undefined
      ? normalize(16)
      : normalize(12);

  const paddingLeftCustom = {
    paddingLeft: normalize(
      16 + (props.paddingLeftLabel ? props.paddingLeftLabel : 0),
    ),
  };
  /** VALIDATION HANDLER **/

  /** VALIDATION HANDLER **/

  return (
    <View
      style={{
        ...props.customStyle,
      }}>
      <View
        style={{
          paddingVertical: normalize(4),
          paddingHorizontal: normalize(16),
          borderColor: activeBorderColor,
          borderWidth: 1,
          borderRadius: 4,
          height: normalize(50),
        }}>
        <Animated.Text style={[styles.label, paddingLeftCustom, labelStyle]}>
          <AppText
            textStyle="body1"
            color={activeTextColor}
            customStyle={{fontSize: fontSize}}>
            {label}
          </AppText>
        </Animated.Text>
        <TextInput
          {...props}
          style={styles.floatingInput}
          underlineColorAndroid="transparent"
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          blurOnSubmit
        />
      </View>
      {validation.length > 0 && (
        <AppText
          customStyle={{marginLeft: normalize(16)}}
          textStyle="metadata"
          color={'red'}>
          Error Text
        </AppText>
      )}
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
    //paddingLeft: normalize(16),
  },
});

//make this component available to the app
export default FloatingAppInput;
