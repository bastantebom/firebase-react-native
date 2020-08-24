import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {AppText, ScreenHeaderTitle} from '@/components';

import PostHeader from './components/PostHeader';
import {Colors, normalize} from '@/globals';
import {GuestPost} from './components/GuestPost';
import {Context} from '@/context';
import {UserContext} from '@/context/UserContext';

const PostScreen = ({togglePostModal, card}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {user} = useContext(UserContext);
  const {setPostImage, setImageCount, setImageCurrent} = useContext(Context);

  const cancelModalToggle = () => {
    setShowCancelModal(!showCancelModal);
    setPostImage([]);
    setImageCount(0);
    setImageCurrent('');
  };
  const closeHandler = (value) => {
    if (value === 'continue') {
      cancelModalToggle();
      setTimeout(() => {
        togglePostModal();
      }, 200);
    }

    cancelModalToggle();
  };

  if (!user) {
    return <GuestPost />;
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
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: Colors.neutralsZircon,
            width: normalize(375),
          }}
          // extraScrollHeight={25}
          keyboardOpeningTime={100}
          keyboardShouldPersistTaps={'handled'}
          enableOnAndroid={true}>
          <PostHeader card={card} togglePostModal={togglePostModal} />
        </KeyboardAwareScrollView>
      </View>

      <Modal
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={450}
        animationOut="bounceOut"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{marginBottom: 16}}>
            Cancel Post?
          </AppText>

          <AppText textStyle="caption" customStyle={{textAlign: 'center'}}>
            You haven't finished your post yet.
          </AppText>
          <AppText
            textStyle="caption"
            customStyle={{textAlign: 'center'}}
            customStyle={{marginBottom: 16}}>
            Do you want to leave without finishing?
          </AppText>

          <TouchableOpacity
            onPress={() => closeHandler('continue')}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Continue</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => closeHandler('cancel')}
            style={{paddingVertical: 14, width: '100%', alignItems: 'center'}}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
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
