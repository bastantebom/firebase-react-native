import { Colors, normalize } from '@/globals'
import React, { useContext, useEffect } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { Icons } from '@/assets/images/icons'
import url from 'url'
import { CommonActions } from '@react-navigation/routers'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'

/**
 * @typedef {object} PaymentWebViewProps
 * @property {string} link
 * @property {string} orderId
 * @property {string} title
 * @property {string|undefined} sourceId
 * @property {string} type
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentWebViewProps} PaymentWebView
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentWebView'>} param0 */
const PaymentWebView = ({ navigation, route }) => {
  const { orderId, link: uri, title, sourceId, type } = route.params

  const { user } = useContext(UserContext)

  const handleWebViewStartLoad = event => {
    if (!!event.url.match(/(app\.servbees\.com|dev\-servbees\-web\-app)/)) {
      const { query } = url.parse(event.url, true)
      onSuccess(query)
      return false
    } else return true
  }

  const onSuccess = async ({ status, ...params }) => {
    try {
      if (status === 'failed')
        return navigation.navigate('payment-status', {
          status: 'failed',
        })

      const data = {}
      let paymentRef
      if (type === 'paypal') {
        data.payerId = params.PayerID
        data.paymentId = params.paymentId
      } else if (['gcash', 'grab_pay'].includes(type)) {
        const paymentsRef = firestore().collection('payments')

        const date = firestore.Timestamp.fromDate(new Date())
        paymentRef = await paymentsRef.add({
          order_id: orderId,
          src_id: sourceId,
          uid: user.uid,
          type,
          date_created: date,
          date_modified: date,
          date_paid: undefined,
          status: 'processing',
        })
      }

      navigation.navigate('payment-status', {
        status: 'processing',
        paymentId: params.paymentId || paymentRef.id,
        orderId,
        data,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const backPressHandler = event => {
    event.preventDefault()
    const parentState = navigation.dangerouslyGetParent().dangerouslyGetState()

    const index = parentState.routes.findIndex(route =>
      ['NBTScreen', 'orders'].includes(route.name)
    )

    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.dispatch(
      CommonActions.reset({
        index: index,
        routes: parentState.routes.slice(0, index + 1),
      })
    )
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

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
