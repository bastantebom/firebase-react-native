import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper'

const styles = StyleSheet.create({
sample: {
  fontFamily: "MPLUSRounded1c-Light"
},
 slideHolder: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 },
 title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center'
  },
 text: {
    maxWidth: '80%',
    textAlign: 'center'
 },
 dot: {
  backgroundColor:'#fff', 
  width: 8, 
  height: 8, 
  borderRadius: 4, 
  marginLeft: 3, 
  marginRight: 3, 
  marginTop: 3, 
  marginBottom: 3
 },
 dotActive: {
   backgroundColor: '#1f1A54'
 }
})

const Onboarding = () => {
  return (
    <Swiper
      dot ={
        <View style={styles.dot} />
      }
      activeDot ={
        <View style={[styles.dot, styles.dotActive]} />
      }
    >
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
  )
}

export default Onboarding


