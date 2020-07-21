import React, { useRef, createRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import BottomSheet from 'reanimated-bottom-sheet';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import SlidePanel from '@/components/SlidingPanel';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

import SignUpWrapper from '@/screens/SignUp/SignUpWrapper';
import Colors from '@/globals/Colors';
import Login from '@/screens/login';
import SignUp from '@/screens/SignUp/SignUp';

import Polygon from '@/assets/images/polygon.svg';
import IllustOne from '@/assets/images/onboarding-img1.svg';
import IllustTwo from '@/assets/images/onboarding-img2.svg';
import IllustThree from '@/assets/images/onboarding-img3.svg';
import IllustFour from '@/assets/images/onboarding-img4.svg';

import { Context } from "@/context";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

let bottomSheetRef = createRef();

const Onboarding = ({ navigation, illustration }) => {
  const { sliderState, closeSlider, openSlider, authType, setAuthType } = useContext(Context);
  // const [authType, setAuthType] = useState('');

  useEffect(() => {
    if (authType === '') {
      return bottomSheetRef?.current.snapTo(1)
    }

    bottomSheetRef?.current.snapTo(1)

    setTimeout(() => {
      bottomSheetRef?.current.snapTo(0)
    }, 1500)

  }, [authType, setAuthType])


  const renderHeader = () => {
    return (
      <View style={{ backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: "center" }}>
        <View style={{ backgroundColor: "#EAEAEA", width: 40, height: 5, marginVertical: 8 }} />
      </View>
    );
  }

  const renderContent = () => {
    if (authType === 'signup') {
      return (
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <SignUp />
        </View>
      );
    }
    if (authType === 'login') {
      return (
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <Login />
        </View>
      );
    }
  }



  if (sliderState === 'close') {
    bottomSheetRef?.current.snapTo(1)
  }

  const clickHandler = () => {
    openSlider();
    // _panel.current.show();
    bottomSheetRef?.current.snapTo(0)
  };

  const closeHandler = () => {
    openSlider();
    // _panel.current.hide();
    bottomSheetRef?.current.snapTo(1)
  };

  const animation = new Animated.Value(0);

  const rotation = animation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['15deg', '60deg', '74.35deg', '97.93deg'],
  });

  const onSwipe = (index) => {
    Animated.timing(animation, {
      toValue: index,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const [slideInfo] = useState([
    {
      illustration: <IllustOne width={width} height={width * .8} />,
      title: 'Welcome to Servbees!',
      description:
        'Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!',
    },
    {
      illustration: <IllustTwo width={width} height={width * .8}  />,
      title: 'Discover and Buy',
      description:
        'Looking for something in particular? Discover nearby options and get the best deals for goods and services.',
    },
    {
      illustration: <IllustThree width={width} height={width * .8}  />,
      title: 'Offer and Sell',
      description:
        'Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!',
    },
    {
      illustration: <IllustFour width={width} height={width * .8}  />,
      title: 'Join a Hive',
      description:
        'Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!',
    },
  ]);

  console.log("Auth Type: " + authType)

  return (
    <>
      <View style={styles.contentHolder}>
        <Animated.View
          style={[{ transform: [{ rotate: rotation }] }, styles.bgImageHolder]}>
          <Polygon height={height * 1.2} />
        </Animated.View>
        <TouchableOpacity
          onPress={() => navigation.push('Dashboard')}
          style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <View style={styles.swiperHolder}>
          <Swiper
            dot={<View style={styles.dot} />}
            activeDot={<View style={[styles.dot, styles.dotActive]} />}
            loop={false}
            onIndexChanged={onSwipe}>
            {slideInfo.map((item, i) => {
              return (
                <View key={i} style={styles.slideHolder}>

                  <View style={{ zIndex: 100, width: "100%"}}>
                    {item.illustration}
                  </View>
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
            onPress={() => {
              clickHandler();
              setAuthType('login');
              bottomSheetRef.current.snapTo(0)
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
              bottomSheetRef.current.snapTo(0)
              console.log(bottomSheetRef)
            }}
          />
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['85%', '0%']}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
      />

      {/* {authType === 'signup' ? <SignUpWrapper /> : <Login />} */}

    </>
  );
};


const styles = StyleSheet.create({
  contentHolder: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.primaryMidnightBlue,
  },
  swiperHolder: {
    flex: 3,
  },
  slideHolder: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  link: {
    alignSelf: 'flex-end',
    paddingVertical: Platform.OS === "ios" ? 40 : 16,
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
    marginBottom: height > 700 ? height * .3 : height * .18,
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  bgImageHolder: {
    position: 'absolute',
    bottom: 65,
    right: -width * 0.4,
  },
  text: {
    textAlign: 'center',
  },
  btnHolder: {
    position: 'absolute',
    top: height * 0.85,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
});

export default Onboarding;
