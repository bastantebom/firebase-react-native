import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { WebView } from 'react-native-webview'

import { AppText, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'

const PrivacyPolicy = ({ onClose }) => {
  const webViewJs = `
  document.querySelector('.show-card-mobile').style.display = 'none';
  document.querySelector('.cards-mobile').style.display = 'none';
  document.querySelector('.header').style.display = 'none';
  document.querySelector('.sub-title-holder').style.display = 'none';
  document.querySelector('.banner-wrapper').style.display = 'none';
  document.querySelector('.vector-dash').style.paddingTop = '0';
  document.querySelector('.section-cta').style.display = 'none';
  document.querySelector('.footer').style.display = 'none';
  true;
  `

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={onClose}
        title="Privacy Policy"
        paddingSize={3}
      />
      <WebView
        source={{ uri: 'https://servbees.com/privacy/' }}
        injectedJavaScript={webViewJs}
        startInLoadingState={true}
        onMessage={event => {}}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator color={Colors.primaryYellow} />
          </View>
        )}
      />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onClose}>
          <View style={styles.button}>
            <AppText textStyle="body2medium">Agree</AppText>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  buttonWrapper: {
    padding: normalize(24),
    height: normalize(60),
  },

  button: {
    height: normalize(49),
    borderColor: Colors.primaryMidnightBlue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default PrivacyPolicy
