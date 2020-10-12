import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Dash from 'react-native-dash';
import Share from 'react-native-share';
import Clipboard from "@react-native-community/clipboard";

import {AppText, PaddingView, TabNavigation} from '@/components';
import {UserContext} from '@/context/UserContext';
import {Colors, normalize} from '@/globals';

import {
  HeaderBackGray,
  QRLink,
  QRDownload,
  QRShare,
} from '@/assets/images/icons';

const QRTab = () => {
  const {user} = useContext(UserContext);

  let logoFromFile = require('@/assets/images/logo.png');

  const copyHandler = () => {
    // console.log('copy to clipboard');
    // Clipboard.setString(`servbees://profile/${user.uid}`);
    Clipboard.setString(`servbees://profile/${user.uid}`);
  };

  const shareHandler = async () => {
    const shareOptions = {
      title: 'Share profile',
      url: `servbees://profile/${user.uid}`,
      failOnCancel: false,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error);
      setResult('error: '.concat(getErrorString(error)));
    }
  };

  return (
    <>
      <PaddingView paddingSize={4} style={{paddingBottom: 16}}>
        <View
          style={{
            elevation: 6,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            shadowColor: 'rgba(65, 65, 65, 0.2)',
            shadowOffset: {width: 0, height: 40},
            shadowRadius: 12,
            backgroundColor: 'white',
            position: 'relative',
          }}>
          <View style={{padding: normalize(65), paddingBottom: 0}}>
            <QRCode
              value={`servbees://profile/${user.uid}`}
              logo={logoFromFile}
              logoSize={normalize(60)}
              size={normalize(187)}
              color={'#1F1A54'}
            />
          </View>

          <View style={{marginTop: 16}}>
            <AppText textStyle="display6" customStyle={{textAlign: 'center'}}>
              Wayne Jansen Tayco
            </AppText>
          </View>

          <Dash
            style={{width: '100%', height: 1, marginVertical: 24}}
            dashLength={8}
            dashGap={4}
            dashColor={Colors.neutralGray}
            dashThickness={1.7}
          />

          <View style={{flex: 1, width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.secondarySolitude,
                maxWidth: normalize(260),
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <AppText
                customStyle={{
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  width: normalize(220),
                }}
                textStyle="caption">
                {`servbees://profile/${user.uid}`}
              </AppText>
              <TouchableOpacity activeOpacity={0.7} onPress={copyHandler}>
                <View
                  style={{
                    backgroundColor: Colors.primaryYellow,
                    height: normalize(40),
                    width: normalize(40),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <QRLink width={normalize(24)} height={normalize(24)} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 24}}>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <QRDownload width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1"
                  color={Colors.contentPlaceholder}
                  customStyle={{marginLeft: 4}}>
                  Save to device
                </AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={shareHandler}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 24,
                }}>
                <QRShare width={normalize(24)} height={normalize(24)} />
                <AppText
                  textStyle="body1"
                  color={Colors.contentPlaceholder}
                  customStyle={{marginLeft: 4}}>
                  Share
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </PaddingView>

      <AppText
        customStyle={{textAlign: 'center', paddingHorizontal: normalize(66)}}
        textStyle="body2">
        Your friends can scan this code to go to your Servbees profile.
      </AppText>
    </>
  );
};

const ScanTab = () => {
  return (
    <View>
      <AppText>Camera</AppText>
    </View>
  );
};

const QRScreen = ({toggleQR, signOut}) => {
  let routes = [
    {key: 'mycode', title: 'My Code', renderPage: <QRTab />},
    {key: 'scancode', title: 'Scan Code', renderPage: <ScanTab />},
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
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
                style={{position: 'absolute', left: 0}}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
            </View>
          </PaddingView>
          <TabNavigation routesList={routes} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRScreen;
