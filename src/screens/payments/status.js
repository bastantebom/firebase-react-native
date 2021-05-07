import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import firestore from '@react-native-firebase/firestore'

import { Images } from '@/assets/images'
import { ScreenHeaderTitle } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { CommonActions } from '@react-navigation/native'
import { formatNumber } from 'react-native-currency-input'
import { format } from 'date-fns'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { normalizeUnits } from 'moment'

/**
 * @typedef {object} PaymentStatusProps
 * @property {string} status
 * @property {number} amount
 * @property {object} paymentData
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentStatusProps} PaymentStatus
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentStatus'>} param0 */
const PaymentStatusScreen = ({ navigation, route }) => {
  const { status, amount, paymentId, sellerName } = route.params
  const [paymentData, setPaymentData] = useState()

  const statusInfo = {
    success: {
      title: 'Payment Successful',
      description: (
        <Text>
          Your have paid ₱
          <Text style={typography.medium}>
            {formatNumber(amount, {
              separator: '.',
              precision: 2,
              delimiter: ',',
            })}
          </Text>{' '}
          to <Text style={typography.medium}>{sellerName}</Text>
        </Text>
      ),
      label: 'Back',
      image: <Images.PaymentSuccess />,
    },
    failed: {
      title: 'Payment Unsuccessful',
      description: 'The transaction failed due to unspecified reasons.',
      label: 'Try again',
      image: <Images.PaymentFailed />,
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

  const date = format(
    new Date(paymentData ? paymentData.date._seconds * 1000 : Date.now()),
    `MMM${new Date().getMonth() === 4 ? '' : '.'} dd, yyyy hh:mmaa`
  )

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  useEffect(() => {
    if (!paymentId) return
    return firestore()
      .doc(`payments/${paymentId}`)
      .onSnapshot(snapshot => {
        setPaymentData(snapshot.data() || {})
      })
  }, [])

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
        </View>
        <ScreenHeaderTitle close={navigation.goBack} paddingSize={3} />
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            {statusInfo[status].image}
            <View style={styles.infoWrapper}>
              <Text
                style={[
                  typography.body1,
                  typography.medium,
                  typography.textCenter,
                ]}>
                {statusInfo[status].title}
              </Text>
              <Text
                style={[
                  typography.body2,
                  typography.textCenter,
                  { marginTop: normalize(8) },
                ]}>
                {statusInfo[status].description}
              </Text>

              {status === 'success' && (
                <>
                  <Text
                    style={[
                      typography.body2,
                      typography.textCenter,
                      {
                        color: Colors.contentPlaceholder,
                        marginTop: normalize(24),
                      },
                    ]}>
                    Payment Reference ID:
                  </Text>
                  {!!paymentData?.payment_id ? (
                    <Text
                      style={[
                        typography.body2,
                        typography.medium,
                        typography.textCenter,
                        {
                          color: Colors.contentPlaceholder,
                          marginVertical: normalize(4),
                        },
                      ]}>
                      {paymentData?.payment_id}
                    </Text>
                  ) : (
                    <ActivityIndicator
                      style={{ marginVertical: normalize(4) }}
                      size="small"
                      color={Colors.contentOcean}
                    />
                  )}
                  <Text
                    style={[
                      typography.body2,
                      typography.textCenter,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    {date}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              type="primary"
              label={statusInfo[status].label}
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
