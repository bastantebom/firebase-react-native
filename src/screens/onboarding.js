import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import Swiper from 'react-native-swiper';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import SlidePanel from '@/components/SlidingPanel';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

import SignUpWrapper from '@/screens/SignUp/SignUpWrapper';
import Colors from '@/globals/Colors';
import Login from '@/screens/login';

import Polygon from '@/assets/images/polygon.svg';
import IllustOne from '@/assets/images/onboarding-img1.svg';
import IllustTwo from '@/assets/images/onboarding-img2.svg';
import IllustThree from '@/assets/images/onboarding-img3.svg';
import IllustFour from '@/assets/images/onboarding-img4.svg';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  contentHolder: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.primaryMidnightBlue
  },
  swiperHolder: {
    flex: 3,
  },
  slideHolder: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: "transparent",
    overflow: 'hidden'
  },
  link: {
    alignSelf: 'flex-end',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  textHolder: {
    position: 'relative',
    zIndex: 5,
    padding: 15,
  },
  dot: {
    zIndex: 5,
    width: 8,
    height: 8,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: height * .22,
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  bgImageHolder: {
    position: 'absolute',
    bottom: 65,
    right: -width * .4
  },
  text: {
    textAlign: 'center',
  },
  btnHolder: {
    position: 'absolute',
    top: height * .85,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: 'transparent'
  },
});

const Onboarding = ({ navigation, illustration }) => {
  const [authType, setAuthType] = useState('signup');
  const _panel = useRef(null);
  const clickHandler = () => {
    _panel.current.show();
  };
  const animation = new Animated.Value(0);

  const rotation = animation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['15deg', '60deg', '74.35deg', '97.93deg']
  });

  const onSwipe = (index) => {
    Animated.timing(animation, {
      toValue: index, duration: 200, easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }

  const [slideInfo] = useState([
    {
      illustration: <IllustOne />,
      title: 'Welcome to Servbees!',
      description:
        'Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!',
    },
    {
      illustration: <IllustTwo />,
      title: 'Discover and Buy',
      description:
        'Looking for something in particular? Discover nearby options and get the best deals for goods and services.',
    },
    {
      illustration: <IllustThree />,
      title: 'Offer and Sell',
      description:
        'Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!',
    },
    {
      illustration: <IllustFour />,
      title: 'Join a Hive',
      description:
        'Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!',
    },
  ]);

  return (
    <>
      <SlidePanel
        ref={_panel}
        content={
          <View style={styles.contentHolder}>
            <Animated.View
              style={[{ transform: [{ rotate: rotation }] }, styles.bgImageHolder]}
            >
              <Polygon height={height * 1.2} />
            </Animated.View>
            <View style={styles.swiperHolder}>
              <Swiper
                dot={<View style={styles.dot} />}
                activeDot={<View style={[styles.dot, styles.dotActive]} />}
                loop={false}
                onIndexChanged={onSwipe}>
                {slideInfo.map((item, i) => {
                  return (
                    <View key={i} style={styles.slideHolder}>
                      <TouchableOpacity
                        onPress={() => navigation.push('Dashboard')}
                        style={styles.link}>
                        <AppText textStyle="body2">Skip</AppText>
                      </TouchableOpacity>
                      <View style={{ zIndex: 100 }}>{item.illustration}</View>
                      <AppText textStyle="display6">{item.title}</AppText>
                      <View style={styles.textHolder}>
                        <AppText textStyle="body2" customStyle={styles.text}>
                          {item.description}
                        </AppText>
                      </View>
                    </View>
                  );
                })}
              </Swiper>
            </View>
            <View style={styles.btnHolder}>
              <AppButton
                text="Login"
                type="tertiary"
                size="sm"
                height="xl"
                borderColor="primary"
                propsButtonCustomStyle=""
                onPress={() => {
                  clickHandler();
                  setAuthType('login');
                }}
              />
              <AppButton
                text="Sign Up"
                size="sm"
                height="xl"
                borderColor="primary"
                propsButtonCustomStyle=""
                onPress={() => {
                  clickHandler();
                  setAuthType('signup');
                }}
              />
            </View>
          </View>
        }>
      </SlidePanel>
    </>
  );
};

export default Onboarding;