//import liraries
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText} from '@/components';
import {CloseDark} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {UserContext} from '@/context/UserContext';
import PostService from '@/services/Post/PostService';

// create a component
const HiddenPost = ({toggleHiddenPost}) => {
  const {userInfo, user} = useContext(UserContext);
  const {hidden_posts} = userInfo;
  //console.log('_ ' + hidden_posts);
  const [hiddenPosts, setHiddenPosts] = useState(hidden_posts);
  const [selectedPost, setSelectedPost] = useState({});
  //console.log(JSON.stringify(hiddenPosts));
  const [showCancelModal, setShowCancelModal] = useState(false);
  const cancelModalToggle = (post) => {
    //console.log(title);
    setSelectedPost(post);
    setShowCancelModal(!showCancelModal);
  };

  const closeHandler = (value) => {
    setShowCancelModal(!showCancelModal);
  };

  const unHidePost = async () => {
    //body: { uid, pid }
    console.log('selected pid ' + selectedPost.pid);
    return await PostService.unHidePost({
      pid: selectedPost.pid,
      uid: user?.uid,
    }).then((res) => {
      if (res.success) {
        setHiddenPosts(res.hidden_posts);
      }
      //console.log(res);
      closeHandler();
    });
  };

  //console.log(hiddenPosts.length);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            title="Hidden Post List"
            close={toggleHiddenPost}
          />
          <View style={{marginTop: normalize(20)}}>
            {hiddenPosts && hiddenPosts.length > 0 ? (
              hiddenPosts.map((post, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={index % 2 === 0 ? styles.list : styles.list2}
                      onPress={() => {
                        cancelModalToggle(post);
                      }}>
                      <View>
                        <AppText textStyle="caption">{post.title}</AppText>
                      </View>
                      <CloseDark />
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <AppText textStyle="caption">
                You don't have any hidden post.
              </AppText>
            )}
          </View>
        </PaddingView>
        {/* About Servbees Modal */}
      </SafeAreaView>
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
            Unhide {selectedPost.title} ?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{textAlign: 'center'}}
            customStyle={{marginBottom: 16}}>
            Are you sure you want to unhide {selectedPost.title}?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              unHidePost();
            }}
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
    </>
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
    borderBottomColor: Colors.neutralsWhite,
    borderBottomWidth: 1,
  },
  list2: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutralsWhite,
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderBottomColor: Colors.neutralsWhite,
    borderBottomWidth: 1,
  },
});

//make this component available to the app
export default HiddenPost;
