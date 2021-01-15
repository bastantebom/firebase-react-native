import React from 'react'
import { SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize } from '@/globals'

const TermsOfUse = ({ toggleTermsOfUse }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={toggleTermsOfUse}
        title="Terms of Use"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <WebView source={{ uri: 'https://servbees.com/terms-of-use/' }} />
    </SafeAreaView>
  )
}

export default TermsOfUse
