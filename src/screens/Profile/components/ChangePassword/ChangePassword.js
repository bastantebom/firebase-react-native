//import liraries
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';

import {
  PaddingView,
  ScreenHeaderTitle,
  AppInput,
  AppButton,
} from '@/components';
import {normalize} from '@/globals';
import FloatingAppInput from '@/components/AppInput/FloatingAppInput';

// create a component
const ChangePassword = ({toggleChangePassword}) => {
  const [cPass, setCPass] = useState('');
  const [nPass, setNPass] = useState('');
  const [fPass, setFPass] = useState('');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          padding: 24,
        }}>
        <ScreenHeaderTitle
          title="Current Password"
          close={toggleChangePassword}
        />

        <FloatingAppInput
          value={cPass}
          label="Current Password"
          onChangeText={(cPass) => {
            setCPass(cPass);
          }}
          customStyle={{marginTop: normalize(35), marginBottom: normalize(16)}}
        />
        <FloatingAppInput
          value={nPass}
          label="New Password"
          onChangeText={(nPass) => {
            setNPass(nPass);
          }}
          customStyle={{marginBottom: normalize(16)}}
        />
        <FloatingAppInput
          value={fPass}
          label="Confirm New Password"
          onChangeText={(fPass) => {
            setFPass(fPass);
          }}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            bottom: 0,
          }}>
          <AppButton
            text="Change Password"
            type="primary"
            height="xl"
            disabled={true}
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default ChangePassword;
