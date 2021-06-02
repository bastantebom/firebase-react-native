import React from 'react'
import { SafeAreaView, View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'

const PrivacyPolicy = ({ togglePrivacyPolicy }) => {
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
        close={togglePrivacyPolicy}
        title="Privacy Policy"
        paddingSize={3}
      />
      <WebView
        source={{ uri: 'https://servbees.com/privacy/' }}
        injectedJavaScript={webViewJs}
        onMessage={event => {}}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator color={Colors.primaryYellow} />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default PrivacyPolicy
