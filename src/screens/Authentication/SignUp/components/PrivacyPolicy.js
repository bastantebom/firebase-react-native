import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import LottieView from 'lottie-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { noop } from 'lodash'

import assetLoader from '@/assets/animations/asset-loader.json'
import { AppText, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'
import utilStyles from '@/globals/util-styles'

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

const PrivacyPolicy = ({ onClose }) => {
  const [webviewLoaded, setWebviewLoaded] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={onClose}
        title="Privacy Policy"
        paddingSize={3}
      />

      <View style={styles.content}>
        {!webviewLoaded && (
          <View
            style={[
              utilStyles.flex1,
              utilStyles.alignCenter,
              utilStyles.justifyCenter,
            ]}>
            <LottieView source={assetLoader} autoPlay style={styles.loader} />
          </View>
        )}

        <View
          style={{
            display: webviewLoaded ? 'flex' : 'none',
            flex: webviewLoaded ? 1 : 0,
          }}>
          <WebView
            source={{ uri: 'https://servbees.com/privacy/' }}
            injectedJavaScript={webViewJs}
            onMessage={noop}
            javaScriptEnabled={true}
            onLoadEnd={() => {
              setTimeout(() => {
                setWebviewLoaded(true)
              }, 300)
            }}
          />
        </View>
      </View>

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
    paddingHorizontal: normalize(24),
    height: normalize(60),
  },
  content: {
    flex: 1,
  },
  button: {
    height: normalize(49),
    borderColor: Colors.primaryMidnightBlue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: normalize(32),
    height: normalize(32),
  },
})
export default PrivacyPolicy
