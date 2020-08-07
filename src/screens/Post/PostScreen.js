import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import {AppText, ScreenHeaderTitle} from '@/components';

import PostHeader from './components/PostHeader';
import {Colors, normalize} from '@/globals';
import { GuestPost } from './components/GuestPost';

import {UserContext} from '@/context/UserContext';

const PostScreen = ({togglePostModal, card}) => {

  const [showCancelModal, setShowCancelModal] = useState(false);
  const { user, signOut, isLoggedIn } = useContext(UserContext);

  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal);
  };

  const closeHandler = () => {
    cancelModalToggle();

    togglePostModal()
  };

  if (!isLoggedIn) {
    return (
      <GuestPost/>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.neutralsZircon}}>
      <View style={styles.container}>
        <ScreenHeaderTitle
          close={closeHandler}
          paddingSize={2}
          icon="close"
          title="Post"
        />

        {/* <PostHeader card={card} /> */}
      </View>

      <Modal
        isVisible={showCancelModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{
          margin: 0,
          height: normalize(300),
          width: normalize(300),
          alignItems: "center",
          justifyContent: 'center'
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'red',
            height: normalize(300),
            width: normalize(300),
          }}>
          <AppText>Hello</AppText>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors.neutralsZircon,
    flex: 1,
  },
});

export default PostScreen;
