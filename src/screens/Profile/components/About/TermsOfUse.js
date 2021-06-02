import React from 'react'
import { SafeAreaView, View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'

const TermsOfUse = ({ toggleTermsOfUse }) => {
  const webViewJs = `
  document.querySelector('.card').style.display = 'none';
  document.querySelector('.header').style.display = 'none';
  document.querySelector('.banner-wrapper').style.display = 'none';
  document.querySelector('.bg-design').style.paddingTop = '0';
  document.querySelector('.sub-title-holder').style.display = 'none';
  document.querySelector('.section-cta').style.display = 'none';
  document.querySelector('.footer').style.display = 'none';
  true;
  `
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={toggleTermsOfUse}
        title="Terms of Use"
        paddingSize={3}
      />
      <WebView
        source={{ uri: 'https://servbees.com/terms/' }}
        injectedJavaScript={webViewJs}
        startInLoadingState={true}
        onMessage={event => {}}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator color={Colors.primaryYellow} />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default TermsOfUse
