//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText} from '@/components';
import {normalize} from '@/globals';
import {AboutServbeesImage} from '@/assets/images';
import {ScrollView} from 'react-native-gesture-handler';

// create a component
const AboutServbees = ({toggleServbees}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle title="Servbees" close={toggleServbees} />
        <ScrollView>
          <View>
            <AboutServbeesImage width={Dimensions.width} />
          </View>
          <View>
            <AppText
              textStyle="body1medium"
              customStyle={{marginBottom: normalize(8)}}>
              Get to know Servbees
            </AppText>
            <AppText textStyle="body2">Are you a Buzzybee?</AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              If you’re a freelancer, seller, or service provider, we’re ready
              to connect you with other Buzzybees in the metro! And if you’re
              just looking for goods and services around your community for ease
              and convenience, we’ve got you covered as well.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Servbees is a mobile marketplace and gig hub, all rolled into one
              app. We help you find your market, book gigs, work flexibly, sell
              your goods, and earn — all in one app.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">Explore Servbees today!</AppText>
          </View>
        </ScrollView>
      </PaddingView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default AboutServbees;
