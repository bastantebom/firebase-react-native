import React, {useCallback, useState, createRef, useEffect} from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {AppText, FloatingAppInput} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';

import AppInput from '@/components/AppInput/AppInput2';
import Validator from '@/components/AppInput/Validator';

import DebounceInput from 'react-native-debounce-input';
import VF from '@/components/AppInput/ValidationFunctions';
import {check} from 'react-native-permissions';

const SampleScreen = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

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
      console.log('true: walang mali');
      setEnabled(true);
    } else {
      console.log('false: may mali');
      setEnabled(false);
    }
  };

  useEffect(() => {
    checkErrorState();
  }, [errors]);

  const value1Handler = async (value1) => {
    console.log(value1);
    setValue1(value1);
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppText>SAMPLE SCREEN 1</AppText>

      {/* <View style={{}}> */}
      <Validator errorState={errors.value1}>
        <AppInput
          label="Email"
          style={{marginTop: 20}}
          onChangeText={(value1) => {
            console.log('typing');
            value1Handler(value1);
          }}
          minLength={1}
          value={value1}
          keyboardType={'email-address'}
          delayTimeout={1000}
        />
      </Validator>

      <Validator errorState={errors.value2} value={value2} >
        <AppInput
          label="Email"
          style={{marginTop: 20}}
          onChangeText={async (value2) => {
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
          }}
          value={value2}
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
    </SafeAreaView>
  );
};

export default SampleScreen;
