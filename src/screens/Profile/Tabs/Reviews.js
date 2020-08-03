//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Colors} from '@/globals';

// create a component
const Review = () => {
  return (
    <View style={styles.container}>
      <Text>Review</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.emptyStateBackground,
  },
});

//make this component available to the app
export default Review;
