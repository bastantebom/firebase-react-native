//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText} from '@/components';
import {CloseDark} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {UserContext} from '@/context/UserContext';

// create a component
const HiddenPost = ({toggleHiddenPost}) => {
  const {userInfo} = useContext(UserContext);
  const {hidden_posts} = userInfo;
  console.log(userInfo);

  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle title="Block User List" close={toggleHiddenPost} />
        <View style={{marginTop: normalize(20)}}>
          {/* {hidden_posts.map((item, index) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  style={[styles.list]}
                  onPress={() => {
                    alert('Unblock this user?');
                  }}>
                  <View>
                    <AppText textStyle="caption">{item}</AppText>
                  </View>
                  <CloseDark />
                </TouchableOpacity>
              </View>
            );
          })} */}
        </View>
      </PaddingView>
      {/* About Servbees Modal */}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutralsZircon,
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderBottomColor: Colors.contentEbony,
    borderBottomWidth: 1,
  },
});

//make this component available to the app
export default HiddenPost;
