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
import AppText from '../components/AppText/AppText';
import Colors from '../globals/Colors' 

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

  console.log("hello")
  console.log(Colors.primaryYellow)

  return (
    <View>
      <View>
        <AppText textStyle="display6" > Hello from app text </AppText> 
        <Text style={styles.sample}>Welcome to Servbees!</Text>
        <Text>Find and offer goods, plus services, within your community. Pasabuy? Pabili? Easier on Servbees!</Text>
      </View>
      <View>
        <Text>Discover and Buy</Text>
        <Text>Looking for something in particular? Discover nearby options and get the best deals for goods and services.</Text>
      </View>
      <View>
        <Text>Offer and Sell</Text>
        <Text>Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!</Text>
      </View>
      <View>
        <Text>Join a Hive</Text>
        <Text>Join our Hives to connect with people with the same interests and needs. Create your own HIves to organize your offers!</Text>
      </View>
    </View>
  )
}

export default Onboarding


