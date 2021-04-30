import React, { useContext } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { ScreenHeaderTitle } from '@/components'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
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
  const { user } = useContext(UserContext)
  const { orderId, link: uri, amount, title } = route.params

  const handleWebViewStartLoad = event => {
    if (!!event.url.match(/(app\.servbees\.com|dev\-servbees\-web\-app)/)) {
      const { query } = url.parse(event.url, true)
      const { status } = query

      ;(async () => {
        if (status === 'failed') {
          await Api.updateOrder({
            uid: user.uid,
            id: orderId,
            body: { status: 'payment failed' },
          })

          await Api.updateOrder({
            uid: user.uid,
            id: orderId,
            body: { status: 'confirmed' },
          })
        } else {
          await Api.updateOrder({
            uid: user.uid,
            id: orderId,
            body: {
              status: title !== 'Paypal' ? 'paid' : 'payment processing',
            },
          })
        }
      })()

      navigation.navigate('payment-status', { status, amount, orderId })
      return false
    } else return true
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.safeArea}>
        <ScreenHeaderTitle
          close={navigation.goBack}
          title={title}
          paddingSize={3}
        />

        <WebView
          source={{ uri }}
          onShouldStartLoadWithRequest={handleWebViewStartLoad}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
})

export default PaymentWebView
