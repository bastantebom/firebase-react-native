//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '@/globals';

// create a component
const Post = () => {
  return (
    <View style={styles.container}>
      <Text>Post</Text>
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
export default Post;
