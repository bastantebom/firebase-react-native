import { ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import url from 'url'

/**
 * @typedef {object} PaymentWebViewProps
 * @property {string} link
 * @property {number} amount
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentWebViewProps} PaymentWebView
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentWebView'>} param0 */
const PaymentWebView = ({ navigation, route }) => {
  const { link: uri, amount, title } = route.params

  const handleWebViewStartLoad = event => {
    if (!!event.url.match(/(app\.servbees\.com|dev\-servbees\-web\-app)/)) {
      const { query } = url.parse(event.url, true)
      const { status } = query
      navigation.navigate('payment-status', { status, amount })
      return false
    } else return true
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeaderTitle
        close={navigation.goBack}
        title={title}
        iconSize={normalize(16)}
        paddingSize={3}
      />

      <WebView
        source={{ uri }}
        onShouldStartLoadWithRequest={handleWebViewStartLoad}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
})

export default PaymentWebView
