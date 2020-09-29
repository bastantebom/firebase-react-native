//import liraries
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Context} from '@/context';
import {UserContext} from '@/context/UserContext';
import {
  ScreenHeaderTitle,
  Notification,
  TransitionIndicator,
  FloatingAppInput,
  AppButton,
} from '@/components';

// create a component
const AddAddress = ({toggleAddAddress}) => {
  const [IS_LOADING, setIS_LOADING] = useState(false);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {/* <Notification message={notificationMessage} type={notificationType} /> */}
        <TransitionIndicator loading={IS_UPDATING} />

        <View
          style={{
            flex: 1,
            padding: 24,
          }}>
          <ScreenHeaderTitle title="Add an Address" close={toggleAddAddress} />

          <FloatingAppInput
            label="Name"
            placeholder="ex. My Home"
            customStyle={{
              marginTop: normalize(35),
              marginBottom: normalize(16),
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
              disabled={buttonDisable}
              customStyle={buttonStyle}
              onPress={() => {
                onSaveHandler();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default AddAddress;
