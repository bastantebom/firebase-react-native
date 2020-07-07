import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import AppText from '../components/AppText/AppText'

const Onboarding = () => {
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

const styles = StyleSheet.create({
  sample: {
    fontFamily: "MPLUSRounded1c-Light"
  }
});

export default Onboarding


