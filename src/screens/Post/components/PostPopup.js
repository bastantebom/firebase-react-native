import React, {useRef, createRef, useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

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
import {UserContext} from '@/context/UserContext';
import {PostScreen} from '@/screens/Post';

const height = Dimensions.get('window').height;

const Post = ({  }) => {

  const navigation = useNavigation();
  const { isLoggedIn } = useContext(UserContext);

  const {showButtons, openPostButtons, closePostButtons} = useContext(Context);

  const animation = new Animated.Value(showButtons ? 0 : 1);

  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');

  const togglePostModal = () => {
    setShowPostModal(!showPostModal);
  };

  // const rotation = animation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['45deg', '0deg'],
  // });

  const [spinValue] = useState(new Animated.Value(0));

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: showButtons ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [showButtons]);

  const selectCard = (card) => {
    closePostButtons();
    setSelectedCard(card);
    setTimeout(() => {
      setShowPostModal(true);
    }, 300);
  };

  let CrossButtonAnimationStyle = {
    transform: [{rotate: spin}],
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={ isLoggedIn ? (showButtons ? closePostButtons : openPostButtons) : (() => navigation.navigate('Post')) }
          >
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
            <Animated.View style={[CrossButtonAnimationStyle, styles.plusIcon]}>
              <PostPlus width={normalize(16)} height={normalize(16)} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={ isLoggedIn ? (showButtons ? closePostButtons : openPostButtons) : (() => navigation.navigate('Post')) }
          >
          <AppText
            textStyle="nav"
            customStyle={showButtons ? {color: '#1F1A54'} : {color: '#8C8B98'}}>
            Post
          </AppText>
        </TouchableWithoutFeedback>
      </View>

      <Modal
        isVisible={showButtons}
        animationIn="slideInUp"
        animationInTiming={200}
        animationOut="slideOutRight"
        animationOutTiming={100}
        style={{
          margin: 0,
          backgroundColor: 'transparent',
          height: Dimensions.get('window').height,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => closePostButtons()}>
            <View style={{flex: 1, backgroundColor: 'transparent'}} />
          </TouchableWithoutFeedback>
        }>
        <PopupButtons
          selectCard={selectCard}
          closePostButtons={closePostButtons}
        />
      </Modal>
      <Modal
        isVisible={showPostModal}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <PostScreen togglePostModal={togglePostModal} card={selectedCard} />
      </Modal>
    </>
  );
};

const PopupButtons = ({selectCard, closePostButtons}) => {
  const [viewOpacity] = useState(new Animated.Value(0));

  const [serviceButton] = useState(new Animated.Value(130 + 70));
  const [sellButton] = useState(new Animated.Value(65 + 70));
  const [needButton] = useState(new Animated.Value(70));

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(viewOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),

        Animated.timing(serviceButton, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),

        Animated.timing(sellButton, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(needButton, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }, 200);
  }, []);

  let AnimationStyle = {
    opacity: viewOpacity,
  };

  let ServiceAnimationStyle = {
    transform: [{translateY: serviceButton}],
  };

  let SellAnimationStyle = {
    transform: [{translateY: sellButton}],
  };

  let NeedAnimationStyle = {
    transform: [{translateY: needButton}],
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(serviceButton, {
          toValue: 130 + 70,
          duration: 300,
          useNativeDriver: false,
        }),

        Animated.timing(sellButton, {
          toValue: 65 + 70,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(needButton, {
          toValue: 70,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(viewOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    setTimeout(() => {
      closePostButtons();
    }, 300);
  };

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <SafeAreaView style={{flex: 1}}>
        <Animated.View
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 65,
              backgroundColor: 'transparent',
            },
          ]}>
          {/* <LinearGradient
            style={{
              position: 'absolute',
              bottom: 45,
              height: height,
              width: '100%',
            }}
            colors={[
              'rgba(255,255,255, 0)',
              'rgba(255,255,255, 1)',
              'rgba(255,255,255, .7)',
              'rgba(255,255,255, 0)',
            ]}
            start={{x: 0.5, y: 0.3}}
            locations={[0.1, 0.8, 0.96, 1]}
          /> */}
          <Animated.View
            style={[
              {
                alignItems: 'center',
                // backgroundColor: 'red',
                width: '100%',
                overflow: 'hidden',
              },
              AnimationStyle,
            ]}>
            <Animated.View style={ServiceAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.pink]}
                onPress={() => {
                  selectCard('need');
                }}>
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
            </Animated.View>

            <Animated.View style={SellAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.blue]}
                onPress={() => {
                  selectCard('sell');
                }}>
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
            </Animated.View>
            <Animated.View style={NeedAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.green]}
                onPress={() => {
                  selectCard('post');
                }}>
                <View style={styles.iconHolder}>
                  <PostNeed width={normalize(25)} height={normalize(25)} />
                </View>
                <AppText textStyle="body2" customStyle={styles.btnText}>
                  {' '}
                  Post What You Need
                </AppText>
                <View style={styles.exampleHolder}>
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
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
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
    height: normalize(50),
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
