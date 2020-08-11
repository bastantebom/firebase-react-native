//import liraries
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';

import {
  PaddingView,
  ScreenHeaderTitle,
  AppInput,
  AppButton,
} from '@/components';
import {normalize} from '@/globals';

// create a component
const ChangePassword = ({toggleChangePassword}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          padding: 24,
        }}>
        <ScreenHeaderTitle
          title="Change Password"
          close={toggleChangePassword}
        />

        <AppInput
          label="Current Password"
          customStyle={{marginBottom: normalize(16), marginTop: 40}}
        />
        <AppInput
          label="New Password"
          customStyle={{marginBottom: normalize(16)}}
        />
        <AppInput
          label="Confirm Password"
          customStyle={{marginBottom: normalize(16)}}
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
