import { Images } from '@/assets/images'
import { AppButton, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import { CommonActions } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

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
  const { status, amount } = route.params

  const statusInfo = {
    success: {
      title: 'Payment Successful',
      description: `Your payment of ₱${amount.toLocaleString()} was successfuly completed.`,
      buttonText: 'Back',
      image: () => <Images.PaymentSuccess />,
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

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeaderTitle
        close={navigation.goBack}
        paddingSize={3}
        iconSize={normalize(16)}
      />
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {statusInfo[status].image()}
          <View style={styles.infoWrapper}>
            <Text style={styles.statusTitle}>{statusInfo[status].title}</Text>
            <Text style={styles.statusText}>
              {statusInfo[status].description}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
})

export default PaymentStatusScreen
