import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';

import AppText from '../components/AppText/AppText';
import Colors from '../globals/Colors';

const styles = StyleSheet.create({
  slideHolder: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: Colors.primaryMidnightBlue,
  },
  link: {
    alignSelf: 'flex-end',
    padding: 20
  },
  textHolder: {
    padding: 15
  },
  dot: {
    backgroundColor: Colors.neutralsWhite,
    width: 8,
    height: 8,
    borderRadius: 100,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 120
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue
  },
  image: {
    position: 'absolute',
    top: -100,
    width: '100%',
  },
  text: {
    textAlign: 'center'
  }
})

const Onboarding = () => {
  return (
    <Swiper
      dot={
        <View style={styles.dot} />
      }
      activeDot={
        <View style={[styles.dot, styles.dotActive]} />
      }
    >
      <View style={styles.slideHolder}>
        <Image source={require('../images/polygon.png')} style={styles.image} />
        <TouchableOpacity onPress={() => null} style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <Image source={require('../images/onboarding-img1.png')} />
        <AppText textStyle="display6">Welcome to Servbees!</AppText>
        <View style={styles.textHolder}>
          <AppText textStyle="body2" customStyle={styles.text}>Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!</AppText>
        </View>
      </View>
      <View style={styles.slideHolder}>
        <Image source={require('../images/polygon.png')} style={styles.image} />
        <TouchableOpacity onPress={() => null} style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <Image source={require('../images/onboarding-img2.png')} />
        <AppText textStyle="display6" customStyle={styles.text}>Discover and Buy</AppText>
        <View style={styles.textHolder}>
          <AppText textStyle="body2" customStyle={styles.text}>Looking for something in particular? Discover nearby options and get the best deals for goods and services.</AppText>
        </View>
      </View>
      <View style={styles.slideHolder}>
        <Image source={require('../images/polygon.png')} style={styles.image} />
        <TouchableOpacity onPress={() => null} style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <Image source={require('../images/onboarding-img3.png')} />
        <AppText textStyle="display6">Offer and Sell</AppText>
        <View style={styles.textHolder}>
          <AppText textStyle="body2" customStyle={styles.text}>Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!</AppText>
        </View>
      </View>
      <View style={styles.slideHolder}>
        <Image source={require('../images/polygon.png')} style={styles.image} />
        <TouchableOpacity onPress={() => null} style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <Image source={require('../images/onboarding-img4.png')} />
        <AppText textStyle="display6">Join a Hive</AppText>
        <View style={styles.textHolder}>
          <AppText textStyle="body2" customStyle={styles.text}>Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!</AppText>
        </View>
      </View>
    </Swiper>
  )
}

export default Onboarding
