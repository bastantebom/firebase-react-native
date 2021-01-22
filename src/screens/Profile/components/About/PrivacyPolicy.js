import React from 'react'
import { SafeAreaView, View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'

const PrivacyPolicy = ({ togglePrivacyPolicy }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={togglePrivacyPolicy}
        title="Privacy Policy"
        paddingSize={3}
      />
      <WebView
        source={{ uri: 'https://servbees.com/privacy/' }}
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
