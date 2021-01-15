import React from 'react'
import { SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize } from '@/globals'

const PrivacyPolicy = ({ togglePrivacyPolicy }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={togglePrivacyPolicy}
        title="Privacy Policy"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <WebView source={{ uri: 'https://servbees.com/privacy-policy' }} />
    </SafeAreaView>
  )
}

export default PrivacyPolicy
