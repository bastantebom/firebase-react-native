//import liraries
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, StyleSheet, Animated} from 'react-native';
import {Colors, normalize} from '@/globals';
import AppText from '../AppText/AppText';
import ValidationList from './Validation';
import ValidationFunctions from './ValidationFunctions';
import {debounce} from 'lodash';
import _ from 'lodash';

import {VerifiedGreen} from '@/assets/images/icons';
import DebounceInput from 'react-native-debounce-input';

// create a component
const FloatingAppInput = ({value, style, placeholder, label, ...props}) => {
  const [labelPosition] = useState(new Animated.Value(0));
  const [isActive, setIsActive] = useState(false);

  const onFocusInput = () => {
    setIsActive(true);
    animateFocus();

    // onInputFocus ? onInputFocus() : null;
  };

  const onBlurInput = () => {
    setIsActive(false);
    animateBlur();
  };

  useEffect(() => {
    if (value !== '' && (value !== undefined || placeholder !== undefined)) {
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
    if (placeholder === undefined && (value === undefined || value === '')) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
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
    !isActive &&
    (value === undefined || value === '') &&
    placeholder === undefined
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
    <View style={style}>
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
        <DebounceInput
          minLength={1}
          delayTimeout={500}
          {...props}
          style={styles.floatingInput}
          underlineColorAndroid="transparent"
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          blurOnSubmit
        />
        {/* <View style={styles.passwordToggle}>
          {verified ? (
            <VerifiedGreen width={normalize(16)} height={normalize(16)} />
          ) : null}
        </View> */}
      </View>
      {/* {validation.length > 0 && (
        <AppText
          style={{
            marginLeft: normalize(16),
            display: showValidationError ? 'none' : 'flex',
          }}
          textStyle="metadata"
          color={'red'}>
          {validationError}
        </AppText>
      )} */}
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

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
});

//make this component available to the app
export default FloatingAppInput;
