//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppColor from '@/globals/Colors';
import {useNavigation} from '@react-navigation/native';
import AppButton from '@/components/AppButton';

// create a component
const VerifyAccount = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppButton
        text="Go Back to Dashboard"
        onPress={() => navigation.push('Onboarding')}
        height="lg"
        type="primary"
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
  },
});

//make this component available to the app
export default VerifyAccount;
