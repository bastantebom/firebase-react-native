import React  from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { Hive } from '@/components/Hives';

function ProfileHives({ navigation }) {
  navigation.setOptions({
    title: 'HIVES LIST' // change to user's display name
  })

  return (
    <View style={styles.container}>
      <Hive/>
    </View>
  )
}

export default ProfileHives;

const styles = StyleSheet.create({
  // container: {
  //   // flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: '100%'
  // }
})