import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';

import AppText from '../components/AppText/AppText';
import AppButton from '../components/AppButton';
import Colors from '../globals/Colors';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center'
 }
})

const Dashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Dashboard </AppText>
      <AppButton
        text="Go back to onboarding"
        onPress={() => navigation.goBack()}
        bordered = {true}
        size = 'small'
      />
    </View>
  )
}

export default Dashboard