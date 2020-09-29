import React, {useCallback, useState, createRef, useEffect} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText, FloatingAppInput} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';

import AppInput from '@/components/AppInput/AppInput';
import Validator from '@/components/AppInput/Validator';

import DebounceInput from 'react-native-debounce-input';
import VF from '@/components/AppInput/ValidationFunctions';
import {check} from 'react-native-permissions';

const SampleScreen = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [validator, setValidator] = useState('email');

  const [enabled, setEnabled] = useState(false);
  const inputRef = createRef();

  const [errors, setErrors] = useState({
    value1: {
      passed: false,
      shown: false,
      message: '',
    },
    value2: {
      passed: false,
      shown: false,
      message: '',
    },
  });

  const checkErrorState = () => {
    let temp = true;

    for (const [key, value] of Object.entries(errors)) {
      if (!value.passed) {
        temp = false;
        break;
      }
    }

    if (temp) {
      // ENABLE BUTTON
      setEnabled(true);
    } else {
      // DISABLE BUTTON
      setEnabled(false);
    }
  };

  useEffect(() => {
    checkErrorState();
  }, [errors]);

  // useEffect(() => {
  //   console.log(inputRef);
  // });

  const value1Handler = async (value1, validation) => {
    console.log(value1);
    setValue1(value1);

    if (validation === 'number')
      await VF.MobileNumberValidator(value1)
        .then(() => {
          console.log('tama to');
          setErrors({
            ...errors,
            value1: {
              passed: true,
              shown: false,
              message: '',
            },
          });
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            value1: {
              passed: false,
              shown: true,
              message: err,
            },
          });
        });

    if (validation === 'email')
      await VF.emailValidator(value1)
        .then(() => {
          console.log('tama to');
          setErrors({
            ...errors,
            value1: {
              passed: true,
              shown: false,
              message: '',
            },
          });
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            value1: {
              passed: false,
              shown: true,
              message: err,
            },
          });
        });
  };

  const value2Handler = async (value2) => {
    console.log(value2);
    setValue2(value2);
    await VF.emailValidator(value2)
      .then(() => {
        console.log('tama to');
        setErrors({
          ...errors,
          value2: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        console.log(err);
        setErrors({
          ...errors,
          value2: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppText>SAMPLE SCREEN 1</AppText>

      {/* <View style={{}}> */}
      <Validator errorState={errors.value1}>
        <AppInput
          label="Email"
          style={{marginTop: 20}}
          onChangeText={(value1) => value1Handler(value1, validator)}
          inputRef={inputRef}
          value={value1}
          keyboardType={'email-address'}
          onKeyPress={() => {
            setErrors({
              ...errors,
              value1: {
                ...errors.value1,
                shown: false,
              },
            });
          }}
        />
      </Validator>

      <Validator errorState={errors.value2} value={value2}>
        <AppInput
          label="Email"
          style={{marginTop: 20}}
          onChangeText={(value2) => value2Handler(value2)}
          value={value2}
          onKeyPress={() => {
            setErrors({
              ...errors,
              value2: {
                ...errors.value2,
                shown: false,
              },
            });
          }}
        />
      </Validator>
      {/* </View> */}
      <TouchableOpacity disabled={!enabled}>
        <View
          style={{
            backgroundColor: enabled ? 'yellow' : 'gray',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <AppText>Submit</AppText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          validator === 'email'
            ? setValidator('number')
            : setValidator('email');
          value1Handler(value1, validator);
        }}>
        <View
          style={{
            backgroundColor: 'yellow',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <AppText>change</AppText>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SampleScreen;
