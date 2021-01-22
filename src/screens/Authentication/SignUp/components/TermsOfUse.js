import React, { useState } from 'react'
import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'
const TermsOfUse = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false)

  console.log(isLoading)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle close={onClose} title="Terms of Use" paddingSize={3} />
      <WebView
        source={{ uri: 'https://servbees.com/terms/' }}
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

export default TermsOfUse
