import React from 'react';
import {View, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';

import {AppText, ScreenHeaderTitle} from '@/components';

import PostHeader from './components/PostHeader';

const PostScreen = ({togglePostModal, card}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <ScreenHeaderTitle
          close={togglePostModal}
          paddingSize={2}
          icon="close"
          title="Post"
        />

        <PostHeader card={card} />
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
