import { Colors, normalize } from '@/globals'
import React, { useContext } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { Icons } from '@/assets/images/icons'
import url from 'url'
import firestore from '@react-native-firebase/firestore'

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

      onSuccess({ status })
      return false
    } else return true
  }

  const onSuccess = async ({ status }) => {
    try {
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

      const [paymentQuery, orderSnapshot] = await Promise.all([
        firestore()
          .collection('payments')
          .where('order_id', '==', orderId)
          .orderBy('date', 'desc')
          .get(),
        firestore().collection('orders').doc(orderId).get(),
      ])
      const paymentQuerySnapshot = paymentQuery.docs.map(doc => doc.data())
      const paymentData = paymentQuerySnapshot[0] || {}
      const paymentId = paymentData.id || null
      const orderData = orderSnapshot.data()

      const response = await Api.getUser({ uid: orderData.seller_id })

      navigation.navigate('payment-status', {
        status,
        amount,
        paymentId,
        sellerName: response.data.display_name || response.data.full_name,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>{title}</Text>
          </View>
        </View>

        <WebView
          source={{ uri }}
          onShouldStartLoadWithRequest={handleWebViewStartLoad}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
})

export default PaymentWebView
