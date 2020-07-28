import React from 'react';
import {View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {Divider} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

import {AppText, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';

import {HeaderBackGray} from '@/assets/images/icons';

const OwnMenu = ({toggleQR, signOut}) => {
  let logoFromFile = require('@/assets/images/logo.png');
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: 24,
            borderTopEndRadius: 8,
            borderTopStartRadius: 8,
          }}>
          <PaddingView paddingSize={3}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 32,
              }}>
              <TouchableOpacity
                onPress={toggleQR}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0}}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">QR CODE</AppText>
            </View>
          </PaddingView>

          <QRCode value="http://awesome.lissnk.qr" logo={logoFromFile} logoSize={40} logoBackgroundColor={"red"}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnMenu;
