import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper'
import AppButton from '../components/AppButton';
import SlidePanel from '../components/SlidingPanel';

const styles = StyleSheet.create({
 slideHolder: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center'
  },
 text: {
    maxWidth: '80%',
    textAlign: 'center'
 }
})

const Onboarding = () => {
  return (
      <SlidePanel
        content={
          <>
            <Swiper>
              <View style={styles.slideHolder}>
                <Image source={require('../images/onboarding-img1.png')} />
                <Text style={styles.title}>Welcome to Servbees!</Text>
                <Text style={styles.text}>Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!</Text>
              </View>
              <View style={styles.slideHolder}>
                <Image source={require('../images/onboarding-img2.png')} />
                <Text style={styles.title}>Discover and Buy</Text>
                <Text style={styles.text}>Looking for something in particular? Discover nearby options and get the best deals for goods and services.</Text>
              </View>
              <View style={styles.slideHolder}>
                <Image source={require('../images/onboarding-img3.png')} />
                <Text style={styles.title}>Offer and Sell</Text>
                <Text style={styles.text}>Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!</Text>
              </View>
              <View style={styles.slideHolder}>
                <Image source={require('../images/onboarding-img4.png')} />
                <Text style={styles.title}>Join a Hive</Text>
                <Text style={styles.text}>Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!</Text>
              </View>
            </Swiper>
            <AppButton
              // style={{ position: 'absolute', bottom: 50, left: 0, right: 0 }}
              text={'Login'}
              onPress={() => _panel.current.show()}
            />
          </>
        }
      >
        <Text>content inside slider</Text>
      </SlidePanel>
  )
}

export default Onboarding
