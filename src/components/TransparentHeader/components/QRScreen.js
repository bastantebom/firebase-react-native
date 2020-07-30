import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AppText, PaddingView, TabNavigation } from '@/components';
import { Colors, normalize } from '@/globals';

import { HeaderBackGray } from '@/assets/images/icons';

const QRTab = () => {
  let logoFromFile = require('@/assets/images/logo.png');

  return (
    <View
      style={{
        elevation: 9,
        padding: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        padding: normalize(66),
        shadowRadius: 12,
        backgroundColor: 'white',
        position: 'relative',
      }}>
      <QRCode
        value="http://awesome.lissnk.qr"
        logo={logoFromFile}
        logoSize={normalize(60)}
        size={normalize(187)}
        color={'#1F1A54'}
      />
      <View>
        <AppText textStyle="display6">Wayne Jansen Tayco</AppText>
      </View>

      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'white',
          position: 'absolute',
          left: -25,
          bottom: -25,
          zIndex: 5,
        }}
      />

      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'white',
          position: 'absolute',
          right: -25,
          bottom: -25,
          zIndex: 5,
        }}
      />
    </View>
  )
}

const ScanTab = () => {
  return (
    <View>
      <AppText>Camera</AppText>
    </View>
  )
}

const OwnMenu = ({ toggleQR, signOut }) => {

  let routes = [
    { key: 'mycode', title: 'My Code', renderPage: <QRTab /> },
    { key: 'scancode', title: 'Scan Code', renderPage: <ScanTab /> },
  ]


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <PaddingView paddingSize={3}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={toggleQR}
                activeOpacity={0.7}
                style={{ position: 'absolute', left: 0 }}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
            </View>
          </PaddingView>
          <TabNavigation routesList={routes} />


        </View>

        <View style={{ position: 'relative', backgroundColor: 'red', flex: 1, width: '100%' }}>
          <View
            style={{ backgroundColor: 'white', zIndex: 0, position: 'absolute' }}>
            <AppText>asd</AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default OwnMenu;
