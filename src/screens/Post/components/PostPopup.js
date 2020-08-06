import React, {useRef, createRef, useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import {AppText} from '@/components';
import {normalize} from '@/globals';
import {
  PostBG,
  PostPlus,
  PostNeed,
  PostSell,
  PostService,
} from '@/assets/images/icons';
import {Context} from '@/context';
import {PostScreen} from '@/screens/Post';

const height = Dimensions.get('window').height;

const Post = () => {
  const {showButtons, openPostButtons, closePostButtons} = useContext(Context);

  const animation = new Animated.Value(showButtons ? 0 : 1);

  const [showPostModal, setShowPostModal] = useState(false);

  const togglePostModal = () => {
    setShowPostModal(!showPostModal);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['45deg', '0deg'],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: showButtons ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [showButtons]);

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={showButtons ? closePostButtons : openPostButtons}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
            }}>
            <View style={{position: 'relative'}}>
              <PostBG width={normalize(40)} height={normalize(40)} />
            </View>
            <Animated.View
              style={[{transform: [{rotate: rotation}]}, styles.plusIcon]}>
              <PostPlus width={normalize(16)} height={normalize(16)} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <AppText
          textStyle="nav"
          customStyle={showButtons ? {color: '#1F1A54'} : {color: '#8C8B98'}}>
          Post
        </AppText>
        {showButtons && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: height * 0.1,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity style={[styles.button, styles.pink]}>
              <View style={styles.iconHolder}>
                <PostService width={normalize(25)} height={normalize(25)} />
              </View>
              <AppText textStyle="body2" customStyle={styles.btnText}>
                Offer Your Services
              </AppText>
              <View style={styles.exampleHolder}>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Plumbing
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Electrician
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blue]}>
              <View style={styles.iconHolder}>
                <PostSell width={normalize(25)} height={normalize(25)} />
              </View>
              <AppText textStyle="body2" customStyle={styles.btnText}>
                Sell Something
              </AppText>
              <View style={styles.exampleHolder}>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Gadget
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Plants
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Cake
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Mobile Phone
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Books
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.green]} onPress={togglePostModal}>
              <View style={styles.iconHolder}>
                <PostNeed width={normalize(25)} height={normalize(25)} />
              </View>
              <AppText textStyle="body2" customStyle={styles.btnText}>
                {' '}
                Post What You Need
              </AppText>
              <View style={styles.exampleHolder} >
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Looking for
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Available
                </AppText>
                <AppText textStyle="caption" customStyle={styles.exampleText}>
                  Photographer
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        isVisible={showPostModal}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={togglePostModal}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <PostScreen togglePostModal={togglePostModal} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    width: 340,
    borderRadius: 8,
    color: 'white',
    shadowColor: '#1f1a54',
    shadowOffset: {width: 2, height: 8},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  iconHolder: {
    marginRight: 12,
  },
  plusIcon: {
    position: 'absolute',
  },
  exampleHolder: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  pink: {
    backgroundColor: '#EA646C',
  },
  blue: {
    backgroundColor: '#3057BA',
  },
  green: {
    backgroundColor: '#00BB94',
  },
  btnText: {
    color: 'white',
  },
  exampleText: {
    color: 'white',
    paddingHorizontal: 5,
    opacity: 0.4,
  },
  boldText: {
    fontWeight: '700',
  },
});

export default Post;
