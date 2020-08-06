import React from 'react';
import {View, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';

import {AppText} from '@/components';

const PostScreen = ({togglePostModal}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={togglePostModal}>
          <AppText>HEllo POST SADS</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
});

export default PostScreen;
