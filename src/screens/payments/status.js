import React, { useEffect, useState } from 'react'
import { Alert, StatusBar, StyleSheet, Text, View } from 'react-native'
import { formatNumber } from 'react-native-currency-input'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import firestore from '@react-native-firebase/firestore'

import { Images } from '@/assets/images'
import { AppButton, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { CommonActions } from '@react-navigation/native'
import moment from 'moment'

/**
 * @typedef {object} PaymentStatusProps
 * @property {string} status
 * @property {number} amount
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentStatusProps} PaymentStatus
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentStatus'>} param0 */
const PaymentStatusScreen = ({ navigation, route }) => {
  const { status, amount, orderId } = route.params
  const [paymentInfo, setPaymenInfo] = useState({})
  const [sellerName, setSellerName] = useState(null)

  const statusInfo = {
    success: {
      title: 'Payment Successful',
      description: `You have paid ₱ ${formatNumber(amount, {
        separator: '.',
        precision: 2,
        delimiter: ',',
      })} to ${sellerName}`,
      buttonText: 'Back',
      image: () => <Images.PaymentSuccess />,
      paymentReference: {
        id: paymentInfo?.payment_id,
        date: paymentInfo?.date,
      },
    },
    failed: {
      title: 'Payment Unsuccessful',
      description: 'The transaction failed due to unspecified reasons.',
      buttonText: 'Try again',
      image: () => <Images.PaymentFailed />,
    },
  }

  const backPressHandler = event => {
    event.preventDefault()
    const parentState = navigation.dangerouslyGetParent().dangerouslyGetState()
    const index = parentState.routes.findIndex(route => route.name === 'orders')

    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: parentState.routes.slice(0, index + 1),
      })
    )
  }

  const getPaymentInfo = async () => {
    try {
      const [payment, order] = await Promise.all([
        (async () => {
          const paymentQuery = firestore()
            .collection('payments')
            .where('order_id', '==', orderId)
          const paymentDocs = await paymentQuery.get()
          const paymentData = paymentDocs.docs.map(doc => doc.data())

          return paymentData[0]
        })(),
        (async () => {
          const orderDoc = await firestore()
            .collection('orders')
            .doc(orderId)
            .get()

          return orderDoc.data()
        })(),
      ])

      const userDoc = await firestore()
        .collection('users')
        .doc(order.seller_id)
        .get()
      const userData = userDoc.data()

      setSellerName(
        userData.display_name || userData.full_name || userData.username
      )
      setPaymenInfo(payment)
    } catch (error) {
      console.error(error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    getPaymentInfo()

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.wrapper}>
        <ScreenHeaderTitle close={navigation.goBack} paddingSize={3} />
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            {statusInfo[status].image()}
            <View style={styles.infoWrapper}>
              <Text style={styles.statusTitle}>{statusInfo[status].title}</Text>
              <Text style={styles.statusText}>
                {statusInfo[status].description}
              </Text>
            </View>
            <View style={styles.reference}>
              <Text style={styles.referenceTitle}>Payment Reference ID:</Text>
              <Text style={styles.referenceText}>
                {statusInfo[status]?.paymentReference?.id}
              </Text>
              <Text style={styles.referenceText}>
                {moment
                  .unix(statusInfo[status]?.paymentReference?.date?._seconds)
                  .format('MMM D YYYY, h:mm a') || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <AppButton
              text={statusInfo[status].buttonText}
              type="primary"
              onPress={navigation.goBack}
            />
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  buttonWrapper: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
  },
  infoWrapper: {
    marginTop: normalize(28),
    marginBottom: normalize(20),
  },
  statusTitle: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(16),
    letterSpacing: 0.25,
    lineHeight: normalize(24),
    textAlign: 'center',
  },
  statusText: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    textAlign: 'center',
    marginTop: normalize(8),
  },
  reference: {
    alignItems: 'center',
  },
  referenceTitle: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    letterSpacing: 0.25,
  },
  referenceText: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    letterSpacing: 0.25,
  },
})

export default PaymentStatusScreen
