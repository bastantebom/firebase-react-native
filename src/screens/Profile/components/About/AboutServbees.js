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
            <AppText textStyle="body2">Some text here or tagline</AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </AppText>
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
