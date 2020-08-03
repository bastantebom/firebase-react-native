//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// create a component
const Connections = ({navigation}) => {
  navigation.setOptions({
    title: 'Profile Name', // change to user's display name
  });

  return (
    <View style={styles.container}>
      <Text>This contains Following and Followers</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

//make this component available to the app
export default Connections;
