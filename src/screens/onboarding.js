import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import SlidePanel from '@/components/SlidingPanel';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

import SignUp from '@/screens/SignUp';
import Colors from '@/globals/Colors';

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  slideHolder: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: Colors.primaryMidnightBlue,
  },
  link: {
    alignSelf: 'flex-end',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  textHolder: {
    padding: 15,
  },
  dot: {
    backgroundColor: Colors.neutralsWhite,
    width: 8,
    height: 8,
    borderRadius: 100,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: height - 590,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  image: {
    position: 'absolute',
    top: -100,
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  btnHolder: {
    position: 'absolute',
    top: height - 130,
    // bottom: '10%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
});

const Onboarding = ({ navigation }) => {
  const [authType, setAuthType] = useState('signup');
  const _panel = useRef(null);

  const clickHandler = () => {
    _panel.current.show();
  };

  const [slideInfo] = useState([
    {
      image: require('../images/onboarding-img1.png'),
      title: 'Welcome to Servbees!',
      description:
        'Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!',
    },
    {
      image: require('../images/onboarding-img2.png'),
      title: 'Discover and Buy',
      description:
        'Looking for something in particular? Discover nearby options and get the best deals for goods and services.',
    },
    {
      image: require('../images/onboarding-img3.png'),
      title: 'Offer and Sell',
      description:
        'Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!',
    },
    {
      image: require('../images/onboarding-img4.png'),
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
          <>
            <Swiper
              dot={<View style={styles.dot} />}
              activeDot={<View style={[styles.dot, styles.dotActive]} />}>
              {slideInfo.map((item, i) => {
                return (
                  <View key={i} style={styles.slideHolder}>
                    <Image
                      source={require('../images/polygon.png')}
                      style={styles.image}
                    />
                    <TouchableOpacity
                      onPress={() => navigation.push('Dashboard')}
                      style={styles.link}>
                      <AppText textStyle="body2">Skip</AppText>
                    </TouchableOpacity>
                    <Image source={item.image} />
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
          </>
        }>
        {authType === 'signup' ? (
          <SignUp />
        ) : (
            <AppText textStyle="body1">Log in</AppText>
          )}
      </SlidePanel>
    </>
  );
};

export default Onboarding;
