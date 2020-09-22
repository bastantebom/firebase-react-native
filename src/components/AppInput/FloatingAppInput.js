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

// create a component
const FloatingAppInput = (props) => {
  const {
    value,
    placeholder,
    label,
    validation = [],
    onChangeText,
    valueHandler,
    setError,
    error,
    setButtonState,
    onInputFocus,
    onChangeTextInput,
    setChangingValidation,
    changingValidation,
    setValidationRule,
  } = props;

  const [internalValue, setInternalValue] = useState(value);

  const [verified, setVerified] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationError, setValidationError] = useState();
  const [isActive, setIsActive] = useState(false);
  const [labelPosition] = useState(new Animated.Value(0));

  const checkIndex = (arr) => {
    const index = error.indexOf(arr);
    return index;
  };

  // //console.log('Validation rules');
  // //console.log(validation);

  const onValueChange = (value) => {
    valueHandler(value);
    // //console.log('************************************************');
    setShowValidationError(true);
    // //console.log(value);
    // validateInput(value);

    // console.log(changingValidation);

    // console.log(validation);
    // console.log(validationError);

    inputDebounce(value);

    // //console.log('err', error.length);
    if (error.length > 0) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }

    onChangeTextInput ? onChangeTextInput(value) : null;
  };

  const inputDebounce = useCallback(
    debounce((value) => {
      // console.log('hello debounce');
      // console.log(value);
      validateInput(value);
    }, 1000),
    [],
  );

  const validateInput = (value) => {
    // //console.log("Validate input")
    setInternalValue(value);
    // console.log("Compare values")
    let currentError = error;

    console.log('VALIDATION:', validation);

    setValidationError();

    if (validation.includes('username'))
      ValidationFunctions.usernameValidator(value)
        .then((res) => {
          currentError = error;
          const index = checkIndex('username');
          currentError.splice(index, 1);

          setError(currentError);

          setShowValidationError(res);
          //console.log('username is valid');
          setVerified(true);
        })
        .catch((err) => {
          currentError = error;
          const index = checkIndex('username');
          if (index === -1) {
            currentError.push('username');
            setError(currentError);
          }

          setShowValidationError(false);
          //console.log('username is not valid');
          setVerified(false);
          setValidationError(err);
        });

    if (validation.includes('email')) {
      console.log('validating email?');
      ValidationFunctions.emailValidator(value)
        .then((res) => {
          currentError = error;
          const index = checkIndex('email');
          currentError.splice(index, 1);
          console.log('SUCCESS RESPONSE');
          console.log(res);

          // console.log('CURRENT ERR EMAIL');
          // console.log(currentError);
          setError(currentError);

          setShowValidationError(res);
          // //console.log('email is valid');
        })
        .catch((err) => {
          // console.log('CURRENT ERR EMAIL');
          // console.log(currentError);
          currentError = error;
          const index = checkIndex('email');
          if (index === -1) {
            currentError.push('email');
            setError(currentError);
          }

          // show validation error text
          setShowValidationError(false);

          // set validation message.
          setValidationError(err);
          console.log(err);
        });
    }

    if (validation.includes('number'))
      ValidationFunctions.MobileNumberValidator(value)
        .then((res) => {
          currentError = error;
          const index = checkIndex('number');
          currentError.splice(index, 1);
          setError(currentError);

          setShowValidationError(res);
          //console.log('number is valid');
        })
        .catch((err) => {
          currentError = error;
          const index = checkIndex('number');
          if (index === -1) {
            currentError.push('number');
            setError(currentError);
          }

          //console.log(validationError);
          setShowValidationError(false);
          // //console.log('number is invalid');
          setValidationError(err);
          console.log(err);
        });

    if (validation.includes('password'))
      ValidationFunctions.PasswordValidator(value)
        .then((res) => {
          currentError = error;
          const index = checkIndex('password');
          currentError.splice(index, 1);
          setError(currentError);

          setShowValidationError(res);
          //console.log('password is valid');
        })
        .catch((err) => {
          currentError = error;
          const index = checkIndex('password');
          if (index === -1) {
            currentError.push('password');
            setError(currentError);
          }

          //console.log(validationError);
          setShowValidationError(false);
          //console.log('password is not valid');
          setValidationError(err);
          //console.log(err);
        });
  };

  useEffect(() => {
    console.log('Validation Current:', validation);
    // setValidationError('');
    if (setValidationRule)
      changingValidation
        ? setValidationRule(['email'])
        : setValidationRule(['number']);
  }, [changingValidation]);

  const onFocusInput = () => {
    setIsActive(true);
    animateFocus();

    onInputFocus ? onInputFocus() : null;
  };

  const onBlurInput = () => {
    setIsActive(false);
    animateBlur();
  };

  useEffect(() => {
    setShowValidationError(true);

    // //console.log('Value useeffect');
    // //console.log(value);

    if (value !== '' && (value !== undefined || placeholder !== undefined)) {
      animateFocus();
    }
  }, [value, placeholder, validation]);

  const animateFocus = () => {
    Animated.timing(labelPosition, {
      toValue: normalize(-10),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animateBlur = () => {
    // //console.log('Animate blur');
    // //console.log(value);
    if (placeholder === undefined && (value === undefined || value === '')) {
      //console.log('Animate blur condition');
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
          onChangeText={onValueChange}
          {...props}
          style={styles.floatingInput}
          underlineColorAndroid="transparent"
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          blurOnSubmit
        />
        <View style={styles.passwordToggle}>
          {verified ? (
            <VerifiedGreen width={normalize(16)} height={normalize(16)} />
          ) : null}
        </View>
      </View>
      {validation.length > 0 && (
        <AppText
          customStyle={{
            marginLeft: normalize(16),
            display: showValidationError ? 'none' : 'flex',
          }}
          textStyle="metadata"
          color={'red'}>
          {validationError}
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

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
});

//make this component available to the app
export default FloatingAppInput;
