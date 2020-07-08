import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import AppText from '../components/AppText/AppText';
import AppButton from '../components/AppButton';


const styles = StyleSheet.create({
  container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center'
 }
})

function Dashboard ({ navigation }) {

  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Dashboard </AppText>
      <AppButton
        text="Go back to onboarding"
        onPress={() => navigation.goBack()}
        type="primary"
        size="sm"
      />
    </View>
  )
}

export default Dashboard;